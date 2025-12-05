// Donation System Types for Sylvia's Basket

export type PaymentMethod = 'MPESA' | 'CARD' | 'BANK'
export type DonationType = 'ONCE' | 'MONTHLY'
export type DonationStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
export type Currency = 'KES'

export interface DonationFormData {
  amount: number
  donationType: DonationType
  donorName: string
  donorEmail: string
  donorPhone: string
  message?: string
  paymentMethod: PaymentMethod
}

export interface Donation {
  id: string
  orderId: string
  donorName: string
  donorEmail: string
  donorPhone: string
  amount: number
  currency: Currency
  paymentMethod: PaymentMethod
  donationType: DonationType
  status: DonationStatus
  transactionId?: string
  message?: string
  createdAt: Date
  updatedAt: Date
}

export interface RecurringDonation {
  id: string
  donationId: string
  subscriptionId?: string
  frequency: 'MONTHLY'
  nextBillingDate: Date
  status: 'ACTIVE' | 'CANCELLED' | 'PAUSED'
  createdAt: Date
  updatedAt: Date
}

export interface BankDetails {
  bankName: string
  accountName: string
  accountNumber: string
  branch?: string
  swiftCode?: string
}

export interface DonationResponse {
  success: boolean
  orderId?: string
  message?: string
  error?: string
  redirectUrl?: string
}

export interface IPayPaymentRequest {
  orderId: string
  amount: number
  currency: Currency
  email: string
  phone: string
  customerName: string
  callbackUrl: string
  paymentMethod: PaymentMethod
}

export interface IPayCallbackData {
  orderId: string
  status: string
  transactionId: string
  amount: number
  currency: string
  hash: string
  [key: string]: any
}

// Predefined donation amounts in KES
export const DONATION_AMOUNTS = [
  { value: 500, label: 'KES 500', description: 'Seeds for one farmer' },
  { value: 1000, label: 'KES 1,000', description: 'Training materials' },
  { value: 2000, label: 'KES 2,000', description: 'Supports 2 farmers' },
  { value: 5000, label: 'KES 5,000', description: 'Women\'s farming group' },
] as const

// Payment method configurations
export const PAYMENT_METHODS = [
  {
    id: 'MPESA' as PaymentMethod,
    name: 'M-Pesa',
    description: 'Mobile Money',
    icon: '📱',
    emoji: '🇰🇪',
    available: true,
  },
  {
    id: 'CARD' as PaymentMethod,
    name: 'Card',
    description: 'Visa/Mastercard',
    icon: '💳',
    emoji: '',
    available: true,
  },
  {
    id: 'BANK' as PaymentMethod,
    name: 'Bank Transfer',
    description: 'Direct Deposit',
    icon: '🏦',
    emoji: '',
    available: true,
  },
] as const
