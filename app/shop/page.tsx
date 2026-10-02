import type { Metadata } from 'next'
import Link from 'next/link'
import ProductPhoto from '@/components/shop/ProductPhoto'
import ShopClosed from '@/components/shop/ShopClosed'
import ShopHeader from '@/components/shop/ShopHeader'
import { CATEGORY_LABELS, getShopProducts, priceLabel, productAvailability, productImages, shopEnabled } from '@/lib/shop'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop',
  description: "Fresh organic produce from the farm and Sylvia's Basket merchandise, delivered in Nairobi and across Kenya.",
}

const tabs = [
  { label: 'Everything', value: undefined },
  { label: 'Farm produce', value: 'PRODUCE' },
  { label: 'Merchandise', value: 'MERCHANDISE' },
] as const

export default async function ShopPage({ searchParams }: { searchParams: { category?: string } }) {
  if (!shopEnabled()) return <ShopClosed />

  const category = searchParams.category === 'PRODUCE' || searchParams.category === 'MERCHANDISE' ? searchParams.category : undefined
  const products = await getShopProducts(category)

  return (
    <>
      <ShopHeader
        kicker="Shop"
        title="From our farm to your table"
        intro="Fresh organic produce and Sylvia's Basket merchandise. Delivery in Nairobi and across Kenya."
      />

      <section className="section-padding bg-gradient-to-br from-earth-50 via-white to-harvest-50">
        <div className="container-custom">
          <nav aria-label="Shop categories" className="flex flex-wrap justify-center gap-2 mb-10">
            {tabs.map((tab) => {
              const active = tab.value === category
              return (
                <Link
                  key={tab.label}
                  href={tab.value ? `/shop/?category=${tab.value}` : '/shop/'}
                  aria-current={active ? 'page' : undefined}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
                    active ? 'bg-accent-600 border-accent-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-accent-400'
                  }`}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>

          {products.length === 0 ? (
            <div className="max-w-xl mx-auto text-center bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-display font-bold text-gray-900">Nothing here yet</h2>
              <p className="text-gray-700 mt-3">New products are added often. Please check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const info = productAvailability(product)
                return (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}/`}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <ProductPhoto image={productImages(product)[0] || null} category={product.category} className="group-hover:scale-105 transition-transform duration-500" />
                      {info.status && (
                        <span className="absolute top-3 left-3 bg-white/95 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow">{info.status}</span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">{CATEGORY_LABELS[product.category]}</p>
                      <h2 className="font-display font-bold text-lg text-gray-900 mt-1">{product.name}</h2>
                      {product.summary && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.summary}</p>}
                      <p className="mt-auto pt-4 font-bold text-gray-900">{priceLabel(info.minPrice, info.maxPrice)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <p className="text-center text-sm text-gray-600 mt-12">
            Prices are final prices in KES. Delivery fees are shown at checkout.
          </p>
        </div>
      </section>
    </>
  )
}
