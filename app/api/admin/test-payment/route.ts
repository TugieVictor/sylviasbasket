import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth/session'
import { activeProvider, startPayment } from '@/lib/payments'

export const dynamic = 'force-dynamic'

/** Admin-only: starts a small test payment (KES 1 by M-Pesa, KES 10 by iPay) to check the payment connection. */
export async function POST(request: Request) {
  const admin = await getCurrentAdmin()
  if (!admin) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const provider = activeProvider()
  if (!provider) return NextResponse.json({ error: 'Online payment is not set up' }, { status: 503 })

  const { phone } = await request.json().catch(() => ({ phone: '' }))
  try {
    const { next } = await startPayment({
      purpose: 'DONATION',
      amountKes: provider === 'MPESA' ? 1 : 10,
      phone: String(phone || ''),
      email: admin.email,
      siteOrigin: new URL(request.url).origin,
    })
    return NextResponse.json({ next })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
