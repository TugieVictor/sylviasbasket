'use client'

import { useState } from 'react'
import PaymentNext, { type PaymentNextData } from '@/components/payments/PaymentNext'

/** Sends a tiny test payment so Sylvia can check payments work end to end. */
export default function TestPayment({ provider }: { provider: 'MPESA' | 'IPAY' }) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [next, setNext] = useState<PaymentNextData | null>(null)
  const [paid, setPaid] = useState(false)
  const [busy, setBusy] = useState(false)

  const start = async () => {
    setBusy(true)
    setError('')
    setPaid(false)
    try {
      const response = await fetch('/api/admin/test-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await response.json()
      if (response.ok && data.next) setNext(data.next)
      else setError(data.error || 'Could not start the test payment')
    } catch {
      setError('Could not start the test payment. Please check your connection.')
    }
    setBusy(false)
  }

  if (next && !paid) {
    return (
      <div className="mt-5 border-t border-gray-100 pt-5">
        <PaymentNext next={next} onPaid={() => setPaid(true)} onTryAgain={() => setNext(null)} />
      </div>
    )
  }

  return (
    <div className="mt-5 border-t border-gray-100 pt-5">
      <h3 className="font-semibold text-gray-900">Send a test payment</h3>
      <p className="text-sm text-gray-600 mt-1">
        {provider === 'MPESA'
          ? 'Sends a KES 1 M-Pesa request to the phone below, to check that payments reach the website.'
          : 'Starts a KES 10 payment and takes you to iPay.'}
      </p>
      {paid && <p role="status" className="text-sm text-accent-800 bg-accent-50 border border-accent-200 rounded-lg px-3 py-2 mt-3">The test payment was received. Payments are working.</p>}
      <div className="mt-3 flex flex-col sm:flex-row gap-3">
        <input
          type="tel"
          inputMode="tel"
          placeholder="M-Pesa number, e.g. 0712345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-accent-600 outline-none"
        />
        <button type="button" onClick={start} disabled={busy} className="bg-accent-600 text-white px-5 py-2.5 rounded-xl font-semibold disabled:opacity-60">
          {busy ? 'Sending…' : 'Send test payment'}
        </button>
      </div>
      {error && <p role="alert" className="text-sm text-red-700 mt-2">{error}</p>}
    </div>
  )
}
