import crypto from 'crypto'
import type { PaymentPurpose, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { buildCheckoutForm, getIPayConfig, normaliseKenyanPhone, verifyWithIPay } from './ipay'
import { describeResult, getMpesaConfig, parseStkCallback, queryStk, sendStkPush } from './mpesa'

/**
 * One payment flow for everything that takes money (orders, course fees,
 * visit fees, donations). See version_2_plan.md, section 6 "Payment flow".
 *
 * Two providers are supported: M-Pesa direct (Safaricom Daraja, the default
 * once its keys are set) and iPay. PAYMENT_PROVIDER=mpesa|ipay forces one.
 */

/** Short, readable, hard-to-guess reference such as PAY-7KQ2M9XA */
export function newReference(prefix: string) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.randomBytes(8)
  let code = ''
  bytes.forEach((byte) => {
    code += alphabet[byte % alphabet.length]
  })
  return `${prefix}-${code}`
}

export type Provider = 'MPESA' | 'IPAY'

/** Which payment provider takes payments now, or null when none is set up (the shop then takes WhatsApp orders). */
export function activeProvider(): Provider | null {
  const forced = process.env.PAYMENT_PROVIDER?.trim().toLowerCase()
  const mpesa = getMpesaConfig().enabled
  const ipay = getIPayConfig()
  const ipayReal = ipay.enabled && !ipay.demo
  if (forced === 'mpesa') return mpesa ? 'MPESA' : null
  if (forced === 'ipay') return ipay.enabled ? 'IPAY' : null
  if (mpesa) return 'MPESA'
  if (ipayReal) return 'IPAY'
  return null
}

export const paymentsEnabled = () => activeProvider() !== null

type StartPayment = {
  purpose: PaymentPurpose
  amountKes: number // always calculated on the server
  phone: string
  email: string
  /** The site's own address (from the incoming request), so customers return to the same site */
  siteOrigin: string
  link?: { orderId?: string; registrationId?: string; visitRequestId?: string; donationId?: string }
}

export type PaymentNext =
  | { form: { action: string; fields: Record<string, string> } } // iPay: send the browser to iPay's page
  | { mpesa: { reference: string; phone: string } } // M-Pesa: a PIN prompt is on its way to this phone

const DESCRIPTIONS: Record<PaymentPurpose, string> = { ORDER: 'Shop order', VISIT: 'Farm visit', COURSE: 'Course fee', DONATION: 'Donation' }

/** Where Safaricom should send its callback. It must be a public https address. */
function mpesaCallbackBase(siteOrigin: string) {
  const configured = process.env.MPESA_CALLBACK_URL?.trim()
  if (configured) return configured
  if (siteOrigin.startsWith('https://')) return siteOrigin
  // Testing on localhost: Safaricom cannot reach it, so we rely on asking Safaricom directly (STK query)
  return process.env.NEXT_PUBLIC_SITE_URL?.startsWith('https://') ? process.env.NEXT_PUBLIC_SITE_URL : 'https://www.sylviasbasket.co.ke'
}

/** Creates the payment record and starts paying: an M-Pesa PIN prompt, or the iPay form. Throws with a message for the customer. */
export async function startPayment({ purpose, amountKes, phone, email, siteOrigin, link = {} }: StartPayment): Promise<{ payment: { id: string; reference: string }; next: PaymentNext }> {
  if (!Number.isInteger(amountKes) || amountKes < 1) throw new Error('Invalid amount')
  const tel = normaliseKenyanPhone(phone)
  if (!tel) throw new Error('Please enter a valid Kenyan mobile number, for example 0712 345 678.')
  const provider = activeProvider()
  if (!provider) throw new Error('Online payment is not available yet. Please contact us.')

  const payment = await prisma.payment.create({
    data: { reference: newReference('PAY'), purpose, amountKes, provider, ...link },
  })

  if (provider === 'MPESA') {
    const sent = await sendStkPush({
      phone: tel,
      amountKes,
      reference: payment.reference,
      description: DESCRIPTIONS[purpose],
      callbackBase: mpesaCallbackBase(siteOrigin),
    })
    if (!sent.ok) {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED', providerCode: 'push-failed' } })
      throw new Error(sent.message)
    }
    await prisma.payment.update({ where: { id: payment.id }, data: { providerRequestId: sent.checkoutRequestId } })
    return { payment, next: { mpesa: { reference: payment.reference, phone: tel } } }
  }

  const form = buildCheckoutForm({
    reference: payment.reference,
    amountKes,
    phone: tel,
    email,
    callbackUrl: `${siteOrigin.replace(/\/$/, '')}/api/payments/ipay/callback`,
  })
  return { payment, next: { form } }
}

/** Marks a payment paid (only once, however many times it is called) and runs the follow-up steps. */
async function confirmPaid(paymentId: string, data: Prisma.PaymentUpdateManyMutationInput, siteOrigin?: string) {
  const moved = await prisma.payment.updateMany({
    where: { id: paymentId, status: { in: ['PENDING', 'FAILED', 'CANCELLED'] } },
    data: { ...data, status: 'COMPLETED', completedAt: new Date() },
  })
  if (moved.count === 1) await onPaymentCompleted(paymentId, siteOrigin)
}

/**
 * Asks Safaricom how an M-Pesa payment ended and records it. Used by the
 * "waiting for payment" screen and to double-check callbacks.
 */
async function refreshMpesaPayment(paymentId: string, siteOrigin?: string, callback?: { amount?: number; receipt?: string; raw?: Prisma.InputJsonValue }) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
  if (!payment || payment.provider !== 'MPESA' || !payment.providerRequestId) return payment
  if (payment.status === 'COMPLETED' || payment.status === 'REVIEW') return payment

  const result = await queryStk(payment.providerRequestId)
  const base = { providerCode: result.code, lastCheckedAt: new Date(), ...(callback?.raw ? { rawCallback: callback.raw } : {}) }

  if (result.status === 'COMPLETED') {
    if (callback?.amount !== undefined && callback.amount + 0.001 < payment.amountKes) {
      // Paid less than expected: never confirm automatically
      return prisma.payment.update({ where: { id: payment.id }, data: { ...base, status: 'REVIEW', providerTxnId: callback.receipt } })
    }
    await confirmPaid(payment.id, { ...base, ...(callback?.receipt ? { providerTxnId: callback.receipt } : {}) }, siteOrigin)
  } else if (result.status === 'FAILED' || result.status === 'CANCELLED') {
    await prisma.payment.updateMany({ where: { id: payment.id, status: 'PENDING' }, data: { ...base, status: result.status } })
  } else {
    await prisma.payment.update({ where: { id: payment.id }, data: base })
  }
  return prisma.payment.findUnique({ where: { id: payment.id } })
}

/** Handles Safaricom's callback. Never trusts it alone: it is checked with Safaricom before anything is marked paid. */
export async function handleMpesaCallback(body: unknown, siteOrigin?: string) {
  const cb = parseStkCallback(body)
  if (!cb) return null
  const payment = await prisma.payment.findUnique({ where: { providerRequestId: cb.checkoutRequestId } })
  if (!payment) return null
  return refreshMpesaPayment(payment.id, siteOrigin, { amount: cb.amount, receipt: cb.receipt, raw: body as Prisma.InputJsonValue })
}

/**
 * Current state of a payment, for the "check your phone" screen. Checks with
 * Safaricom when the answer may have changed (at most every few seconds).
 */
export async function getPaymentProgress(reference: string, siteOrigin?: string) {
  let payment = await prisma.payment.findUnique({ where: { reference } })
  if (!payment) return null
  const age = Date.now() - payment.createdAt.getTime()
  const sinceCheck = payment.lastCheckedAt ? Date.now() - payment.lastCheckedAt.getTime() : Infinity
  if (payment.status === 'PENDING' && payment.provider === 'MPESA' && age > 5000 && sinceCheck > 2500) {
    payment = (await refreshMpesaPayment(payment.id, siteOrigin)) || payment
  }
  const message =
    payment.status === 'COMPLETED'
      ? 'Payment received. Thank you!'
      : payment.status === 'REVIEW'
        ? 'We received a payment that needs checking. We will contact you shortly.'
        : payment.status === 'PENDING'
          ? 'Waiting for you to enter your M-Pesa PIN.'
          : describeResult(payment.providerCode || '').message
  return { status: payment.status, message, receipt: payment.status === 'COMPLETED' ? payment.providerTxnId : null }
}

/**
 * Handles iPay's callback. Returns the payment (or null) after verifying
 * with iPay. Safe to call many times for the same payment.
 */
export async function handleIPayCallback(params: URLSearchParams, siteOrigin?: string) {
  const reference = params.get('id') || ''
  if (!reference) return null

  const payment = await prisma.payment.findUnique({ where: { reference } })
  if (!payment) return null
  if (payment.status === 'COMPLETED' || payment.status === 'REVIEW') return payment

  const verification = await verifyWithIPay(params)
  const rawCallback = Object.fromEntries(params.entries()) as Prisma.InputJsonValue
  const base = { providerCode: verification.code, lastCheckedAt: new Date(), rawCallback }

  if (verification.status === 'COMPLETED') {
    const paid = Number(params.get('mc'))
    if (!Number.isFinite(paid) || paid + 0.001 < payment.amountKes) {
      // Paid less than expected: never confirm automatically
      return prisma.payment.update({ where: { id: payment.id }, data: { ...base, status: 'REVIEW' } })
    }

    // Only one request can move PENDING -> COMPLETED
    await confirmPaid(payment.id, { ...base, providerTxnId: params.get('txncd') || undefined }, siteOrigin)
    return prisma.payment.findUnique({ where: { id: payment.id } })
  }

  if (verification.status === 'FAILED') {
    return prisma.payment.update({ where: { id: payment.id }, data: { ...base, status: 'FAILED' } })
  }

  // PENDING or could not verify: keep pending, record what happened
  return prisma.payment.update({ where: { id: payment.id }, data: base })
}

/**
 * What happens once money is confirmed. Each feature adds its step here as
 * it is built (orders in Stage 8, courses in Stage 9, visits in Stage 7).
 */
async function onPaymentCompleted(paymentId: string, siteOrigin?: string) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
  if (!payment) return

  if (payment.donationId) {
    await prisma.donation.updateMany({
      where: { id: payment.donationId, status: { not: 'COMPLETED' } },
      data: { status: 'COMPLETED', transactionId: payment.providerTxnId },
    })
  }
  if (payment.orderId) {
    const { markOrderPaid } = await import('@/lib/orders')
    const result = await markOrderPaid(payment.orderId)
    if (result) {
      const { emailOrderPaid } = await import('@/lib/email/orders')
      await emailOrderPaid(result.order, result.stockWarning, siteOrigin).catch((error) => console.error('Order paid emails failed:', error))
    }
  }
  if (payment.registrationId) {
    await prisma.registration.updateMany({
      where: { id: payment.registrationId, status: 'AWAITING_PAYMENT' },
      data: { status: 'CONFIRMED' },
    })
  }
  if (payment.visitRequestId) {
    const moved = await prisma.visitRequest.updateMany({
      where: { id: payment.visitRequestId, status: 'CONFIRMED' },
      data: { status: 'PAID' },
    })
    if (moved.count === 1) {
      const visit = await prisma.visitRequest.findUnique({ where: { id: payment.visitRequestId } })
      if (visit) {
        const { emailVisitPaid } = await import('@/lib/email/visits')
        await emailVisitPaid(visit).catch((error) => console.error('Visit paid emails failed:', error))
      }
    }
  }
}
