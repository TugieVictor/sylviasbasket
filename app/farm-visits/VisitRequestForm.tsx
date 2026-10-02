'use client'

import { useCallback, useMemo, useState } from 'react'
import Turnstile from '@/components/Turnstile'
import { EMAIL_ERROR, PHONE_ERROR, isValidEmail, normaliseKenyanPhone } from '@/lib/validation'

type VisitTypeOption = {
  id: string
  name: string
  feeKes: number
  maxGroupSize: number
  days: string
  minNoticeDays: number
  earliestDate: string
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-600 focus:ring-2 focus:ring-accent-200 outline-none bg-white'

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p id={`${id}-error`} className="text-sm text-red-700 mt-1">{error}</p>}
    </div>
  )
}

export default function VisitRequestForm({ types }: { types: VisitTypeOption[] }) {
  const [form, setForm] = useState({
    visitTypeId: types[0]?.id || '',
    name: '',
    phone: '',
    email: '',
    organisation: '',
    groupSize: '',
    preferredDate1: '',
    preferredDate2: '',
    message: '',
  })
  const [website, setWebsite] = useState('')
  const [token, setToken] = useState('')
  const [resetKey, setResetKey] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [doneReference, setDoneReference] = useState('')
  const onToken = useCallback((t: string) => setToken(t), [])

  const selected = useMemo(() => types.find((t) => t.id === form.visitTypeId), [types, form.visitTypeId])
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  // Check phone and email in the browser too, so mistakes show before sending
  const checkContact = (key: 'phone' | 'email', value: string) => {
    const problem =
      key === 'phone' ? (normaliseKenyanPhone(value) ? '' : PHONE_ERROR) : isValidEmail(value) ? '' : EMAIL_ERROR
    setErrors((current) => {
      const next = { ...current }
      if (problem) next[key] = problem
      else delete next[key]
      return next
    })
    return !problem
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const phoneOk = checkContact('phone', form.phone)
    const emailOk = checkContact('email', form.email)
    if (!phoneOk || !emailOk) {
      setFormError('Please check the highlighted fields.')
      return
    }
    setSubmitting(true)
    setErrors({})
    setFormError('')
    try {
      const response = await fetch('/api/visits/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website, turnstileToken: token }),
      })
      const data = await response.json()
      if (response.ok) {
        setDoneReference(data.reference)
      } else {
        setErrors(data.errors || {})
        setFormError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setFormError('Could not send your request. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
      setResetKey((n) => n + 1)
    }
  }

  if (doneReference) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center" role="status">
        <h2 className="text-2xl font-display font-bold text-accent-700">Request sent</h2>
        <p className="text-gray-700 mt-3">
          Thank you. Sylvia will get back to you to confirm your visit. Your reference is{' '}
          <span className="font-semibold">{doneReference}</span>.
        </p>
        <p className="text-gray-600 text-sm mt-2">We have sent a copy to {form.email}.</p>
      </div>
    )
  }

  const showOrganisation = selected && !/individual/i.test(selected.name)

  return (
    <form onSubmit={submit} noValidate className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-5">
      <h2 className="text-2xl font-display font-bold text-gray-900">Request a visit</h2>

      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="visit-website">Website</label>
        <input id="visit-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <Field id="visitTypeId" label="Type of visit" error={errors.visitTypeId}>
        <select id="visitTypeId" value={form.visitTypeId} onChange={set('visitTypeId')} className={inputClass}>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.feeKes > 0 ? `KES ${t.feeKes.toLocaleString('en-KE')}` : 'free'}, up to {t.maxGroupSize})
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id="name" label="Your name" error={errors.name}>
          <input id="name" value={form.name} onChange={set('name')} autoComplete="name" className={inputClass} aria-invalid={!!errors.name} />
        </Field>
        <Field id="phone" label="Kenyan mobile number" error={errors.phone} hint="For example 0712 345 678 or +254 712 345 678">
          <input id="phone" type="tel" inputMode="tel" required value={form.phone} onChange={set('phone')} onBlur={(e) => e.target.value && checkContact('phone', e.target.value)} autoComplete="tel" className={inputClass} aria-invalid={!!errors.phone} />
        </Field>
        <Field id="email" label="Email" error={errors.email} hint="We send the confirmation and payment link here">
          <input id="email" type="email" inputMode="email" required value={form.email} onChange={set('email')} onBlur={(e) => e.target.value && checkContact('email', e.target.value)} autoComplete="email" className={inputClass} aria-invalid={!!errors.email} />
        </Field>
        <Field id="groupSize" label="Number of people" error={errors.groupSize} hint={selected ? `Up to ${selected.maxGroupSize}` : undefined}>
          <input id="groupSize" type="number" min={1} max={selected?.maxGroupSize} value={form.groupSize} onChange={set('groupSize')} className={inputClass} aria-invalid={!!errors.groupSize} />
        </Field>
      </div>

      {showOrganisation && (
        <Field id="organisation" label="Group or school name (optional)" error={errors.organisation}>
          <input id="organisation" value={form.organisation} onChange={set('organisation')} className={inputClass} />
        </Field>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id="preferredDate1" label="Preferred date" error={errors.preferredDate1} hint={selected ? `${selected.days}, from ${selected.earliestDate}` : undefined}>
          <input id="preferredDate1" type="date" min={selected?.earliestDate} value={form.preferredDate1} onChange={set('preferredDate1')} className={inputClass} aria-invalid={!!errors.preferredDate1} />
        </Field>
        <Field id="preferredDate2" label="Second choice (optional)" error={errors.preferredDate2}>
          <input id="preferredDate2" type="date" min={selected?.earliestDate} value={form.preferredDate2} onChange={set('preferredDate2')} className={inputClass} aria-invalid={!!errors.preferredDate2} />
        </Field>
      </div>

      <Field id="message" label="Anything we should know? (optional)" error={errors.message}>
        <textarea id="message" rows={4} value={form.message} onChange={set('message')} className={inputClass} placeholder="For example what you would like to learn, or any access needs" />
      </Field>

      <Turnstile onToken={onToken} resetKey={resetKey} />

      {formError && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-accent-600 to-sage-600 hover:from-accent-700 hover:to-sage-700 text-white py-4 rounded-full font-semibold shadow-lg disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Send visit request'}
      </button>
      <p className="text-xs text-gray-500 text-center">No payment now. You pay only after Sylvia confirms your visit.</p>
    </form>
  )
}
