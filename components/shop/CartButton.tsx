'use client'

import Link from 'next/link'
import { FiShoppingCart } from 'react-icons/fi'
import { cartCount, useCart } from '@/lib/cart'

export default function CartButton() {
  const count = cartCount(useCart())
  return (
    <Link
      href="/shop/cart/"
      className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white px-4 py-2 text-sm font-semibold backdrop-blur-sm"
    >
      <FiShoppingCart className="w-4 h-4" />
      <span>Cart</span>
      <span className="min-w-[1.5rem] h-6 px-1.5 rounded-full bg-white text-accent-700 text-xs font-bold flex items-center justify-center">{count}</span>
    </Link>
  )
}
