import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isIPayConfigured, verifyIPayTransaction } from '@/lib/donations/ipay'

export const dynamic = 'force-dynamic'

/**
 * iPay callback for donations.
 *
 * iPay sends the customer back here (GET) with transaction parameters.
 * We never trust those parameters on their own: the transaction is confirmed
 * with iPay's IPN endpoint, and the paid amount is checked against the
 * donation, before anything is marked as completed.
 */
async function handleCallback(request: Request, params: URLSearchParams) {
  const redirectTo = (path: string) => NextResponse.redirect(new URL(path, request.url), 303)
  const orderId = params.get('id') || ''

  if (!orderId) {
    return redirectTo('/donate/failure/')
  }

  const failurePath = `/donate/failure/?orderId=${encodeURIComponent(orderId)}`
  const successPath = `/donate/success/?orderId=${encodeURIComponent(orderId)}`

  if (!isIPayConfigured()) {
    console.error('iPay callback received but iPay is not configured. Ignoring.')
    return redirectTo(failurePath)
  }

  try {
    const donation = await prisma.donation.findUnique({ where: { orderId } })
    if (!donation) {
      return redirectTo('/donate/failure/')
    }

    // Already confirmed earlier: nothing to do (repeat callbacks are ignored)
    if (donation.status === 'COMPLETED') {
      return redirectTo(successPath)
    }

    const verification = await verifyIPayTransaction(params)

    if (verification.status === 'COMPLETED') {
      const amountPaid = Number(params.get('mc'))
      if (!Number.isFinite(amountPaid) || amountPaid + 0.001 < donation.amount) {
        console.error('iPay amount mismatch, donation left pending for review', {
          orderId,
          expected: donation.amount,
          received: params.get('mc'),
        })
        return redirectTo(failurePath)
      }

      // Only the first confirmation updates the record and sends emails
      const updated = await prisma.donation.updateMany({
        where: { orderId, status: { not: 'COMPLETED' } },
        data: {
          status: 'COMPLETED',
          transactionId: params.get('txncd') || undefined,
        },
      })

      if (updated.count === 1) {
        const { sendDonationReceipt, sendAdminNotification } = await import('@/lib/donations/email')
        sendDonationReceipt({
          orderId: donation.orderId,
          donorName: donation.donorName,
          donorEmail: donation.donorEmail,
          amount: donation.amount,
          donationType: donation.donationType,
          paymentMethod: donation.paymentMethod,
          transactionId: params.get('txncd') || undefined,
          createdAt: donation.createdAt,
        }).catch(err => console.error('Failed to send receipt:', err))

        sendAdminNotification({
          orderId: donation.orderId,
          donorName: donation.donorName,
          donorEmail: donation.donorEmail,
          donorPhone: donation.donorPhone,
          amount: donation.amount,
          donationType: donation.donationType,
          paymentMethod: donation.paymentMethod,
          message: donation.message || undefined,
        }).catch(err => console.error('Failed to send admin notification:', err))
      }

      return redirectTo(successPath)
    }

    if (verification.status === 'PENDING') {
      // Leave as pending; it can be re-checked later
      return redirectTo(successPath)
    }

    // Only a definite answer from iPay marks the donation as failed.
    // Incomplete callbacks (possibly fake) change nothing.
    if (verification.code.startsWith('missing-')) {
      return redirectTo(failurePath)
    }

    await prisma.donation.updateMany({
      where: { orderId, status: 'PENDING' },
      data: { status: 'FAILED' },
    })
    return redirectTo(failurePath)
  } catch (error) {
    console.error('iPay callback error:', error)
    return redirectTo(failurePath)
  }
}

export async function GET(request: Request) {
  return handleCallback(request, new URL(request.url).searchParams)
}

export async function POST(request: Request) {
  const params = new URLSearchParams(new URL(request.url).search)
  try {
    const form = await request.formData()
    form.forEach((value, key) => params.set(key, String(value)))
  } catch {
    // Body was not form data; query parameters only
  }
  return handleCallback(request, params)
}
