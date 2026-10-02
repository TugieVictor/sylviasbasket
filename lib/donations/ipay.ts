/**
 * iPay Africa Payment Gateway Integration
 *
 * CURRENT STATUS: PLACEHOLDER - Waiting for iPay credentials from client
 *
 * iPay Documentation: https://ipayafrica.com/developers
 *
 * REQUIRED CREDENTIALS (Add to .env.local when available):
 * - IPAY_VENDOR_ID: Your iPay vendor ID
 * - IPAY_HASH_KEY: Your iPay hash key for security
 * - IPAY_CALLBACK_URL: https://sylviasbasket.co.ke/api/donations/callback
 * - IPAY_MODE: 'test' or 'live'
 *
 * PAYMENT METHODS SUPPORTED BY IPAY:
 * - M-Pesa (STK Push - automatic)
 * - Card Payments (Visa/Mastercard)
 * - Bank Payments
 * - Recurring Subscriptions (for monthly donations)
 *
 * INTEGRATION STEPS (When credentials arrive):
 *
 * 1. Add environment variables to .env.local
 * 2. Implement hash generation in generateIPayHash()
 * 3. Build payment request in initiateIPayPayment()
 * 4. Implement webhook verification in verifyIPayCallback()
 * 5. Process payment responses in handleIPayResponse()
 * 6. Test with iPay sandbox first (IPAY_MODE=test)
 * 7. Switch to production (IPAY_MODE=live) after testing
 */

import crypto from 'crypto'
import type { IPayPaymentRequest, IPayCallbackData } from './types'

// Set to true only once the iPay checkout request is fully implemented and tested
const IPAY_CHECKOUT_ENABLED = false

// iPay Configuration
const IPAY_CONFIG = {
  vendorId: process.env.IPAY_VENDOR_ID || '',
  hashKey: process.env.IPAY_HASH_KEY || '',
  callbackUrl: process.env.IPAY_CALLBACK_URL || '',
  mode: process.env.IPAY_MODE || 'test',
  // Test URL: https://payments.ipayafrica.com/v3/ke
  // Live URL: https://apis.ipayafrica.com/payments/v2/transact
  apiUrl: process.env.IPAY_MODE === 'live'
    ? 'https://apis.ipayafrica.com/payments/v2/transact'
    : 'https://payments.ipayafrica.com/v3/ke',
}

/**
 * Generate iPay security hash
 *
 * iPay uses HMAC-SHA256 for request authentication
 * Hash format: HMAC(vendorId + orderId + amount + currency, hashKey)
 *
 * TODO: Implement when credentials are available
 */
function generateIPayHash(params: {
  orderId: string
  amount: number
  currency: string
}): string {
  // PLACEHOLDER - Implement when credentials arrive
  if (!IPAY_CONFIG.hashKey) {
    console.warn('iPay hash key not configured')
    return 'PLACEHOLDER_HASH'
  }

  // TODO: Uncomment and implement when credentials are ready
  /*
  const data = `${IPAY_CONFIG.vendorId}${params.orderId}${params.amount}${params.currency}`
  return crypto
    .createHmac('sha256', IPAY_CONFIG.hashKey)
    .update(data)
    .digest('hex')
  */

  return 'PLACEHOLDER_HASH'
}

/**
 * Initiate iPay Payment
 *
 * This function creates a payment request and redirects to iPay checkout
 *
 * iPay Request Parameters:
 * - vid: Vendor ID
 * - oid: Order ID (unique)
 * - inv: Invoice number (can be same as order ID)
 * - amount: Payment amount
 * - currency: KES
 * - email: Customer email
 * - phone: Customer phone (254XXXXXXXXX format)
 * - callback: Webhook URL for payment notification
 * - success: Redirect URL on success
 * - failed: Redirect URL on failure
 * - hash: Security hash
 *
 * TODO: Complete implementation when credentials arrive
 */
export async function initiateIPayPayment(request: IPayPaymentRequest): Promise<{
  success: boolean
  redirectUrl?: string
  error?: string
}> {
  // Online payment stays disabled until the real iPay checkout (hash and
  // field names) is implemented and tested in Stage 5 of version_2_plan.md.
  if (!IPAY_CHECKOUT_ENABLED || !isIPayConfigured()) {
    console.warn('iPay not configured - credentials pending from client')

    // Return failure so the process route will send emails instead
    return {
      success: false,
      error: 'iPay not configured - using fallback email flow',
    }
  }

  try {
    // Generate security hash
    const hash = generateIPayHash({
      orderId: request.orderId,
      amount: request.amount,
      currency: request.currency,
    })

    // Build iPay payment URL with parameters
    const paymentParams = new URLSearchParams({
      vid: IPAY_CONFIG.vendorId,
      oid: request.orderId,
      inv: request.orderId,
      amount: request.amount.toString(),
      currency: request.currency,
      email: request.email,
      phone: request.phone,
      callback: request.callbackUrl,
      success: `${process.env.NEXT_PUBLIC_SITE_URL}/donate/success?orderId=${request.orderId}`,
      failed: `${process.env.NEXT_PUBLIC_SITE_URL}/donate/failure?orderId=${request.orderId}`,
      hash: hash,
      // Payment method specific parameters
      ...(request.paymentMethod === 'MPESA' && {
        mpesa: '1', // Enable M-Pesa
        autopay: '1', // Auto-initiate STK push
      }),
      ...(request.paymentMethod === 'CARD' && {
        card: '1', // Enable card payment
      }),
    })

    const redirectUrl = `${IPAY_CONFIG.apiUrl}?${paymentParams.toString()}`

    // TODO: When iPay is configured, also handle API mode vs redirect mode
    // iPay supports both direct API calls and redirect checkout
    // For M-Pesa STK Push, we might want to use API mode for better UX

    return {
      success: true,
      redirectUrl,
    }

  } catch (error) {
    console.error('iPay payment initiation error:', error)
    return {
      success: false,
      error: 'Failed to initiate payment',
    }
  }
}

/**
 * Verify iPay Callback
 *
 * iPay sends webhooks when payment status changes
 * We must verify the callback is genuinely from iPay using the hash
 *
 * Callback parameters from iPay:
 * - orderId: Order reference
 * - status: Payment status (success/failed/pending)
 * - transactionId: iPay transaction ID
 * - amount: Payment amount
 * - currency: Currency code
 * - hash: Security hash to verify
 *
 * TODO: Implement hash verification when credentials arrive
 */
export function verifyIPayCallback(callbackData: IPayCallbackData): {
  valid: boolean
  error?: string
} {
  // PLACEHOLDER - Implement when credentials arrive
  // Never accept a callback without verification
  if (!isIPayConfigured()) {
    return { valid: false, error: 'iPay not configured' }
  }

  try {
    // TODO: Implement hash verification
    /*
    const expectedHash = generateIPayHash({
      orderId: callbackData.orderId,
      amount: callbackData.amount,
      currency: callbackData.currency,
    })

    if (callbackData.hash !== expectedHash) {
      return {
        valid: false,
        error: 'Invalid callback hash - possible security breach',
      }
    }
    */

    // Hash checking is not implemented; use verifyIPayTransaction instead
    return { valid: false, error: 'Use verifyIPayTransaction (IPN query)' }

  } catch (error) {
    console.error('Callback verification error:', error)
    return {
      valid: false,
      error: 'Callback verification failed',
    }
  }
}

/**
 * Handle iPay Response
 *
 * Process the payment callback and extract relevant information
 * Map iPay status codes to our donation status
 *
 * iPay Status Codes:
 * - success/completed: COMPLETED
 * - failed: FAILED
 * - pending: PENDING
 * - cancelled: CANCELLED
 *
 * TODO: Test with actual iPay responses when credentials arrive
 */
export async function handleIPayResponse(callbackData: IPayCallbackData): Promise<{
  success: boolean
  orderId: string
  status: string
  transactionId?: string
  error?: string
}> {
  try {
    // Extract and normalize status
    const ipayStatus = callbackData.status?.toLowerCase()
    let donationStatus: string

    switch (ipayStatus) {
      case 'success':
      case 'completed':
      case 'successful':
        donationStatus = 'COMPLETED'
        break
      case 'failed':
      case 'failure':
        donationStatus = 'FAILED'
        break
      case 'cancelled':
      case 'canceled':
        donationStatus = 'CANCELLED'
        break
      case 'pending':
      default:
        donationStatus = 'PENDING'
    }

    return {
      success: true,
      orderId: callbackData.orderId,
      status: donationStatus,
      transactionId: callbackData.transactionId,
    }

  } catch (error) {
    console.error('iPay response handling error:', error)
    return {
      success: false,
      orderId: callbackData.orderId,
      status: 'FAILED',
      error: 'Failed to process payment response',
    }
  }
}

/**
 * Initialize Recurring Payment (for monthly donations)
 *
 * iPay supports recurring billing for subscriptions
 * This creates a subscription that auto-charges monthly
 *
 * TODO: Implement when iPay credentials arrive and client wants recurring
 */
export async function initiateRecurringPayment(params: {
  orderId: string
  amount: number
  customerEmail: string
  customerPhone: string
}): Promise<{
  success: boolean
  subscriptionId?: string
  error?: string
}> {
  // PLACEHOLDER - iPay recurring billing implementation
  console.warn('iPay recurring payment not yet implemented - credentials pending')

  // TODO: Implement iPay recurring billing API
  // Documentation: https://ipayafrica.com/developers/recurring-billing

  return {
    success: false,
    error: 'Recurring payments not yet configured - iPay credentials pending',
  }
}

/**
 * Cancel Recurring Payment
 *
 * Allows users to cancel their monthly donations
 *
 * TODO: Implement when iPay credentials arrive
 */
export async function cancelRecurringPayment(subscriptionId: string): Promise<{
  success: boolean
  error?: string
}> {
  // PLACEHOLDER
  console.warn('iPay subscription cancellation not yet implemented')

  return {
    success: false,
    error: 'Subscription cancellation not yet configured',
  }
}

// Real credentials are long strings; short placeholder values do not count
export function isIPayConfigured(): boolean {
  return IPAY_CONFIG.vendorId.length >= 3 && IPAY_CONFIG.hashKey.length >= 8
}

export function getIPayConfig() {
  return {
    configured: isIPayConfigured(),
    mode: IPAY_CONFIG.mode,
    vendorId: IPAY_CONFIG.vendorId ? 'SET' : 'MISSING',
    hashKey: IPAY_CONFIG.hashKey ? 'SET' : 'MISSING',
  }
}


/**
 * Confirm a transaction directly with iPay (IPN query).
 *
 * iPay appends id, ivm, qwh, afd, poi, uyt and ifd to the callback URL.
 * Sending these back to iPay's IPN endpoint returns the true status code
 * for the transaction, so the callback parameters cannot be faked.
 * Docs: https://dev.ipayafrica.com/C2B.html
 */
const IPAY_STATUS = {
  SUCCESS: 'aei7p7yrx4ae34',
  PENDING: 'bdi6p2yy76etrs',
  FAILED: 'fe2707etr5s4wq',
  USED: 'cr5i3pgy9867e1',
  AMOUNT_TOO_LOW: 'dtfi4p7yty45wq',
  AMOUNT_TOO_HIGH: 'eq3i7p5yt7645e',
} as const

export async function verifyIPayTransaction(params: URLSearchParams): Promise<{
  status: 'COMPLETED' | 'PENDING' | 'FAILED'
  code: string
}> {
  if (!isIPayConfigured()) {
    return { status: 'FAILED', code: 'not-configured' }
  }

  const query = new URLSearchParams({ vendor: IPAY_CONFIG.vendorId })
  for (const key of ['id', 'ivm', 'qwh', 'afd', 'poi', 'uyt', 'ifd']) {
    const value = params.get(key)
    if (!value) {
      return { status: 'FAILED', code: `missing-${key}` }
    }
    query.set(key, value)
  }

  try {
    const response = await fetch(`https://www.ipayafrica.com/ipn/?${query.toString()}`, {
      cache: 'no-store',
    })
    const code = (await response.text()).trim()

    if (code === IPAY_STATUS.SUCCESS) return { status: 'COMPLETED', code }
    if (code === IPAY_STATUS.PENDING) return { status: 'PENDING', code }
    return { status: 'FAILED', code }
  } catch (error) {
    console.error('iPay IPN query failed:', error)
    // Unknown result: treat as pending so it can be checked again
    return { status: 'PENDING', code: 'ipn-unreachable' }
  }
}
