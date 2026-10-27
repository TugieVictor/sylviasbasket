'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import ProductPhoto from '@/components/shop/ProductPhoto'
import { removeFromCart, setQuantity, useCart } from '@/lib/cart'

type Line = {
  variantId: string
  productName: string
  productSlug: string
  category: 'PRODUCE' | 'MERCHANDISE'
  variantLabel: string
  image: { url: string; alt?: string } | null
  unitPriceKes: number
  quantity: number
  available: number
  problem: string | null
}

const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`

/** Ready-written WhatsApp message listing the cart, used while online payment is not set up. */
function whatsappLink(number: string, lines: Line[], subtotal: number) {
  const items = lines.map((l) => `- ${l.quantity} x ${l.productName}${l.variantLabel.toLowerCase() === 'standard' ? '' : ` (${l.variantLabel})`}: ${kes(l.unitPriceKes * l.quantity)}`)
  const text = [
    "Hello Sylvia's Basket, I would like to order:",
    ...items,
    `Subtotal: ${kes(subtotal)} (plus delivery)`,
    '',
    'My name: ',
    'Delivery area, or collect from the farm: ',
  ].join('\n')
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export default function CartView({ whatsapp }: { whatsapp?: string }) {
  const cart = useCart()
  const [lines, setLines] = useState<Line[] | null>(null)
  const [error, setError] = useState('')
  const key = JSON.stringify(cart)

  useEffect(() => {
    if (cart.length === 0) {
      setLines([])
      return
    }
    let cancelled = false
    fetch('/api/shop/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.items) {
          setLines(data.items)
          setError('')
          // Drop items that no longer exist in the shop
          const known = new Set((data.items as Line[]).map((l) => l.variantId))
          cart.filter((i) => !known.has(i.variantId)).forEach((i) => removeFromCart(i.variantId))
        } else setError(data.error || 'Could not load your cart.')
      })
      .catch(() => !cancelled && setError('Could not load your cart. Please check your connection.'))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (error) return <p role="alert" className="text-center text-red-700">{error}</p>
  if (lines === null) return <p className="text-center text-gray-600">Loading your cart…</p>

  if (lines.length === 0) {
    return (
      <div className="text-center bg-white rounded-3xl shadow-xl p-10">
        <h2 className="text-2xl font-display font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-600 mt-2">Have a look at our fresh produce and merchandise.</p>
        <Link href="/shop/" className="inline-block mt-6 bg-gradient-to-r from-accent-600 to-sage-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg">
          Go to the shop
        </Link>
      </div>
    )
  }

  const subtotal = lines.reduce((sum, l) => sum + (l.problem && l.available === 0 ? 0 : l.unitPriceKes * Math.min(l.quantity, l.available)), 0)
  const hasProblems = lines.some((l) => l.problem)

  return (
    <div className="space-y-6">
      <ul className="bg-white rounded-3xl shadow-xl border border-gray-100 divide-y divide-gray-100">
        {lines.map((line) => (
          <li key={line.variantId} className="p-4 sm:p-6 flex gap-4">
            <Link href={`/shop/${line.productSlug}/`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
              <ProductPhoto image={line.image} category={line.category} />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/shop/${line.productSlug}/`} className="font-display font-bold text-gray-900 hover:text-accent-700">{line.productName}</Link>
                  {line.variantLabel.toLowerCase() !== 'standard' && <p className="text-sm text-gray-600">{line.variantLabel}</p>}
                  <p className="text-sm text-gray-600">{kes(line.unitPriceKes)} each</p>
                </div>
                <p className="font-bold text-gray-900 whitespace-nowrap">{kes(line.unitPriceKes * line.quantity)}</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border-2 border-gray-200 rounded-full">
                  <button type="button" aria-label={`One less ${line.productName}`} onClick={() => setQuantity(line.variantId, line.quantity - 1)} className="p-2 text-gray-700 hover:text-accent-700">
                    <FiMinus />
                  </button>
                  <span className="w-8 text-center font-semibold">{line.quantity}</span>
                  <button
                    type="button"
                    aria-label={`One more ${line.productName}`}
                    onClick={() => setQuantity(line.variantId, line.quantity + 1)}
                    disabled={line.quantity >= line.available}
                    className="p-2 text-gray-700 hover:text-accent-700 disabled:opacity-30"
                  >
                    <FiPlus />
                  </button>
                </div>
                <button type="button" onClick={() => removeFromCart(line.variantId)} className="text-sm text-gray-500 hover:text-red-700 flex items-center gap-1">
                  <FiTrash2 /> Remove
                </button>
              </div>
              {line.problem && (
                <p className="text-sm text-clay-700 mt-2">
                  {line.problem}.{' '}
                  {line.available > 0 ? (
                    <button type="button" className="underline font-semibold" onClick={() => setQuantity(line.variantId, line.available)}>Change to {line.available}</button>
                  ) : (
                    'Please remove it to continue.'
                  )}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8">
        <div className="flex justify-between text-lg">
          <span className="font-semibold text-gray-800">Subtotal</span>
          <span className="font-bold text-gray-900">{kes(subtotal)}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {whatsapp ? 'We confirm the delivery fee and how to pay when we reply.' : 'Delivery fee is added at checkout, based on where you are.'}
        </p>
        {hasProblems ? (
          <p className="mt-6 text-center text-clay-700 font-semibold">Please fix the items marked above to continue.</p>
        ) : whatsapp ? (
          <>
            <a
              href={whatsappLink(whatsapp, lines, subtotal)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 mt-6 bg-[#1f8f4e] hover:bg-[#187a41] text-white py-4 rounded-full font-semibold shadow-lg"
            >
              <FaWhatsapp className="w-5 h-5" /> Send my order on WhatsApp
            </a>
            <p className="text-xs text-gray-500 text-center mt-3">WhatsApp opens with your order written out. Just press send, and we will reply to confirm.</p>
          </>
        ) : (
          <Link
            href="/shop/checkout/"
            className="block text-center mt-6 bg-gradient-to-r from-accent-600 to-sage-600 hover:from-accent-700 hover:to-sage-700 text-white py-4 rounded-full font-semibold shadow-lg"
          >
            Go to checkout
          </Link>
        )}
      </div>
    </div>
  )
}
