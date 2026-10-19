'use client'

import { useState } from 'react'
import { FiLock } from 'react-icons/fi'
import SubmitToIPay from '@/components/payments/SubmitToIPay'

export default function PayOrderButton({ reference, totalLabel }: { reference: string; totalLabel: string }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<{ action: string; fields: Record<string, string> } | null>(null)
  if (form) return <SubmitToIPay action={form.action} fields={form.fields} />

  const pay = async () => {
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/shop/orders/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      })
      const data = await response.json()
      if (response.ok) setForm(data.form)
      else setError(data.error || 'Could not start the payment.')
    } catch {
      setError('Could not start the payment. Please check your connection.')
    }
    setBusy(false)
  }

  return (
    <div>
      <button type="button" onClick={pay} disabled={busy} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent-600 to-sage-600 text-white px-10 py-4 rounded-full font-semibold shadow-lg disabled:opacity-60">
        <FiLock /> {busy ? 'Starting payment…' : `Pay ${totalLabel} now`}
      </button>
      {error && <p role="alert" className="text-sm text-red-700 mt-3">{error}</p>}
      <p className="text-xs text-gray-500 mt-3">You pay on iPay&apos;s secure page with M-Pesa.</p>
    </div>
  )
}
