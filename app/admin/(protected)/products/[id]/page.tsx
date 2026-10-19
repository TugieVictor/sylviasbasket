import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { productImages } from '@/lib/shop'
import ProductEditor from './ProductEditor'
import { deleteProduct } from '../actions'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params, searchParams }: { params: { id: string }; searchParams: { done?: string; error?: string } }) {
  const isNew = params.id === 'new'
  const [categories, product] = await Promise.all([
    prisma.shopCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
    isNew ? null : prisma.product.findUnique({ where: { id: params.id }, include: { variants: { orderBy: { sortOrder: 'asc' } } } }),
  ])
  if (!isNew && !product) notFound()

  return (
    <div className="space-y-5 max-w-3xl">
      <Link href="/admin/products/" className="text-sm text-accent-700 underline">← All products</Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">{product ? product.name : 'Add a product'}</h1>
        {product?.active && <Link href={`/shop/${product.slug}/`} target="_blank" className="text-sm font-semibold text-accent-700 underline">View in shop ↗</Link>}
      </div>
      {searchParams.done && <p role="status" className="bg-accent-50 border border-accent-200 text-accent-800 rounded-xl px-4 py-3 text-sm">Saved. The shop is updated.</p>}
      {searchParams.error && <p role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">{searchParams.error}</p>}

      <ProductEditor
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        product={
          product
            ? {
                id: product.id,
                name: product.name,
                slug: product.slug,
                shopCategoryId: product.shopCategoryId || '',
                category: product.category,
                summary: product.summary || '',
                description: product.description || '',
                active: product.active,
                availableThisWeek: product.availableThisWeek,
                sortOrder: product.sortOrder,
                images: productImages(product).map((i) => ({ url: i.url, alt: i.alt || '' })),
                variants: product.variants.map((v) => ({ id: v.id, label: v.label, priceKes: v.priceKes, stock: v.stock, active: v.active })),
              }
            : undefined
        }
      />

      {product && (
        <form action={deleteProduct} className="bg-white rounded-2xl border border-red-200 p-5 space-y-3">
          <h2 className="font-bold text-red-800">Delete this product</h2>
          <p className="text-sm text-gray-600">This removes it from the shop for good. Past orders keep their details. To take it off the shop for a while, untick &quot;Shown in the shop&quot; instead.</p>
          <input type="hidden" name="id" value={product.id} />
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" name="confirm" /> Yes, delete {product.name}</label>
          <button className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-red-700 text-white">Delete product</button>
        </form>
      )}
    </div>
  )
}
