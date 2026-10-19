import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { saveCategory } from '../actions'

export const dynamic = 'force-dynamic'

const input = 'w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-accent-600 outline-none'

type Row = { id: string; name: string; slug: string; description: string | null; active: boolean; sortOrder: number; _count?: { products: number } }

function CategoryForm({ category }: { category?: Row }) {
  return (
    <form action={saveCategory} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <input type="hidden" name="id" value={category?.id || ''} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
          <input name="name" required defaultValue={category?.name} className={input} placeholder="e.g. Honey" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Short description (optional)</label>
          <input name="description" defaultValue={category?.description || ''} className={input} />
        </div>
      </div>
      <input type="hidden" name="slug" value={category?.slug || ''} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
          <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={category ? category.active : true} /> Shown in the shop</label>
          <label className="flex items-center gap-2">Position <input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} className="w-16 px-2 py-1 rounded-lg border border-gray-300" /></label>
          {category?._count && <span className="text-gray-500">{category._count.products} products</span>}
        </div>
        <button className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-accent-600 text-white">{category ? 'Save' : 'Add category'}</button>
      </div>
    </form>
  )
}

export default async function CategoriesPage({ searchParams }: { searchParams: { done?: string; error?: string } }) {
  const categories = await prisma.shopCategory.findMany({ orderBy: { sortOrder: 'asc' }, include: { _count: { select: { products: true } } } })
  return (
    <div className="space-y-5 max-w-3xl">
      <Link href="/admin/products/" className="text-sm text-accent-700 underline">← All products</Link>
      <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Shop categories</h1>
      <p className="text-gray-600">These are the sections on the left of the shop. Lower positions come first.</p>
      {searchParams.done && <p role="status" className="bg-accent-50 border border-accent-200 text-accent-800 rounded-xl px-4 py-3 text-sm">Saved.</p>}
      {searchParams.error && <p role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">{searchParams.error}</p>}
      {categories.map((c) => <CategoryForm key={c.id} category={c} />)}
      <h2 className="text-lg font-bold text-gray-900 pt-4">Add a new category</h2>
      <CategoryForm />
    </div>
  )
}
