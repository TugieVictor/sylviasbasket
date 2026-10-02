'use client'

import { useState } from 'react'
import SubmitToIPay from '@/components/payments/SubmitToIPay'

export default function PayVisitForm({ reference, phone, email }: { reference: string; phone: string; email: string }) {
  const [payPhone, setPayPhone] = useState(phone.startsWith('254') ? `0${phone.slice(3)}` : phone)
  const [payEmail, setPayEmail] = useState(email)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState<{ action: string; fields: Record<string, string> } | null>(null)

  if (form) return <SubmitToIPay action={form.action} fields={form.fields} />

  const pay = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const response = await fetch('/api/visits/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, phone: payPhone, email: payEmail }),
    })
    const data = await response.json()
    setBusy(false)
    if (response.ok) setForm(data.form)
    else setError(data.error || 'Could not start the payment.')
  }

  return (
    <form onSubmit={pay} className="space-y-4 text-left">
      <div>
        <label htmlFor="pay-phone" className="block text-sm font-semibold text-gray-800 mb-1">M-Pesa or phone number</label>
        <input id="pay-phone" type="tel" value={payPhone} onChange={(e) => setPayPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-600 outline-none" />
      </div>
      <div>
        <label htmlFor="pay-email" className="block text-sm font-semibold text-gray-800 mb-1">Email for your receipt</label>
        <input id="pay-email" type="email" value={payEmail} onChange={(e) => setPayEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-600 outline-none" />
      </div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className="w-full bg-gradient-to-r from-accent-600 to-sage-600 text-white py-4 rounded-full font-semibold shadow-lg disabled:opacity-60">
        {busy ? 'Starting payment…' : 'Pay with iPay'}
      </button>
      <p className="text-xs text-gray-500 text-center">You will choose M-Pesa, Airtel Money or card on iPay's secure page.</p>
    </form>
  )
}
