'use client'

import { useEffect, useRef, useState } from 'react'
import { FiCheckCircle, FiSmartphone, FiXCircle } from 'react-icons/fi'

type Status = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REVIEW'

const POLL_MS = 3000
const GIVE_UP_MS = 3 * 60 * 1000

/** "07•• ••• 678" style, so the customer recognises the phone without showing it all */
const maskPhone = (phone: string) => {
  const local = phone.startsWith('254') ? `0${phone.slice(3)}` : phone
  return `${local.slice(0, 2)}•• ••• ${local.slice(-3)}`
}

/**
 * Shown after an M-Pesa PIN prompt is sent. Checks the payment every few
 * seconds and tells the customer what happened.
 */
export default function MpesaWaiting({
  reference,
  phone,
  onPaid,
  onTryAgain,
}: {
  reference: string
  phone: string
  onPaid?: () => void
  onTryAgain?: () => void
}) {
  const [status, setStatus] = useState<Status>('PENDING')
  const [message, setMessage] = useState('')
  const [receipt, setReceipt] = useState<string | null>(null)
  const [gaveUp, setGaveUp] = useState(false)
  const started = useRef(Date.now())

  useEffect(() => {
    if (status !== 'PENDING' || gaveUp) return
    let stopped = false
    const check = async () => {
      try {
        const response = await fetch(`/api/payments/status/?ref=${encodeURIComponent(reference)}`, { cache: 'no-store' })
        if (!response.ok || stopped) return
        const data = await response.json()
        setStatus(data.status)
        setMessage(data.message || '')
        setReceipt(data.receipt || null)
      } catch {
        // network blip: try again on the next round
      }
    }
    const timer = window.setInterval(() => {
      if (Date.now() - started.current > GIVE_UP_MS) {
        setGaveUp(true)
        return
      }
      check()
    }, POLL_MS)
    return () => {
      stopped = true
      window.clearInterval(timer)
    }
  }, [reference, status, gaveUp])

  useEffect(() => {
    if (status === 'COMPLETED' && onPaid) {
      const timer = window.setTimeout(onPaid, 1800)
      return () => window.clearTimeout(timer)
    }
  }, [status, onPaid])

  if (status === 'COMPLETED') {
    return (
      <div role="status" className="text-center space-y-3">
        <FiCheckCircle className="w-12 h-12 text-accent-600 mx-auto" />
        <p className="text-xl font-display font-bold text-gray-900">Payment received</p>
        {receipt && <p className="text-sm text-gray-600">M-Pesa receipt {receipt}</p>}
        <p className="text-sm text-gray-600">Thank you! One moment…</p>
      </div>
    )
  }

  if (status === 'FAILED' || status === 'CANCELLED' || status === 'REVIEW') {
    return (
      <div role="alert" className="text-center space-y-3">
        <FiXCircle className={`w-12 h-12 mx-auto ${status === 'REVIEW' ? 'text-harvest-600' : 'text-red-600'}`} />
        <p className="text-xl font-display font-bold text-gray-900">{status === 'REVIEW' ? 'Payment needs checking' : 'Payment not completed'}</p>
        <p className="text-sm text-gray-700">{message}</p>
        {status !== 'REVIEW' && onTryAgain && (
          <button type="button" onClick={onTryAgain} className="mt-2 bg-gradient-to-r from-accent-600 to-sage-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg">
            Try again
          </button>
        )}
      </div>
    )
  }

  return (
    <div role="status" aria-live="polite" className="text-center space-y-4">
      <div className="relative w-16 h-16 mx-auto">
        <span className="absolute inset-0 rounded-full bg-accent-200 animate-ping opacity-60"></span>
        <span className="relative w-16 h-16 rounded-full bg-accent-600 text-white flex items-center justify-center">
          <FiSmartphone className="w-7 h-7" />
        </span>
      </div>
      <p className="text-xl font-display font-bold text-gray-900">Check your phone</p>
      <p className="text-gray-700">
        We have sent an M-Pesa request to <span className="font-semibold whitespace-nowrap">{maskPhone(phone)}</span>.
        Enter your M-Pesa PIN to pay.
      </p>
      {gaveUp ? (
        <div className="space-y-3">
          <p className="text-sm text-clay-700">We have not received confirmation yet. If you paid, it will show here shortly; refresh this page in a minute.</p>
          {onTryAgain && (
            <button type="button" onClick={onTryAgain} className="border border-gray-300 bg-white text-gray-800 px-6 py-2.5 rounded-full font-semibold">
              Send the request again
            </button>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-500">This page updates by itself. Keep it open until you see &quot;Payment received&quot;.</p>
      )}
    </div>
  )
}
