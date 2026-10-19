import { NextResponse } from 'next/server'
import { describeCart, shopEnabled } from '@/lib/shop'
import { releaseExpiredOrders } from '@/lib/orders'
import { clientIp, isRateLimited } from '@/lib/security/rateLimit'

export const dynamic = 'force-dynamic'

/** Returns current names, prices and stock for the items in a visitor's cart. */
export async function POST(request: Request) {
  if (!shopEnabled()) return NextResponse.json({ error: 'The shop is not open yet' }, { status: 404 })
  if (isRateLimited(`cart:${clientIp(request)}`, 200)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
  }
  const body = await request.json().catch(() => null)
  const items = Array.isArray(body?.items)
    ? body.items
        .filter((i: unknown) => i && typeof (i as { variantId: unknown }).variantId === 'string')
        .map((i: { variantId: string; quantity: unknown }) => ({ variantId: i.variantId.slice(0, 50), quantity: Number(i.quantity) }))
    : []
  await releaseExpiredOrders()
  return NextResponse.json({ items: await describeCart(items) })
}
