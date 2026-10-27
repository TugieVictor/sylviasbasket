import crypto from 'crypto'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

/**
 * Admin sessions.
 * The browser holds a random token in an httpOnly cookie. The database only
 * stores a SHA-256 fingerprint of it, so a database leak does not expose
 * working logins.
 */
export const SESSION_COOKIE = 'sb_admin'
const SESSION_DAYS = 7

const fingerprint = (token: string) => crypto.createHash('sha256').update(token).digest('hex')

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)

  await prisma.adminSession.create({ data: { tokenHash: fingerprint(token), userId, expiresAt } })
  await prisma.adminUser.update({ where: { id: userId }, data: { lastLoginAt: new Date() } })
  // Tidy up expired sessions while we are here
  await prisma.adminSession.deleteMany({ where: { expiresAt: { lt: new Date() } } })

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

/** The signed-in admin, or null. Use in server components and API routes. */
export async function getCurrentAdmin() {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash: fingerprint(token) },
    include: { user: { select: { id: true, name: true, email: true, role: true, active: true } } },
  })
  if (!session || session.expiresAt < new Date() || !session.user.active) return null
  return session.user
}

export async function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (token) {
    await prisma.adminSession.deleteMany({ where: { tokenHash: fingerprint(token) } })
  }
  cookies().delete(SESSION_COOKIE)
}
