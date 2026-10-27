import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth/session'
import { startPayment } from '@/lib/payments'
import { getIPayConfig } from '@/lib/payments/ipay'

export const dynamic = 'force-dynamic'

/** Admin-only: starts a KES 10 test payment to check the iPay connection. */
export async function POST(request: Request) {
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const config = getIPayConfig()
  if (!config.enabled) return NextResponse.json({ error: 'iPay is not configured' }, { status: 503 })

  const { phone } = await request.json().catch(() => ({ phone: '' }))
  try {
    const { payment, form } = await startPayment({
      purpose: 'DONATION',
      amountKes: 10,
      phone,
      email: admin.email,
      siteOrigin: new URL(request.url).origin,
    })
    return NextResponse.json({ reference: payment.reference, form, mode: config.demo ? 'demo' : config.live ? 'live' : 'test' })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
