/**
 * Cloudflare Turnstile (free spam protection for forms).
 *
 * Settings:
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY  shown in the browser
 *   TURNSTILE_SECRET_KEY            server only
 * During development without keys, Cloudflare's official always-pass test
 * keys are used. In production without keys, checks are skipped (forms keep
 * working, the hidden spam field still applies) and a warning is logged.
 */
const TEST_SECRET = '1x0000000000000000000000000000000AA'

export async function verifyTurnstile(token: string | undefined | null, ip?: string | null) {
  const secret =
    process.env.TURNSTILE_SECRET_KEY || (process.env.NODE_ENV !== 'production' ? TEST_SECRET : '')

  if (!secret) {
    console.warn('TURNSTILE_SECRET_KEY not set: spam check skipped')
    return true
  }
  if (!token) return false

  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip) body.set('remoteip', ip)
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    })
    const result = (await response.json()) as { success?: boolean }
    return result.success === true
  } catch (error) {
    console.error('Turnstile check failed:', error)
    return false
  }
}
