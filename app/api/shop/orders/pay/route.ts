import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { paymentsEnabled, startPayment } from '@/lib/payments'
import { PHONE_ERROR, normaliseKenyanPhone } from '@/lib/validation'
import { releaseExpiredOrders } from '@/lib/orders'
import { clientIp, isRateLimited } from '@/lib/security/rateLimit'

export const dynamic = 'force-dynamic'

/** Starts a new payment attempt for an unpaid order, while its stock is still held. */
export async function POST(request: Request) {
  if (isRateLimited(`order-pay:${clientIp(request)}`, 10)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again in a few minutes.' }, { status: 429 })
  }
  if (!paymentsEnabled()) {
    return NextResponse.json({ error: 'Online payment is not available yet. Please contact us.' }, { status: 503 })
  }
  await releaseExpiredOrders()

  const body = await request.json().catch(() => ({}))
  const order = await prisma.order.findUnique({ where: { reference: String(body.reference || '').slice(0, 40) } })
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
  if (order.status !== 'AWAITING_PAYMENT') {
    return NextResponse.json(
      { error: order.status === 'EXPIRED' ? 'This order expired because it was not paid in time. Please order again.' : 'This order does not need payment.' },
      { status: 400 }
    )
  }

  // The customer may pay from another M-Pesa number than the one on the order
  const phone = body.phone ? normaliseKenyanPhone(String(body.phone).slice(0, 20)) : order.customerPhone
  if (!phone) return NextResponse.json({ error: PHONE_ERROR }, { status: 400 })

  try {
    const { next } = await startPayment({
      purpose: 'ORDER',
      amountKes: order.totalKes,
      phone,
      email: order.customerEmail || '',
      siteOrigin: new URL(request.url).origin,
      link: { orderId: order.id },
    })
    return NextResponse.json({ next })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
