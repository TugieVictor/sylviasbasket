import { NextResponse } from 'next/server'
import { getPaymentProgress } from '@/lib/payments'
import { clientIp, isRateLimited } from '@/lib/security/rateLimit'

export const dynamic = 'force-dynamic'

/** How a payment is going, for the "check your phone" screen. Only the status is shared. */
export async function GET(request: Request) {
  if (isRateLimited(`pay-status:${clientIp(request)}`, 300)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
  }
  const reference = (new URL(request.url).searchParams.get('ref') || '').slice(0, 40)
  if (!/^PAY-[A-Z0-9]{8}$/.test(reference)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const progress = await getPaymentProgress(reference, new URL(request.url).origin)
  if (!progress) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(progress, { headers: { 'Cache-Control': 'no-store' } })
}
