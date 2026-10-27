'use client'

import { useState } from 'react'
import SubmitToIPay from '@/components/payments/SubmitToIPay'

export default function TestPayment() {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState<{ action: string; fields: Record<string, string> } | null>(null)
  const [busy, setBusy] = useState(false)

  const start = async () => {
    setBusy(true)
    setError('')
    const response = await fetch('/api/admin/test-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    const data = await response.json()
    setBusy(false)
    if (response.ok) setForm(data.form)
    else setError(data.error || 'Could not start the test payment')
  }

  if (form) return <div className="mt-4"><SubmitToIPay action={form.action} fields={form.fields} /></div>

  return (
    <div className="mt-5 border-t border-gray-100 pt-5">
      <h3 className="font-semibold text-gray-900">Test the iPay connection</h3>
      <p className="text-sm text-gray-600 mt-1">Starts a KES 10 payment and takes you to iPay. In demo mode no real money moves.</p>
      <div className="mt-3 flex flex-col sm:flex-row gap-3">
        <input
          type="tel"
          placeholder="Phone, e.g. 0712345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-accent-600 outline-none"
        />
        <button type="button" onClick={start} disabled={busy} className="bg-accent-600 text-white px-5 py-2.5 rounded-xl font-semibold disabled:opacity-60">
          {busy ? 'Starting…' : 'Start test payment'}
        </button>
      </div>
      {error && <p role="alert" className="text-sm text-red-700 mt-2">{error}</p>}
    </div>
  )
}
