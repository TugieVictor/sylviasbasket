import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { FiCreditCard, FiTruck } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { GiPlantSeed } from 'react-icons/gi'
import CartButton from '@/components/shop/CartButton'
import ShopCatalog, { CatalogView, type CatalogCategory, type CatalogProduct } from '@/components/shop/ShopCatalog'
import ShopClosed from '@/components/shop/ShopClosed'
import ShopHeroSlider from '@/components/shop/ShopHeroSlider'
import { checkoutEnabled, emptyDuringBuild, getShopCategories, getShopProducts, productAvailability, productImages, shopEnabled } from '@/lib/shop'
import { shopSlides } from '@/lib/shopSlides'

// Stored ready-made and refreshed every minute, or straight away when Sylvia changes products in the admin
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Shop',
  description: "Pure honey, fresh organic produce and Sylvia's Basket merchandise, delivered in Nairobi and across Kenya.",
}

const promises = (online: boolean) => [
  { icon: FiTruck, title: 'Delivery across Kenya', text: 'Nairobi and beyond, or collect from the farm' },
  online
    ? { icon: FiCreditCard, title: 'Pay with M-Pesa', text: 'A PIN request comes straight to your phone' }
    : { icon: FaWhatsapp, title: 'Order on WhatsApp', text: 'Fill your cart and send it to us. We confirm and arrange payment' },
  { icon: GiPlantSeed, title: 'Grown the organic way', text: 'Every purchase supports our work with farmers' },
]

/** Products and categories for the catalog. */
async function loadCatalog(): Promise<{ categories: CatalogCategory[]; products: CatalogProduct[] }> {
  try {
    const [categories, products] = await Promise.all([getShopCategories(), getShopProducts()])
    return {
      categories: categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name, description: c.description, productCount: c.productCount })),
      products: products.map((p) => {
        const info = productAvailability(p)
        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          summary: p.summary,
          category: p.category,
          shopCategoryId: p.shopCategoryId,
          image: productImages(p)[0] || null,
          status: info.status,
          canBuy: info.canBuy,
          minPrice: info.minPrice,
          maxPrice: info.maxPrice,
        }
      }),
    }
  } catch (error) {
    return emptyDuringBuild({ categories: [] as CatalogCategory[], products: [] as CatalogProduct[] })(error)
  }
}

export default async function ShopPage() {
  if (!shopEnabled()) return <ShopClosed />

  const { categories, products } = await loadCatalog()
  const slides = shopSlides.filter((s) => fs.existsSync(path.join(process.cwd(), 'public', `${s.image}-1200.webp`)))
  const footnote = `Prices are final prices in KES. ${checkoutEnabled() ? 'Delivery fees are shown at checkout.' : 'We confirm the delivery fee when we reply to your order.'}`

  return (
    <>
      <section className="relative overflow-hidden bg-sage-900 pt-28 md:pt-32 pb-10">
        <div aria-hidden="true" className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-accent-500/25 rounded-full blur-3xl"></div>
        <div aria-hidden="true" className="absolute -bottom-24 -right-24 w-[26rem] h-[26rem] bg-harvest-500/20 rounded-full blur-3xl"></div>
        <div className="container-custom relative z-10">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-kicker text-white/70">Sylvia&apos;s Basket shop</p>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">From our farm to your table</h1>
            </div>
            <CartButton />
          </div>
          {slides.length > 0 && <ShopHeroSlider slides={slides} />}
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            {promises(checkoutEnabled()).map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 py-3 backdrop-blur-sm">
                <span className="w-10 h-10 rounded-xl bg-white/15 text-harvest-200 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{title}</span>
                  <span className="block text-xs text-white/70">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="products" className="scroll-mt-24 py-12 md:py-16 bg-gradient-to-br from-earth-50 via-white to-harvest-50">
        <Suspense fallback={<CatalogView categories={categories} products={products} footnote={footnote} categorySlug={null} />}>
          <ShopCatalog categories={categories} products={products} footnote={footnote} />
        </Suspense>
      </section>
    </>
  )
}
