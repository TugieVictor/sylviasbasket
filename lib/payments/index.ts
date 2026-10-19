import crypto from 'crypto'
import type { PaymentPurpose, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { buildCheckoutForm, normaliseKenyanPhone, verifyWithIPay } from './ipay'

/**
 * One payment flow for everything that takes money (orders, course fees,
 * visit fees, donations). See version_2_plan.md, section 6 "Payment flow".
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

type StartPayment = {
  purpose: PaymentPurpose
  amountKes: number // always calculated on the server
  phone: string
  email: string
  /** The site's own address (from the incoming request), so iPay returns customers to the same site */
  siteOrigin: string
  link?: { orderId?: string; registrationId?: string; visitRequestId?: string; donationId?: string }
}

/** Creates the payment record and returns the signed iPay form to send the customer to. */
export async function startPayment({ purpose, amountKes, phone, email, siteOrigin, link = {} }: StartPayment) {
  if (!Number.isInteger(amountKes) || amountKes < 1) throw new Error('Invalid amount')
  const tel = normaliseKenyanPhone(phone)
  if (!tel) throw new Error('Please enter a valid Kenyan phone number')

  const payment = await prisma.payment.create({
    data: { reference: newReference('PAY'), purpose, amountKes, ...link },
  })

  const form = buildCheckoutForm({
    reference: payment.reference,
    amountKes,
    phone: tel,
    email,
    callbackUrl: `${siteOrigin.replace(/\/$/, '')}/api/payments/ipay/callback`,
  })
  return { payment, form }
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
    const moved = await prisma.payment.updateMany({
      where: { id: payment.id, status: { in: ['PENDING', 'FAILED'] } },
      data: {
        ...base,
        status: 'COMPLETED',
        completedAt: new Date(),
        providerTxnId: params.get('txncd') || undefined,
      },
    })
    if (moved.count === 1) await onPaymentCompleted(payment.id, siteOrigin)
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
