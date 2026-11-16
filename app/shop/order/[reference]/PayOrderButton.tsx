'use client'

import { useState } from 'react'
import { FiLock } from 'react-icons/fi'
import PaymentNext, { type PaymentNextData } from '@/components/payments/PaymentNext'

/**
 * Pay (or pay again) for an unpaid order. With M-Pesa the customer can choose
 * which phone gets the PIN request.
 */
export default function PayOrderButton({
  reference,
  totalLabel,
  phone,
  waiting,
  initialError,
}: {
  reference: string
  totalLabel: string
  phone: string // 2547XXXXXXXX
  waiting?: { reference: string; phone: string }
  initialError?: string
}) {
  const [payPhone, setPayPhone] = useState(phone.startsWith('254') ? `0${phone.slice(3)}` : phone)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(initialError || '')
  const [next, setNext] = useState<PaymentNextData | null>(waiting ? { mpesa: waiting } : null)

  const done = () => {
    window.location.href = `/shop/order/${reference}/`
  }

  if (next) return <PaymentNext next={next} onPaid={done} onTryAgain={() => setNext(null)} />

  const pay = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/shop/orders/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, phone: payPhone }),
      })
      const data = await response.json()
      if (response.ok && data.next) setNext(data.next)
      else setError(data.error || 'Could not start the payment.')
    } catch {
      setError('Could not start the payment. Please check your connection.')
    }
    setBusy(false)
  }

  return (
    <form onSubmit={pay} className="max-w-sm mx-auto space-y-4 text-left">
      <div>
        <label htmlFor="order-pay-phone" className="block text-sm font-semibold text-gray-800 mb-1">M-Pesa number</label>
        <input
          id="order-pay-phone"
          type="tel"
          inputMode="tel"
          value={payPhone}
          onChange={(e) => setPayPhone(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-600 outline-none"
        />
      </div>
      <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent-600 to-sage-600 text-white px-10 py-4 rounded-full font-semibold shadow-lg disabled:opacity-60">
        <FiLock /> {busy ? 'Sending the request…' : `Pay ${totalLabel} with M-Pesa`}
      </button>
      {error && <p role="alert" className="text-sm text-red-700 text-center">{error}</p>}
      <p className="text-xs text-gray-500 text-center">An M-Pesa PIN request will come to this phone.</p>
    </form>
  )
}
