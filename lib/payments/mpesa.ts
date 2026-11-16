import crypto from 'crypto'

/**
 * M-Pesa Express (STK push) through Safaricom's Daraja API.
 * Docs: https://developer.safaricom.co.ke (Authorization, M-Pesa Express)
 *
 * Flow: we ask Safaricom to send a PIN prompt to the customer's phone; the
 * customer enters their PIN; Safaricom tells our callback, and we also ask
 * Safaricom directly (STK query) before marking anything paid.
 *
 * Settings (environment variables):
 *   MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET  from the Daraja app
 *   MPESA_ENV          "production" for real payments, otherwise the test (sandbox) system
 *   MPESA_SHORTCODE    Paybill number, or the store number for a Till (sandbox default 174379)
 *   MPESA_PASSKEY      from Safaricom when going live (sandbox default is Safaricom's public test passkey)
 *   MPESA_TYPE         "paybill" (default) or "till"
 *   MPESA_TILL_NUMBER  the Till number customers pay to (Till only)
 *   MPESA_CALLBACK_URL optional: the public site address Safaricom should call back,
 *                      e.g. https://www.sylviasbasket.co.ke (needed when testing on localhost)
 */

// Safaricom's published sandbox test values (not secret)
const SANDBOX_SHORTCODE = '174379'
const SANDBOX_PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'

export type MpesaConfig = {
  enabled: boolean
  live: boolean
  baseUrl: string
  consumerKey: string
  consumerSecret: string
  shortcode: string
  passkey: string
  partyB: string
  transactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline'
  problem?: string // why it is not enabled
}

export function getMpesaConfig(): MpesaConfig {
  const env = (name: string) => process.env[name]?.trim() || ''
  const live = env('MPESA_ENV') === 'production'
  const consumerKey = env('MPESA_CONSUMER_KEY')
  const consumerSecret = env('MPESA_CONSUMER_SECRET')
  const shortcode = env('MPESA_SHORTCODE') || (live ? '' : SANDBOX_SHORTCODE)
  const passkey = env('MPESA_PASSKEY') || (live ? '' : SANDBOX_PASSKEY)
  const till = env('MPESA_TYPE') === 'till'
  const partyB = till ? env('MPESA_TILL_NUMBER') : shortcode
  const base = {
    live,
    baseUrl: live ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke',
    consumerKey,
    consumerSecret,
    shortcode,
    passkey,
    partyB,
    transactionType: till ? ('CustomerBuyGoodsOnline' as const) : ('CustomerPayBillOnline' as const),
  }

  let problem = ''
  if (!consumerKey || !consumerSecret) problem = 'The M-Pesa keys are not set'
  else if (!shortcode || !passkey) problem = 'The M-Pesa shortcode or passkey is not set'
  else if (till && !partyB) problem = 'The Till number is not set'
  // The public website only takes real payments, never test ones
  else if (!live && process.env.VERCEL_ENV === 'production') problem = 'M-Pesa is in test mode, which is switched off on the live website'
  return { ...base, enabled: !problem, problem: problem || undefined }
}

/** Secret part of our callback address, so only Safaricom (who we gave it to) knows it. */
export function callbackToken(config = getMpesaConfig()) {
  return crypto.createHash('sha256').update(`sb-mpesa-callback:${config.consumerSecret}`).digest('hex').slice(0, 32)
}

/** YYYYMMDDHHmmss in Kenya time, as Daraja expects */
function timestamp() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type: string) => parts.find((p) => p.type === type)?.value || '00'
  return `${get('year')}${get('month')}${get('day')}${get('hour')}${get('minute')}${get('second')}`
}

const password = (config: MpesaConfig, time: string) => Buffer.from(`${config.shortcode}${config.passkey}${time}`).toString('base64')

// Access tokens last an hour; keep one per server instance
let cachedToken: { value: string; expires: number; key: string } | null = null

async function accessToken(config: MpesaConfig) {
  if (cachedToken && cachedToken.key === config.consumerKey && cachedToken.expires > Date.now()) return cachedToken.value
  const basic = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64')
  const response = await fetch(`${config.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${basic}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  })
  const data = (await response.json().catch(() => ({}))) as { access_token?: string; expires_in?: string | number }
  if (!response.ok || !data.access_token) throw new Error(`M-Pesa sign-in failed (${response.status})`)
  const seconds = Number(data.expires_in) || 3599
  cachedToken = { value: data.access_token, expires: Date.now() + (seconds - 60) * 1000, key: config.consumerKey }
  return data.access_token
}

async function post(config: MpesaConfig, path: string, body: Record<string, unknown>) {
  const token = await accessToken(config)
  const response = await fetch(`${config.baseUrl}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(20000),
  })
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>
  return { ok: response.ok, status: response.status, data }
}

export type StkPushResult =
  | { ok: true; checkoutRequestId: string; merchantRequestId: string }
  | { ok: false; message: string }

/** Sends the PIN prompt to the customer's phone. phone must be 2547XXXXXXXX or 2541XXXXXXXX. */
export async function sendStkPush(input: { phone: string; amountKes: number; reference: string; description: string; callbackBase: string }): Promise<StkPushResult> {
  const config = getMpesaConfig()
  if (!config.enabled) return { ok: false, message: config.problem || 'M-Pesa is not set up' }
  const time = timestamp()
  const callbackUrl = `${input.callbackBase.replace(/\/$/, '')}/api/payments/mpesa/callback/?t=${callbackToken(config)}`

  try {
    const { ok, data } = await post(config, '/mpesa/stkpush/v1/processrequest', {
      BusinessShortCode: config.shortcode,
      Password: password(config, time),
      Timestamp: time,
      TransactionType: config.transactionType,
      Amount: input.amountKes,
      PartyA: input.phone,
      PartyB: config.partyB,
      PhoneNumber: input.phone,
      CallBackURL: callbackUrl,
      AccountReference: input.reference.slice(0, 12),
      TransactionDesc: input.description.slice(0, 13),
    })
    if (ok && data.ResponseCode === '0' && typeof data.CheckoutRequestID === 'string') {
      return { ok: true, checkoutRequestId: data.CheckoutRequestID, merchantRequestId: String(data.MerchantRequestID || '') }
    }
    // The address is logged without its secret part, to help if Safaricom refuses it
    console.error('M-Pesa STK push refused:', data, 'callback host:', new URL(callbackUrl).host)
    return { ok: false, message: 'M-Pesa could not send the payment request. Please check the phone number and try again.' }
  } catch (error) {
    console.error('M-Pesa STK push failed:', error)
    return { ok: false, message: 'We could not reach M-Pesa just now. Please try again in a moment.' }
  }
}

export type StkStatus = { status: 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'PENDING'; code: string; message: string }

/** What a Daraja result code means for the customer. */
export function describeResult(code: string): StkStatus {
  switch (code) {
    case '0':
      return { status: 'COMPLETED', code, message: 'Payment received.' }
    case '1032':
      return { status: 'CANCELLED', code, message: 'The payment was cancelled on the phone.' }
    case '1037':
      return { status: 'FAILED', code, message: 'We could not reach the phone. Make sure it is on and has network, then try again.' }
    case '1':
      return { status: 'FAILED', code, message: 'The M-Pesa balance is too low for this payment.' }
    case '2001':
      return { status: 'FAILED', code, message: 'The M-Pesa PIN was wrong. Please try again.' }
    case '1001':
      return { status: 'FAILED', code, message: 'Another M-Pesa payment is in progress on this phone. Please wait a minute and try again.' }
    case '1019':
      return { status: 'FAILED', code, message: 'The payment request expired before it was completed. Please try again.' }
    case '4999':
      return { status: 'PENDING', code, message: 'Still waiting for the payment.' }
    default:
      return { status: 'FAILED', code, message: 'The payment did not go through. No money was taken.' }
  }
}

/** Asks Safaricom directly how a payment request ended. Never throws. */
export async function queryStk(checkoutRequestId: string): Promise<StkStatus> {
  const config = getMpesaConfig()
  if (!config.enabled) return { status: 'PENDING', code: 'not-configured', message: 'Still waiting for the payment.' }
  const time = timestamp()
  try {
    const { data } = await post(config, '/mpesa/stkpushquery/v1/query', {
      BusinessShortCode: config.shortcode,
      Password: password(config, time),
      Timestamp: time,
      CheckoutRequestID: checkoutRequestId,
    })
    if (data.ResultCode !== undefined && data.ResultCode !== null && data.ResultCode !== '') {
      return describeResult(String(data.ResultCode))
    }
    // e.g. "The transaction is being processed": the customer has not finished yet
    return { status: 'PENDING', code: String(data.errorCode || 'processing'), message: 'Still waiting for the payment.' }
  } catch (error) {
    console.error('M-Pesa STK query failed:', error)
    return { status: 'PENDING', code: 'query-error', message: 'Still waiting for the payment.' }
  }
}

export type StkCallback = {
  checkoutRequestId: string
  resultCode: string
  amount?: number
  receipt?: string
  phone?: string
}

/** Reads the body Safaricom posts to our callback. */
export function parseStkCallback(body: unknown): StkCallback | null {
  const cb = (body as { Body?: { stkCallback?: Record<string, unknown> } })?.Body?.stkCallback
  if (!cb || typeof cb.CheckoutRequestID !== 'string') return null
  const items = ((cb.CallbackMetadata as { Item?: { Name: string; Value?: unknown }[] })?.Item || []) as { Name: string; Value?: unknown }[]
  const item = (name: string) => items.find((i) => i.Name === name)?.Value
  return {
    checkoutRequestId: cb.CheckoutRequestID,
    resultCode: String(cb.ResultCode ?? ''),
    amount: item('Amount') !== undefined ? Number(item('Amount')) : undefined,
    receipt: item('MpesaReceiptNumber') !== undefined ? String(item('MpesaReceiptNumber')) : undefined,
    phone: item('PhoneNumber') !== undefined ? String(item('PhoneNumber')) : undefined,
  }
}
