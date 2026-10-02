'use client'

import { useSyncExternalStore } from 'react'

/**
 * The cart lives in the visitor's browser (only product choices and
 * quantities). Prices are always looked up again on the server.
 */
export type CartItem = { variantId: string; quantity: number }

const KEY = 'sb-cart-v1'
const EVENT = 'sb-cart-change'
const MAX_PER_ITEM = 20
const EMPTY: CartItem[] = []

let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY }

function read(): CartItem[] {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(KEY)
  } catch {
    return cache.items
  }
  if (raw === cache.raw) return cache.items
  let items: CartItem[] = EMPTY
  try {
    const parsed = JSON.parse(raw || '[]')
    if (Array.isArray(parsed)) {
      items = parsed
        .filter((i) => i && typeof i.variantId === 'string' && Number.isFinite(i.quantity))
        .map((i) => ({ variantId: i.variantId, quantity: Math.max(1, Math.min(MAX_PER_ITEM, Math.floor(i.quantity))) }))
    }
  } catch {
    items = EMPTY
  }
  cache = { raw, items }
  return items
}

function write(items: CartItem[]) {
  const raw = JSON.stringify(items)
  try {
    window.localStorage.setItem(KEY, raw)
  } catch {
    // Storage blocked (private mode): keep the cart for this page only
  }
  cache = { raw, items }
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(callback: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && callback()
  window.addEventListener(EVENT, callback)
  window.addEventListener('storage', onStorage) // other tabs
  return () => {
    window.removeEventListener(EVENT, callback)
    window.removeEventListener('storage', onStorage)
  }
}

export function useCart() {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export const cartCount = (items: CartItem[]) => items.reduce((sum, i) => sum + i.quantity, 0)

export function addToCart(variantId: string, quantity: number) {
  const items = read()
  const existing = items.find((i) => i.variantId === variantId)
  const next = existing
    ? items.map((i) => (i.variantId === variantId ? { ...i, quantity: Math.min(MAX_PER_ITEM, i.quantity + quantity) } : i))
    : [...items, { variantId, quantity: Math.min(MAX_PER_ITEM, quantity) }]
  write(next)
}

export function setQuantity(variantId: string, quantity: number) {
  const q = Math.floor(quantity)
  write(q < 1 ? read().filter((i) => i.variantId !== variantId) : read().map((i) => (i.variantId === variantId ? { ...i, quantity: Math.min(MAX_PER_ITEM, q) } : i)))
}

export const removeFromCart = (variantId: string) => write(read().filter((i) => i.variantId !== variantId))
export const clearCart = () => write([])
