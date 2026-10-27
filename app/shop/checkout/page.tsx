import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ShopClosed from '@/components/shop/ShopClosed'
import ShopHeader from '@/components/shop/ShopHeader'
import { redirect } from 'next/navigation'
import { checkoutEnabled, shopEnabled } from '@/lib/shop'
import CheckoutForm from './CheckoutForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } }

export default async function CheckoutPage() {
  if (!shopEnabled()) return <ShopClosed />
  if (!checkoutEnabled()) redirect('/shop/cart/') // orders go by WhatsApp until online payment is set up
  const zones = await prisma.deliveryZone.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } })
  return (
    <>
      <ShopHeader kicker="Shop" title="Checkout" back={{ label: 'Back to your cart', href: '/shop/cart/' }} />
      <section className="section-padding bg-gradient-to-br from-earth-50 via-white to-harvest-50">
        <div className="container-custom max-w-6xl">
          <CheckoutForm zones={zones.map((z) => ({ id: z.id, name: z.name, feeKes: z.feeKes, isPickup: z.isPickup }))} />
        </div>
      </section>
    </>
  )
}
