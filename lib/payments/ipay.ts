import crypto from 'crypto'

/**
 * iPay Africa web checkout (hosted payment page).
 * Docs: https://dev.ipayafrica.com/C2B.html
 *
 * Flow: we send the customer to iPay with a signed form; after paying, iPay
 * sends the customer back to our callback with transaction details; we then
 * confirm the transaction with iPay's IPN endpoint before trusting it.
 *
 * Settings (environment variables):
 *   IPAY_VENDOR_ID, IPAY_HASH_KEY  from Sylvia's iPay account
 *   IPAY_MODE                      "live" for real payments, anything else = test
 * With no settings, iPay's public demo account is used in development only.
 */

export const IPAY_CHECKOUT_URL = 'https://payments.ipayafrica.com/v3/ke'
const IPAY_IPN_URL = 'https://www.ipayafrica.com/ipn/'
const DEMO = { vendorId: 'demo', hashKey: 'demoCHANGED' }

export function getIPayConfig() {
  const vendorId = process.env.IPAY_VENDOR_ID?.trim() || ''
  const hashKey = process.env.IPAY_HASH_KEY?.trim() || ''
  const hasRealAccount = vendorId.length >= 3 && hashKey.length >= 8
  const allowDemo = process.env.NODE_ENV !== 'production'

  if (hasRealAccount) {
    return { vendorId, hashKey, live: process.env.IPAY_MODE === 'live', demo: false, enabled: true }
  }
  if (allowDemo) {
    return { ...DEMO, live: false, demo: true, enabled: true }
  }
  return { vendorId: '', hashKey: '', live: false, demo: false, enabled: false }
}

/** Kenyan phone numbers in the 2547XXXXXXXX form iPay expects. Returns null if invalid. */
export function normaliseKenyanPhone(input: string): string | null {
  const digits = String(input || '').replace(/\D/g, '')
  let local = digits
  if (local.startsWith('254')) local = local.slice(3)
  else if (local.startsWith('0')) local = local.slice(1)
  if (!/^[17]\d{8}$/.test(local)) return null
  return `254${local}`
}

export type CheckoutRequest = {
  reference: string // our payment reference (iPay "oid")
  amountKes: number
  phone: string // 2547XXXXXXXX
  email: string
  callbackUrl: string
}

/**
 * The signed form fields for iPay's hosted checkout.
 * Hash: HMAC-SHA1 of live+oid+inv+ttl+tel+eml+vid+curr+p1+p2+p3+p4+cbk+cst+crl
 */
export function buildCheckoutForm(request: CheckoutRequest) {
  const config = getIPayConfig()
  if (!config.enabled) throw new Error('iPay is not configured')

  const fields: Record<string, string> = {
    live: config.live ? '1' : '0',
    oid: request.reference,
    inv: request.reference,
    ttl: String(Math.round(request.amountKes)),
    tel: request.phone,
    eml: request.email,
    vid: config.vendorId,
    curr: 'KES',
    p1: '',
    p2: '',
    p3: '',
    p4: '',
    cbk: request.callbackUrl,
    cst: '1', // iPay emails the customer a notification
    crl: '0', // send the customer back to cbk in the browser
  }

  const order = ['live', 'oid', 'inv', 'ttl', 'tel', 'eml', 'vid', 'curr', 'p1', 'p2', 'p3', 'p4', 'cbk', 'cst', 'crl']
  const data = order.map((key) => fields[key]).join('')
  fields.hsh = crypto.createHmac('sha1', config.hashKey).update(data).digest('hex')

  return { action: IPAY_CHECKOUT_URL, fields }
}

export const IPAY_STATUS = {
  SUCCESS: 'aei7p7yrx4ae34',
  PENDING: 'bdi6p2yy76etrs',
  FAILED: 'fe2707etr5s4wq',
  USED: 'cr5i3pgy9867e1',
  AMOUNT_TOO_LOW: 'dtfi4p7yty45wq',
  AMOUNT_TOO_HIGH: 'eq3i7p5yt7645e',
} as const

export type VerifiedStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'UNVERIFIED'

/**
 * Ask iPay whether a transaction is genuine, using the values it appended to
 * the callback URL. The status in the callback itself is never trusted.
 */
export async function verifyWithIPay(params: URLSearchParams): Promise<{ status: VerifiedStatus; code: string }> {
  const config = getIPayConfig()
  if (!config.enabled) return { status: 'UNVERIFIED', code: 'not-configured' }

  const query = new URLSearchParams({ vendor: config.vendorId })
  for (const key of ['id', 'ivm', 'qwh', 'afd', 'poi', 'uyt', 'ifd']) {
    const value = params.get(key)
    if (!value) return { status: 'UNVERIFIED', code: `missing-${key}` }
    query.set(key, value)
  }

  try {
    const response = await fetch(`${IPAY_IPN_URL}?${query.toString()}`, { cache: 'no-store' })
    const code = (await response.text()).trim()
    if (code === IPAY_STATUS.SUCCESS) return { status: 'COMPLETED', code }
    if (code === IPAY_STATUS.PENDING) return { status: 'PENDING', code }
    if (Object.values(IPAY_STATUS).includes(code as never)) return { status: 'FAILED', code }
    return { status: 'UNVERIFIED', code: code.slice(0, 40) || 'empty-response' }
  } catch (error) {
    console.error('iPay IPN query failed:', error)
    return { status: 'UNVERIFIED', code: 'ipn-unreachable' }
  }
}
