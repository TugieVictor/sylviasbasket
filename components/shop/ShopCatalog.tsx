'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FiArrowRight, FiSun } from 'react-icons/fi'
import ProductPhoto from './ProductPhoto'

export type CatalogCategory = { id: string; slug: string; name: string; description: string | null; productCount: number }
export type CatalogProduct = {
  id: string
  slug: string
  name: string
  summary: string | null
  category: 'PRODUCE' | 'MERCHANDISE'
  shopCategoryId: string | null
  image: { url: string; alt?: string } | null
  status: string | null
  canBuy: boolean
  minPrice: number
  maxPrice: number
}

const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`

/**
 * Category menu and product grid. The page is stored ready-made, and the
 * chosen category (?category=...) is applied here in the browser.
 */
type Props = { categories: CatalogCategory[]; products: CatalogProduct[]; footnote: string }

export default function ShopCatalog(props: Props) {
  const params = useSearchParams()
  return <CatalogView {...props} categorySlug={params.get('category')} />
}

/** The catalog itself, for a given category (null = all). Also used as the first-load version before the category is read. */
export function CatalogView({ categories, products, footnote, categorySlug }: Props & { categorySlug: string | null }) {
  const current = categories.find((c) => c.slug === categorySlug)
  const shown = current ? products.filter((p) => p.shopCategoryId === current.id) : products

  const menu = [
    { label: 'All products', href: '/shop/#products', active: !current, count: products.length },
    ...categories.map((c) => ({ label: c.name, href: `/shop/?category=${c.slug}#products`, active: current?.id === c.id, count: c.productCount })),
  ]

  return (
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
                scroll={false}
                aria-current={item.active ? 'page' : undefined}
                className={`flex items-center justify-between gap-3 whitespace-nowrap rounded-full lg:rounded-xl px-4 py-2.5 text-sm font-semibold border transition-colors ${
                  item.active
                    ? 'bg-accent-600 border-accent-600 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-accent-400 hover:text-accent-700'
                }`}
              >
                <span>{item.label}</span>
                <span className={`text-xs rounded-full px-2 py-0.5 ${item.active ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{item.count}</span>
              </Link>
            ))}
            <Link
              href="/farm-visits/"
              className="flex items-center justify-between gap-3 whitespace-nowrap rounded-full lg:rounded-xl px-4 py-2.5 text-sm font-semibold border bg-white border-gray-200 text-gray-700 hover:border-accent-400 hover:text-accent-700 transition-colors"
            >
              <span>Farm tours</span>
              <FiArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
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
          <p className="text-sm text-gray-500">{shown.length} {shown.length === 1 ? 'product' : 'products'}</p>
        </div>

        {shown.length === 0 ? (
          <div className="text-center bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
            <h3 className="text-xl font-display font-bold text-gray-900">Nothing here yet</h3>
            <p className="text-gray-600 mt-2">New products are added often. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {shown.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}/`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ProductPhoto image={product.image} category={product.category} className="group-hover:scale-105 transition-transform duration-500" />
                  {product.status && (
                    <span className="absolute top-3 left-3 bg-white/95 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow">{product.status}</span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-lg text-gray-900 group-hover:text-accent-700 transition-colors">{product.name}</h3>
                  {product.summary && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.summary}</p>}
                  <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                    <p className="font-bold text-gray-900">
                      {product.minPrice !== product.maxPrice && <span className="text-xs font-normal text-gray-500">From </span>}
                      {kes(product.minPrice)}
                    </p>
                    <span className="text-sm font-semibold text-accent-700">{product.canBuy ? 'View' : 'Details'} &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
            {!current && (
              <Link
                href="/farm-visits/"
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[20rem] flex flex-col justify-end"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/hero/hero-field-visit-800.webp" alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sage-900/95 via-sage-900/50 to-transparent"></div>
                <div className="relative p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wide text-harvest-200 flex items-center gap-1.5"><FiSun /> Farm tours</p>
                  <h3 className="font-display font-bold text-lg mt-1">Visit the farm</h3>
                  <p className="text-sm text-white/85 mt-1">For individuals, groups and schools. Request a date and Sylvia will confirm.</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold mt-3">Request a visit <FiArrowRight /></span>
                </div>
              </Link>
            )}
          </div>
        )}

        <p className="text-sm text-gray-500 mt-10">{footnote}</p>
      </div>
    </div>
  )
}
