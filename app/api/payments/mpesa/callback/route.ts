import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { handleMpesaCallback } from '@/lib/payments'
import { callbackToken, getMpesaConfig } from '@/lib/payments/mpesa'

export const dynamic = 'force-dynamic'

const accepted = () => NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })

/**
 * Safaricom posts the result of each M-Pesa PIN prompt here. The address has a
 * secret token, and every result is checked with Safaricom before use.
 */
export async function POST(request: Request) {
  const config = getMpesaConfig()
  const given = new URL(request.url).searchParams.get('t') || ''
  const expected = callbackToken(config)
  const valid = config.enabled && given.length === expected.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))
  if (!valid) return NextResponse.json({ ResultCode: 1, ResultDesc: 'Rejected' }, { status: 403 })

  const body = await request.json().catch(() => null)
  try {
    await handleMpesaCallback(body, new URL(request.url).origin)
  } catch (error) {
    console.error('M-Pesa callback error:', error)
  }
  return accepted()
}
