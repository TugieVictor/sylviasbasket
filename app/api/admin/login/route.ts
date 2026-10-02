import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth/session'
import { verifyPassword } from '@/lib/auth/password'

export const dynamic = 'force-dynamic'

// Simple slow-down for repeated failures from the same address (per server instance)
const failures = new Map<string, { count: number; until: number }>()
const MAX_FAILURES = 5
const LOCK_MINUTES = 15

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const record = failures.get(ip)
  if (record && record.count >= MAX_FAILURES && record.until > Date.now()) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait 15 minutes and try again.' },
      { status: 429 }
    )
  }

  let email = ''
  let password = ''
  try {
    const body = await request.json()
    email = String(body.email || '').trim().toLowerCase()
    password = String(body.password || '')
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const user = email ? await prisma.adminUser.findUnique({ where: { email } }) : null
  const valid = !!user && user.active && verifyPassword(password, user.passwordHash)

  if (!valid) {
    const current = failures.get(ip)
    failures.set(ip, {
      count: (current && current.until > Date.now() ? current.count : 0) + 1,
      until: Date.now() + LOCK_MINUTES * 60 * 1000,
    })
    // Same message whether the email or the password was wrong
    return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 })
  }

  failures.delete(ip)
  await createSession(user.id)
  return NextResponse.json({ success: true })
}
