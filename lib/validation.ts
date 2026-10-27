/**
 * Checks shared by the forms (in the browser) and the server routes,
 * so both sides apply exactly the same rules.
 */

const EMAIL_PATTERN =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/

/** A real-looking email address: name@domain.tld, no spaces, no double dots. */
export function isValidEmail(input: string): boolean {
  const email = String(input || '').trim()
  if (email.length > 254 || email.includes('..')) return false
  const local = email.split('@')[0] || ''
  if (local.length > 64 || local.startsWith('.') || local.endsWith('.')) return false
  return EMAIL_PATTERN.test(email)
}

/**
 * Kenyan mobile numbers only (Safaricom, Airtel, Telkom and others start with 07 or 01).
 * Accepts 0712345678, 712345678, 254712345678 and +254 712 345 678.
 * Returns the number as 2547XXXXXXXX / 2541XXXXXXXX, or null if it is not valid.
 */
export function normaliseKenyanPhone(input: string): string | null {
  const raw = String(input || '').trim()
  if (/[^\d\s()+.-]/.test(raw)) return null // letters or other symbols
  const digits = raw.replace(/\D/g, '')
  let local = digits
  if (local.startsWith('254')) local = local.slice(3)
  else if (local.startsWith('0')) local = local.slice(1)
  if (!/^[17]\d{8}$/.test(local)) return null
  return `254${local}`
}

export const EMAIL_ERROR = 'Please enter a valid email address, for example name@gmail.com.'
export const PHONE_ERROR = 'Please enter a valid Kenyan mobile number, for example 0712 345 678.'
