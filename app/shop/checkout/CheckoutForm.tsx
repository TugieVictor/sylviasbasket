'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FiLock, FiMapPin, FiTruck } from 'react-icons/fi'
import ProductPhoto from '@/components/shop/ProductPhoto'
import SubmitToIPay from '@/components/payments/SubmitToIPay'
import Turnstile from '@/components/Turnstile'
import { clearCart, useCart } from '@/lib/cart'
import { EMAIL_ERROR, PHONE_ERROR, isValidEmail, normaliseKenyanPhone } from '@/lib/validation'

type Zone = { id: string; name: string; feeKes: number; isPickup: boolean }
type Line = {
  variantId: string
  productName: string
  variantLabel: string
  category: 'PRODUCE' | 'MERCHANDISE'
  image: { url: string; alt?: string } | null
  unitPriceKes: number
  quantity: number
  problem: string | null
}

const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`
const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-600 focus:ring-2 focus:ring-accent-200 outline-none bg-white'

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

export default function CheckoutForm({ zones }: { zones: Zone[] }) {
  const cart = useCart()
  const [lines, setLines] = useState<Line[] | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', zoneId: '', address: '', notes: '' })
  const [website, setWebsite] = useState('')
  const [token, setToken] = useState('')
  const [resetKey, setResetKey] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [redirect, setRedirect] = useState<{ action: string; fields: Record<string, string> } | null>(null)
  const onToken = useCallback((t: string) => setToken(t), [])
  const cartKey = JSON.stringify(cart)

  useEffect(() => {
    if (cart.length === 0) {
      setLines([])
      return
    }
    let cancelled = false
    fetch('/api/shop/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart }) })
      .then((r) => r.json())
      .then((data) => !cancelled && setLines(data.items || []))
      .catch(() => !cancelled && setFormError('Could not load your cart. Please check your connection.'))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey])

  if (redirect) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 text-center">
        <SubmitToIPay action={redirect.action} fields={redirect.fields} />
      </div>
    )
  }
  if (lines === null) return <p className="text-center text-gray-600">Loading your order…</p>
  if (lines.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center bg-white rounded-3xl shadow-xl p-10">
        <h2 className="text-2xl font-display font-bold text-gray-900">Your cart is empty</h2>
        <Link href="/shop/" className="inline-block mt-6 bg-gradient-to-r from-accent-600 to-sage-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg">
          Go to the shop
        </Link>
      </div>
    )
  }

  const zone = zones.find((z) => z.id === form.zoneId)
  const subtotal = lines.reduce((sum, l) => sum + l.unitPriceKes * l.quantity, 0)
  const total = subtotal + (zone?.feeKes || 0)
  const problems = lines.filter((l) => l.problem)
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const check = (key: 'phone' | 'email', value: string) => {
    const problem = key === 'phone' ? (normaliseKenyanPhone(value) ? '' : PHONE_ERROR) : isValidEmail(value) ? '' : EMAIL_ERROR
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
    const found: Record<string, string> = {}
    if (!form.name.trim()) found.name = 'Please enter your name.'
    if (!normaliseKenyanPhone(form.phone)) found.phone = PHONE_ERROR
    if (!isValidEmail(form.email)) found.email = EMAIL_ERROR
    if (!zone) found.zoneId = 'Please choose delivery or collection.'
    else if (!zone.isPickup && form.address.trim().length < 5) found.address = 'Please enter your delivery address.'
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setFormError('Please check the highlighted fields.')
      return
    }
    setSubmitting(true)
    setFormError('')
    try {
      const response = await fetch('/api/shop/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: cart, website, turnstileToken: token }),
      })
      const data = await response.json()
      if (response.ok) {
        clearCart()
        if (data.form) setRedirect(data.form)
        else window.location.href = `/shop/order/${data.reference}/`
        return
      }
      setErrors(data.errors || {})
      setFormError(data.error || 'Something went wrong. Please try again.')
    } catch {
      setFormError('Could not place your order. Please check your connection and try again.')
    }
    setSubmitting(false)
    setResetKey((n) => n + 1)
  }

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-8 items-start">
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="checkout-website">Website</label>
        <input id="checkout-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div className="space-y-6">
        <fieldset className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-5">
          <legend className="sr-only">Your details</legend>
          <h2 className="text-xl font-display font-bold text-gray-900"><span className="text-accent-600">1.</span> Your details</h2>
          <Field id="name" label="Full name" error={errors.name}>
            <input id="name" value={form.name} onChange={set('name')} autoComplete="name" className={inputClass} aria-invalid={!!errors.name} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field id="phone" label="Kenyan mobile number" error={errors.phone} hint="We call or text this number about delivery">
              <input id="phone" type="tel" inputMode="tel" value={form.phone} onChange={set('phone')} onBlur={(e) => e.target.value && check('phone', e.target.value)} autoComplete="tel" placeholder="0712 345 678" className={inputClass} aria-invalid={!!errors.phone} />
            </Field>
            <Field id="email" label="Email" error={errors.email} hint="We send your receipt here">
              <input id="email" type="email" inputMode="email" value={form.email} onChange={set('email')} onBlur={(e) => e.target.value && check('email', e.target.value)} autoComplete="email" placeholder="name@example.com" className={inputClass} aria-invalid={!!errors.email} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-5">
          <legend className="sr-only">Delivery</legend>
          <h2 className="text-xl font-display font-bold text-gray-900"><span className="text-accent-600">2.</span> Delivery or collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Delivery options">
            {zones.map((z) => {
              const selected = z.id === form.zoneId
              const Icon = z.isPickup ? FiMapPin : FiTruck
              return (
                <label
                  key={z.id}
                  className={`flex items-start gap-3 rounded-2xl border-2 p-4 cursor-pointer transition-colors ${
                    selected ? 'border-accent-600 bg-accent-50' : 'border-gray-200 hover:border-accent-300'
                  }`}
                >
                  <input type="radio" name="zone" value={z.id} checked={selected} onChange={() => setForm((f) => ({ ...f, zoneId: z.id }))} className="sr-only" />
                  <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${selected ? 'text-accent-700' : 'text-gray-400'}`} />
                  <span className="flex-1">
                    <span className="block font-semibold text-gray-900">{z.name}</span>
                    <span className="block text-sm text-gray-600">{z.feeKes > 0 ? kes(z.feeKes) : 'Free'}</span>
                  </span>
                </label>
              )
            })}
          </div>
          {errors.zoneId && <p className="text-sm text-red-700">{errors.zoneId}</p>}

          {zone && !zone.isPickup && (
            <Field id="address" label="Delivery address" error={errors.address} hint="Town or estate, street, building or house, and any directions">
              <textarea id="address" rows={3} value={form.address} onChange={set('address')} autoComplete="street-address" className={inputClass} aria-invalid={!!errors.address} />
            </Field>
          )}
          {zone?.isPickup && (
            <p className="text-sm text-gray-700 bg-earth-50 border border-earth-200 rounded-xl px-4 py-3">
              Collect your order from the farm in Limuru, Kiambu County. We will call you when it is ready.
            </p>
          )}
          <Field id="notes" label="Notes for us (optional)">
            <textarea id="notes" rows={2} value={form.notes} onChange={set('notes')} className={inputClass} placeholder="For example a good time to deliver" />
          </Field>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-28 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl font-display font-bold text-gray-900"><span className="text-accent-600">3.</span> Your order</h2>
        <ul className="mt-4 divide-y divide-gray-100">
          {lines.map((l) => (
            <li key={l.variantId} className="py-3 flex gap-3">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                <ProductPhoto image={l.image} category={l.category} />
                <span className="absolute -top-0 -right-0 bg-gray-800 text-white text-xs font-bold rounded-bl-lg px-1.5">{l.quantity}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{l.productName}</p>
                {l.variantLabel.toLowerCase() !== 'standard' && <p className="text-xs text-gray-500">{l.variantLabel}</p>}
                {l.problem && <p className="text-xs text-clay-700">{l.problem}</p>}
              </div>
              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{kes(l.unitPriceKes * l.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="border-t border-gray-200 pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-gray-600">Subtotal</dt><dd className="font-semibold">{kes(subtotal)}</dd></div>
          <div className="flex justify-between">
            <dt className="text-gray-600">{zone?.isPickup ? 'Collection' : 'Delivery'}</dt>
            <dd className="font-semibold">{zone ? (zone.feeKes ? kes(zone.feeKes) : 'Free') : 'Choose an option'}</dd>
          </div>
          <div className="flex justify-between text-lg pt-2 border-t border-gray-100">
            <dt className="font-bold text-gray-900">Total</dt><dd className="font-bold text-gray-900">{kes(total)}</dd>
          </div>
        </dl>

        <div className="mt-5"><Turnstile onToken={onToken} resetKey={resetKey} /></div>

        {problems.length > 0 ? (
          <p className="mt-5 text-sm text-clay-700 font-semibold">
            Some items have changed. Please <Link href="/shop/cart/" className="underline">update your cart</Link> first.
          </p>
        ) : (
          <>
            {formError && <p role="alert" className="mt-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="mt-5 w-full bg-gradient-to-r from-accent-600 to-sage-600 hover:from-accent-700 hover:to-sage-700 text-white py-4 rounded-full font-semibold shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <FiLock /> {submitting ? 'Placing your order…' : `Pay ${kes(total)}`}
            </button>
          </>
        )}
        <p className="text-xs text-gray-500 text-center mt-3">
          You pay on iPay&apos;s secure page with M-Pesa. Your items are held for you for 60 minutes.
        </p>
        <p className="text-xs text-gray-500 text-center mt-2">
          By paying you agree to our <Link href="/policies/terms-of-sale/" target="_blank" className="underline">terms of sale</Link>,{' '}
          <Link href="/policies/delivery/" target="_blank" className="underline">delivery</Link> and{' '}
          <Link href="/policies/returns/" target="_blank" className="underline">returns</Link> policies.
        </p>
      </aside>
    </form>
  )
}
