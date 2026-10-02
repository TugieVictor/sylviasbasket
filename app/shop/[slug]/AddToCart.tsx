'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FiCheck, FiMinus, FiPlus } from 'react-icons/fi'
import { addToCart, useCart } from '@/lib/cart'

type Variant = { id: string; label: string; priceKes: number; stock: number }

const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`

export default function AddToCart({ variants }: { variants: Variant[] }) {
  const firstInStock = variants.find((v) => v.stock > 0) || variants[0]
  const [variantId, setVariantId] = useState(firstInStock.id)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const cart = useCart()

  const variant = variants.find((v) => v.id === variantId) || firstInStock
  const inCart = cart.find((i) => i.variantId === variant.id)?.quantity || 0
  const canAdd = Math.max(0, variant.stock - inCart)
  const showOptions = variants.length > 1 || variants[0].label.toLowerCase() !== 'standard'

  const choose = (id: string) => {
    setVariantId(id)
    setQuantity(1)
    setAdded(false)
  }

  const add = () => {
    if (quantity < 1 || quantity > canAdd) return
    addToCart(variant.id, quantity)
    setAdded(true)
    setQuantity(1)
  }

  return (
    <div className="space-y-6">
      <p className="text-3xl font-display font-bold text-gray-900">{kes(variant.priceKes)}</p>

      {showOptions && (
        <fieldset>
          <legend className="text-sm font-semibold text-gray-800 mb-2">Choose an option</legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const selected = v.id === variant.id
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => choose(v.id)}
                  disabled={v.stock < 1}
                  aria-pressed={selected}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-colors disabled:opacity-40 disabled:line-through ${
                    selected ? 'border-accent-600 bg-accent-50 text-accent-800' : 'border-gray-200 text-gray-700 hover:border-accent-400'
                  }`}
                >
                  {v.label}
                  {variants.some((x) => x.priceKes !== v.priceKes) && <span className="font-normal"> · {kes(v.priceKes)}</span>}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center border-2 border-gray-200 rounded-full">
          <button type="button" aria-label="One less" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3 text-gray-700 hover:text-accent-700 disabled:opacity-30" disabled={quantity <= 1}>
            <FiMinus />
          </button>
          <span aria-live="polite" className="w-10 text-center font-semibold">{quantity}</span>
          <button type="button" aria-label="One more" onClick={() => setQuantity((q) => Math.min(canAdd, q + 1))} className="p-3 text-gray-700 hover:text-accent-700 disabled:opacity-30" disabled={quantity >= canAdd}>
            <FiPlus />
          </button>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={canAdd < 1}
          className="flex-1 min-w-[12rem] bg-gradient-to-r from-accent-600 to-sage-600 hover:from-accent-700 hover:to-sage-700 text-white py-3.5 px-6 rounded-full font-semibold shadow-lg disabled:opacity-50"
        >
          {canAdd < 1 ? 'All available stock is in your cart' : 'Add to cart'}
        </button>
      </div>

      {variant.stock <= 5 && <p className="text-sm text-clay-700">Only {variant.stock} left</p>}

      {added && (
        <div role="status" className="flex flex-wrap items-center justify-between gap-3 bg-accent-50 border border-accent-200 rounded-xl px-4 py-3">
          <p className="text-accent-800 font-semibold flex items-center gap-2"><FiCheck /> Added to your cart</p>
          <div className="flex gap-4 text-sm font-semibold">
            <Link href="/shop/" className="text-gray-700 hover:text-accent-700">Keep shopping</Link>
            <Link href="/shop/cart/" className="text-accent-700 hover:text-accent-800">View cart &rarr;</Link>
          </div>
        </div>
      )}
    </div>
  )
}
