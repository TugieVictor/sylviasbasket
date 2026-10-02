import type { Metadata } from 'next'
import ShopClosed from '@/components/shop/ShopClosed'
import ShopHeader from '@/components/shop/ShopHeader'
import { shopEnabled } from '@/lib/shop'
import CartView from './CartView'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Your cart', robots: { index: false } }

export default function CartPage() {
  if (!shopEnabled()) return <ShopClosed />
  return (
    <>
      <ShopHeader kicker="Shop" title="Your cart" back={{ label: 'Keep shopping', href: '/shop/' }} />
      <section className="section-padding bg-gradient-to-br from-earth-50 via-white to-harvest-50">
        <div className="container-custom max-w-4xl">
          <CartView />
        </div>
      </section>
    </>
  )
}
