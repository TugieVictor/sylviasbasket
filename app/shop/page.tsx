import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import Link from 'next/link'
import { FiCreditCard, FiTruck } from 'react-icons/fi'
import { GiPlantSeed } from 'react-icons/gi'
import CartButton from '@/components/shop/CartButton'
import ProductPhoto from '@/components/shop/ProductPhoto'
import ShopClosed from '@/components/shop/ShopClosed'
import { prisma } from '@/lib/prisma'
import ShopHeroSlider from '@/components/shop/ShopHeroSlider'
import { getShopCategories, getShopProducts, priceLabel, productAvailability, productImages, shopEnabled } from '@/lib/shop'
import { shopSlides } from '@/lib/shopSlides'
import { releaseExpiredOrders } from '@/lib/orders'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop',
  description: "Pure honey, fresh organic produce and Sylvia's Basket merchandise, delivered in Nairobi and across Kenya.",
}

const promises = [
  { icon: FiTruck, title: 'Delivery across Kenya', text: 'Nairobi and beyond, or collect from the farm' },
  { icon: FiCreditCard, title: 'Pay safely online', text: 'M-Pesa or card through iPay' },
  { icon: GiPlantSeed, title: 'Grown the organic way', text: 'Every purchase supports our work with farmers' },
]

export default async function ShopPage({ searchParams }: { searchParams: { category?: string } }) {
  if (!shopEnabled()) return <ShopClosed />

  await releaseExpiredOrders()
  const categories = await getShopCategories()
  const current = categories.find((c) => c.slug === searchParams.category)
  const products = await getShopProducts(current?.id)
  const totalCount = current ? await prisma.product.count({ where: { active: true } }) : products.length
  const slides = shopSlides.filter((s) => fs.existsSync(path.join(process.cwd(), 'public', `${s.image}-1200.webp`)))

  const menu = [
    { label: 'All products', href: '/shop/#products', active: !current, count: totalCount },
    ...categories.map((c) => ({ label: c.name, href: `/shop/?category=${c.slug}#products`, active: current?.id === c.id, count: c.productCount })),
  ]

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
            {promises.map(({ icon: Icon, title, text }) => (
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
        <div className="container-custom grid grid-cols-1 lg:grid-cols-[15rem_1fr] gap-8 lg:gap-10">
          {/* Categories: a list on the left on wide screens, a sliding row on phones */}
          <aside aria-label="Shop categories">
            <div className="lg:sticky lg:top-28">
              <h2 className="hidden lg:block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">Shop by category</h2>
              <nav className="flex lg:flex-col gap-2 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 pb-2 lg:pb-0">
                {menu.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={item.active ? 'page' : undefined}
                    className={`flex items-center justify-between gap-3 whitespace-nowrap rounded-full lg:rounded-xl px-4 py-2.5 text-sm font-semibold border transition-colors ${
                      item.active
                        ? 'bg-accent-600 border-accent-600 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-accent-400 hover:text-accent-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.count !== undefined && (
                      <span className={`text-xs rounded-full px-2 py-0.5 ${item.active ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{item.count}</span>
                    )}
                  </Link>
                ))}
              </nav>
              <div className="hidden lg:block mt-8 rounded-2xl bg-gradient-to-br from-harvest-50 to-white border border-harvest-200 p-5">
                <p className="font-display font-bold text-gray-900">Buying in bulk?</p>
                <p className="text-sm text-gray-600 mt-1">For large orders or events, get in touch and we will help.</p>
                <Link href="/get-involved/#contact-section" className="inline-block text-sm font-semibold text-accent-700 hover:text-accent-800 mt-3">Contact us &rarr;</Link>
              </div>
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-2 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900">{current ? current.name : 'All products'}</h2>
                {current?.description && <p className="text-gray-600 mt-1">{current.description}</p>}
              </div>
              <p className="text-sm text-gray-500">{products.length} {products.length === 1 ? 'product' : 'products'}</p>
            </div>

            {products.length === 0 ? (
              <div className="text-center bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
                <h3 className="text-xl font-display font-bold text-gray-900">Nothing here yet</h3>
                <p className="text-gray-600 mt-2">New products are added often. Please check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => {
                  const info = productAvailability(product)
                  return (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}/`}
                      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <ProductPhoto image={productImages(product)[0] || null} category={product.category} className="group-hover:scale-105 transition-transform duration-500" />
                        {info.status && (
                          <span className="absolute top-3 left-3 bg-white/95 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow">{info.status}</span>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-display font-bold text-lg text-gray-900 group-hover:text-accent-700 transition-colors">{product.name}</h3>
                        {product.summary && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.summary}</p>}
                        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                          <p className="font-bold text-gray-900">
                            {info.minPrice !== info.maxPrice && <span className="text-xs font-normal text-gray-500">From </span>}
                            {priceLabel(info.minPrice, info.minPrice)}
                          </p>
                          <span className="text-sm font-semibold text-accent-700">{info.canBuy ? 'View' : 'Details'} &rarr;</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

            <p className="text-sm text-gray-500 mt-10">Prices are final prices in KES. Delivery fees are shown at checkout.</p>
          </div>
        </div>
      </section>
    </>
  )
}
