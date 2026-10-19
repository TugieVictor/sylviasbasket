import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { productImages } from '@/lib/shop'
import ProductPhoto from '@/components/shop/ProductPhoto'
import { toggleProduct } from './actions'

export const dynamic = 'force-dynamic'

const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`

export default async function AdminProductsPage({ searchParams }: { searchParams: { done?: string } }) {
  const products = await prisma.product.findMany({
    include: { variants: { orderBy: { sortOrder: 'asc' } }, shopCategory: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Everything in the shop. Changes show on the website straight away.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products/categories/" className="px-4 py-2.5 rounded-xl font-semibold text-sm border border-gray-300 bg-white">Categories</Link>
          <Link href="/admin/products/new/" className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-accent-600 text-white">+ Add product</Link>
        </div>
      </div>
      {searchParams.done === 'deleted' && <p role="status" className="bg-accent-50 border border-accent-200 text-accent-800 rounded-xl px-4 py-3 text-sm">Product deleted.</p>}

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-600">No products yet. Add your first one.</div>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => {
            const prices = p.variants.map((v) => v.priceKes)
            const stock = p.variants.filter((v) => v.active).reduce((sum, v) => sum + v.stock, 0)
            const low = p.variants.some((v) => v.active && v.stock <= 3)
            return (
              <li key={p.id} className={`bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${p.active ? '' : 'opacity-70'}`}>
                <Link href={`/admin/products/${p.id}/`} className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <ProductPhoto image={productImages(p)[0] || null} category={p.category} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{p.name}</p>
                    <p className="text-sm text-gray-600">
                      {p.shopCategory?.name || 'No category'} · {prices.length ? (Math.min(...prices) === Math.max(...prices) ? kes(prices[0]) : `${kes(Math.min(...prices))} to ${kes(Math.max(...prices))}`) : 'No price'}
                    </p>
                    <p className={`text-sm ${stock === 0 ? 'text-red-700 font-semibold' : low ? 'text-clay-700' : 'text-gray-500'}`}>
                      {stock === 0 ? 'Out of stock' : `${stock} in stock`}{p.variants.length > 1 ? ` across ${p.variants.length} options` : ''}
                    </p>
                  </div>
                </Link>
                <div className="flex flex-wrap gap-2">
                  {p.category === 'PRODUCE' && (
                    <form action={toggleProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="field" value="availableThisWeek" />
                      <button className={`px-3 py-2 rounded-lg text-xs font-semibold border ${p.availableThisWeek ? 'border-accent-300 bg-accent-50 text-accent-800' : 'border-gray-300 bg-gray-50 text-gray-600'}`}>
                        {p.availableThisWeek ? 'Available this week' : 'Not this week'}
                      </button>
                    </form>
                  )}
                  <form action={toggleProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="field" value="active" />
                    <button className={`px-3 py-2 rounded-lg text-xs font-semibold border ${p.active ? 'border-accent-300 bg-accent-50 text-accent-800' : 'border-gray-300 bg-gray-50 text-gray-600'}`}>
                      {p.active ? 'Shown in shop' : 'Hidden'}
                    </button>
                  </form>
                  <Link href={`/admin/products/${p.id}/`} className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-300">Edit</Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <p className="text-xs text-gray-500">Tap the green buttons to switch a product on or off quickly. Stock shown is what customers can buy now; items in unpaid orders are held for 60 minutes.</p>
    </div>
  )
}
