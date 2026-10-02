import { NextResponse } from 'next/server'
import { handleIPayCallback } from '@/lib/payments'

export const dynamic = 'force-dynamic'

/** iPay returns the customer here after checkout (GET). POST is accepted too. */
async function handle(request: Request, params: URLSearchParams) {
  const reference = params.get('id') || ''
  try {
    await handleIPayCallback(params)
  } catch (error) {
    console.error('iPay callback error:', error)
  }
  const target = reference ? `/payment/${encodeURIComponent(reference)}/` : '/'
  return NextResponse.redirect(new URL(target, request.url), 303)
}

export async function GET(request: Request) {
  return handle(request, new URL(request.url).searchParams)
}

export async function POST(request: Request) {
  const params = new URLSearchParams(new URL(request.url).search)
  try {
    const form = await request.formData()
    form.forEach((value, key) => params.set(key, String(value)))
  } catch {
    // no form body
  }
  return handle(request, params)
}
