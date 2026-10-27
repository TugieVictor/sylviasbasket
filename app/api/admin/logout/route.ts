import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  await destroySession()
  return NextResponse.redirect(new URL('/admin/login/', request.url), 303)
}
