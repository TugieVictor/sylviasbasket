import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startPayment } from '@/lib/payments'
import { getIPayConfig } from '@/lib/payments/ipay'
import { createOrder, OrderProblem } from '@/lib/orders'
import { shopEnabled } from '@/lib/shop'
import { verifyTurnstile } from '@/lib/security/turnstile'
import { clientIp, isRateLimited } from '@/lib/security/rateLimit'
import { EMAIL_ERROR, PHONE_ERROR, isValidEmail, normaliseKenyanPhone } from '@/lib/validation'

export const dynamic = 'force-dynamic'

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

/** Places an order from the checkout form and starts the iPay payment. */
export async function POST(request: Request) {
  if (!shopEnabled()) return NextResponse.json({ error: 'The shop is not open yet.' }, { status: 404 })
  const ip = clientIp(request)
  if (isRateLimited(`order:${ip}`, 10)) {
    return NextResponse.json({ error: 'Too many orders in a short time. Please try again later.' }, { status: 429 })
  }
  if (!getIPayConfig().enabled) {
    return NextResponse.json({ error: 'Online payment is not available yet. Please contact us to order.' }, { status: 503 })
  }

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  if (body.website) return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) // spam field

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json({ error: 'We could not confirm you are human. Please refresh the page and try again.' }, { status: 400 })
  }

  const name = text(body.name, 100)
  const email = text(body.email, 200).toLowerCase()
  const phone = normaliseKenyanPhone(text(body.phone, 20))
  const zoneId = text(body.zoneId, 50)
  const address = text(body.address, 500)
  const notes = text(body.notes, 1000)

  const errors: Record<string, string> = {}
  if (!name) errors.name = 'Please enter your name.'
  if (!phone) errors.phone = PHONE_ERROR
  if (!isValidEmail(email)) errors.email = EMAIL_ERROR
  if (!zoneId) errors.zoneId = 'Please choose delivery or collection.'
  else {
    const zone = await prisma.deliveryZone.findFirst({ where: { id: zoneId, active: true } })
    if (!zone) errors.zoneId = 'Please choose delivery or collection.'
    else if (!zone.isPickup && address.length < 5) errors.address = 'Please enter your delivery address.'
  }
  if (Object.keys(errors).length > 0 || !phone) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', errors }, { status: 400 })
  }

  const items = Array.isArray(body.items)
    ? body.items.slice(0, 50).map((i: { variantId?: unknown; quantity?: unknown }) => ({ variantId: text(i?.variantId, 50), quantity: Number(i?.quantity) }))
    : []

  try {
    const order = await createOrder({ items, zoneId, customerName: name, customerPhone: phone, customerEmail: email, address, notes })
    try {
      const { form } = await startPayment({
        purpose: 'ORDER',
        amountKes: order.totalKes,
        phone,
        email,
        siteOrigin: new URL(request.url).origin,
        link: { orderId: order.id },
      })
      return NextResponse.json({ reference: order.reference, form })
    } catch (error) {
      console.error('Could not start order payment:', error)
      // The order is saved; the customer can pay from the order page
      return NextResponse.json({ reference: order.reference })
    }
  } catch (error) {
    if (error instanceof OrderProblem) return NextResponse.json({ error: error.message }, { status: 409 })
    console.error('Order failed:', error)
    return NextResponse.json({ error: 'We could not place your order. Please try again.' }, { status: 500 })
  }
}
