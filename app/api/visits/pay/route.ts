import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startPayment } from '@/lib/payments'
import { getIPayConfig } from '@/lib/payments/ipay'
import { clientIp, isRateLimited } from '@/lib/security/rateLimit'

export const dynamic = 'force-dynamic'

/** Starts the iPay payment for a confirmed farm visit. The amount comes from the database. */
export async function POST(request: Request) {
  if (isRateLimited(`visit-pay:${clientIp(request)}`, 10)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again in a few minutes.' }, { status: 429 })
  }
  const body = await request.json().catch(() => ({}))
  const visit = await prisma.visitRequest.findUnique({ where: { reference: String(body.reference || '') } })

  if (!visit) return NextResponse.json({ error: 'Visit not found' }, { status: 404 })
  if (visit.status === 'PAID' || visit.status === 'COMPLETED') {
    return NextResponse.json({ error: 'This visit has already been paid.' }, { status: 400 })
  }
  if (visit.status !== 'CONFIRMED' || !visit.feeKes || visit.feeKes < 1) {
    return NextResponse.json({ error: 'This visit is not ready for payment.' }, { status: 400 })
  }
  if (!getIPayConfig().enabled) {
    return NextResponse.json({ error: 'Online payment is not available yet. Please contact us.' }, { status: 503 })
  }

  const email = String(body.email || visit.email || '').trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address for your receipt.' }, { status: 400 })
  }

  try {
    const { form } = await startPayment({
      purpose: 'VISIT',
      amountKes: visit.feeKes,
      phone: String(body.phone || visit.phone),
      email,
      siteOrigin: new URL(request.url).origin,
      link: { visitRequestId: visit.id },
    })
    return NextResponse.json({ form })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
