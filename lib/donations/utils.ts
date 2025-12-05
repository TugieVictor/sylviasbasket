// Donation System Utilities

import type { DonationFormData, PaymentMethod } from './types'

/**
 * Generate a unique order ID for a donation
 * Format: DONATE-{timestamp}-{random}
 */
export function generateOrderId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `DONATE-${timestamp}-${random}`
}

/**
 * Format Kenyan phone number to international format
 * Accepts: 0712345678, 712345678, +254712345678, 254712345678
 * Returns: 254712345678
 */
export function formatKenyanPhone(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '')

  // Remove leading zeros
  cleaned = cleaned.replace(/^0+/, '')

  // Add 254 prefix if not present
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned
  }

  return cleaned
}

/**
 * Validate Kenyan phone number
 */
export function isValidKenyanPhone(phone: string): boolean {
  const formatted = formatKenyanPhone(phone)
  // Should be 254 + 9 digits (total 12 digits)
  return /^254\d{9}$/.test(formatted)
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Format amount to KES currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Validate donation form data
 */
export function validateDonationForm(data: Partial<DonationFormData>): {
  valid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  // Validate amount
  if (!data.amount || data.amount < 100) {
    errors.amount = 'Minimum donation amount is KES 100'
  }
  if (data.amount && data.amount > 1000000) {
    errors.amount = 'Maximum donation amount is KES 1,000,000'
  }

  // Validate name
  if (!data.donorName || data.donorName.trim().length < 2) {
    errors.donorName = 'Please enter your full name'
  }

  // Validate email
  if (!data.donorEmail || !isValidEmail(data.donorEmail)) {
    errors.donorEmail = 'Please enter a valid email address'
  }

  // Validate phone
  if (!data.donorPhone || !isValidKenyanPhone(data.donorPhone)) {
    errors.donorPhone = 'Please enter a valid Kenyan phone number (07XX XXX XXX or 254XXX XXX XXX)'
  }

  // Validate donation type
  if (!data.donationType || !['ONCE', 'MONTHLY'].includes(data.donationType)) {
    errors.donationType = 'Please select a donation type'
  }

  // Validate payment method
  if (!data.paymentMethod || !['MPESA', 'CARD', 'BANK'].includes(data.paymentMethod)) {
    errors.paymentMethod = 'Please select a payment method'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Sanitize donation form data
 */
export function sanitizeDonationData(data: DonationFormData): DonationFormData {
  return {
    amount: Math.round(data.amount * 100) / 100, // Round to 2 decimal places
    donationType: data.donationType,
    donorName: data.donorName.trim(),
    donorEmail: data.donorEmail.trim().toLowerCase(),
    donorPhone: formatKenyanPhone(data.donorPhone),
    message: data.message?.trim() || undefined,
    paymentMethod: data.paymentMethod,
  }
}

/**
 * Get payment method display name
 */
export function getPaymentMethodName(method: PaymentMethod): string {
  const names: Record<PaymentMethod, string> = {
    MPESA: 'M-Pesa',
    CARD: 'Card Payment',
    BANK: 'Bank Transfer',
  }
  return names[method]
}

/**
 * Calculate next billing date for recurring donations
 */
export function getNextBillingDate(startDate: Date = new Date()): Date {
  const nextDate = new Date(startDate)
  nextDate.setMonth(nextDate.getMonth() + 1)
  return nextDate
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
