'use client'

import { useCallback, useState } from 'react'
import Turnstile from '@/components/Turnstile'
import { EMAIL_ERROR, PHONE_ERROR, isValidEmail, normaliseKenyanPhone } from '@/lib/validation'

type CourseOption = { id: string; title: string; sessions: { id: string; label: string }[] }

const inputClass = 'w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-600 focus:ring-2 focus:ring-accent-200 outline-none bg-white'

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-sm text-red-700 mt-1">{error}</p>}
    </div>
  )
}

export default function CourseRequestForm({ courses, initialCourseId, minDate }: { courses: CourseOption[]; initialCourseId: string; minDate: string }) {
  const [form, setForm] = useState({
    courseId: initialCourseId || courses[0]?.id || '',
    sessionId: '',
    preferredDate: '',
    groupSize: '1',
    name: '',
    phone: '',
    email: '',
    organisation: '',
    message: '',
  })
  const [website, setWebsite] = useState('')
  const [token, setToken] = useState('')
  const [resetKey, setResetKey] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState('')
  const onToken = useCallback((t: string) => setToken(t), [])

  const course = courses.find((c) => c.id === form.courseId)
  const sessions = course?.sessions || []
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value, ...(key === 'courseId' ? { sessionId: '' } : {}) }))

  const check = (key: 'phone' | 'email', value: string) => {
    const problem = key === 'phone' ? (normaliseKenyanPhone(value) ? '' : PHONE_ERROR) : isValidEmail(value) ? '' : EMAIL_ERROR
    setErrors((current) => {
      const next = { ...current }
      if (problem) next[key] = problem
      else delete next[key]
      return next
    })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found: Record<string, string> = {}
    if (!form.name.trim()) found.name = 'Please enter your name.'
    if (!normaliseKenyanPhone(form.phone)) found.phone = PHONE_ERROR
    if (!isValidEmail(form.email)) found.email = EMAIL_ERROR
    setErrors(found)
    if (Object.keys(found).length) {
      setFormError('Please check the highlighted fields.')
      return
    }
    setSubmitting(true)
    setFormError('')
    try {
      const response = await fetch('/api/courses/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website, turnstileToken: token }),
      })
      const data = await response.json()
      if (response.ok) setDone(data.reference)
      else {
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

  if (done) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center" role="status">
        <h3 className="text-2xl font-display font-bold text-accent-700">Request sent</h3>
        <p className="text-gray-700 mt-3">Thank you. Sylvia will get back to you soon. Your reference is <span className="font-semibold">{done}</span>.</p>
        <p className="text-gray-600 text-sm mt-2">We have sent a copy to {form.email}.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-5">
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="course-website">Website</label>
        <input id="course-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <Field id="courseId" label="Course" error={errors.courseId}>
        <select id="courseId" value={form.courseId} onChange={set('courseId')} className={inputClass}>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          <option value="">Not sure yet: tell me about upcoming courses</option>
        </select>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {sessions.length > 0 && (
          <Field id="sessionId" label="Date">
            <select id="sessionId" value={form.sessionId} onChange={set('sessionId')} className={inputClass}>
              <option value="">Another date</option>
              {sessions.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </Field>
        )}
        {!form.sessionId && (
          <Field id="preferredDate" label="Preferred date (optional)" error={errors.preferredDate}>
            <input id="preferredDate" type="date" min={minDate} value={form.preferredDate} onChange={set('preferredDate')} className={inputClass} />
          </Field>
        )}
        <Field id="groupSize" label="Number of people" error={errors.groupSize}>
          <input id="groupSize" type="number" min={1} max={200} value={form.groupSize} onChange={set('groupSize')} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id="name" label="Your name" error={errors.name}>
          <input id="name" value={form.name} onChange={set('name')} autoComplete="name" className={inputClass} aria-invalid={!!errors.name} />
        </Field>
        <Field id="organisation" label="Group or organisation (optional)">
          <input id="organisation" value={form.organisation} onChange={set('organisation')} className={inputClass} />
        </Field>
        <Field id="phone" label="Kenyan mobile number" error={errors.phone} hint="For example 0712 345 678">
          <input id="phone" type="tel" inputMode="tel" value={form.phone} onChange={set('phone')} onBlur={(e) => e.target.value && check('phone', e.target.value)} autoComplete="tel" className={inputClass} aria-invalid={!!errors.phone} />
        </Field>
        <Field id="email" label="Email" error={errors.email} hint="We send a copy of your request here">
          <input id="email" type="email" inputMode="email" value={form.email} onChange={set('email')} onBlur={(e) => e.target.value && check('email', e.target.value)} autoComplete="email" className={inputClass} aria-invalid={!!errors.email} />
        </Field>
      </div>

      <Field id="message" label="Anything we should know? (optional)">
        <textarea id="message" rows={4} value={form.message} onChange={set('message')} className={inputClass} placeholder="For example your farming experience, or what you hope to learn" />
      </Field>

      <Turnstile onToken={onToken} resetKey={resetKey} />
      {formError && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>}
      <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-accent-600 to-sage-600 hover:from-accent-700 hover:to-sage-700 text-white py-4 rounded-full font-semibold shadow-lg disabled:opacity-60">
        {submitting ? 'Sending…' : 'Send course request'}
      </button>
      <p className="text-xs text-gray-500 text-center">No payment now. Sylvia will contact you to confirm.</p>
    </form>
  )
}
