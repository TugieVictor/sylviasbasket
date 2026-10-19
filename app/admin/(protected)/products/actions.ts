'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth/session'
import { slugify } from '@/lib/slug'

async function requireAdmin() {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/admin/login/')
  return admin
}

const clean = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')
const whole = (value: unknown, min = 0, max = 10_000_000) => Math.min(max, Math.max(min, Math.round(Number(value) || 0)))

async function uniqueProductSlug(base: string, ignoreId?: string) {
  let slug = base
  for (let n = 2; ; n++) {
    const taken = await prisma.product.findFirst({ where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) }, select: { id: true } })
    if (!taken) return slug
    slug = `${base}-${n}`
  }
}

export type ProductInput = {
  id?: string
  name: string
  slug?: string
  shopCategoryId: string
  category: 'PRODUCE' | 'MERCHANDISE'
  summary: string
  description: string
  active: boolean
  availableThisWeek: boolean
  sortOrder: number
  images: { url: string; alt: string }[]
  variants: { id?: string; label: string; priceKes: number; stock: number; active: boolean }[]
}

/** Saves a product with its photos and options. Returns an error message, or redirects when saved. */
export async function saveProduct(input: ProductInput): Promise<{ error: string } | void> {
  await requireAdmin()

  const name = clean(input.name, 120)
  if (!name) return { error: 'Please enter a product name.' }
  const variants = (Array.isArray(input.variants) ? input.variants : []).slice(0, 20).map((v, index) => ({
    id: clean(v.id, 40) || undefined,
    label: clean(v.label, 60) || 'Standard',
    priceKes: whole(v.priceKes, 0, 1_000_000),
    stock: whole(v.stock, 0, 100_000),
    active: v.active !== false,
    sortOrder: index + 1,
  }))
  if (variants.length === 0) return { error: 'Please add at least one size or option with a price.' }
  if (variants.some((v) => v.priceKes < 1)) return { error: 'Every option needs a price of at least KES 1.' }

  const images = (Array.isArray(input.images) ? input.images : [])
    .filter((i) => typeof i?.url === 'string' && (/^\/api\/images\/[a-z0-9]+$/.test(i.url) || i.url.startsWith('/images/')))
    .slice(0, 8)
    .map((i) => ({ url: i.url, alt: clean(i.alt, 150) || name }))

  const shopCategoryId = clean(input.shopCategoryId, 40)
  const category = input.category === 'MERCHANDISE' ? 'MERCHANDISE' : 'PRODUCE'
  const existingId = clean(input.id, 40) || undefined
  const slug = await uniqueProductSlug(slugify(clean(input.slug, 80) || name), existingId)

  const data = {
    name,
    slug,
    category,
    shopCategoryId: shopCategoryId || null,
    summary: clean(input.summary, 200) || null,
    description: clean(input.description, 5000) || null,
    active: !!input.active,
    availableThisWeek: input.availableThisWeek !== false,
    sortOrder: whole(input.sortOrder, -1000, 1000),
    images,
  } as const

  const productId = await prisma.$transaction(async (tx) => {
    const product = existingId
      ? await tx.product.update({ where: { id: existingId }, data, select: { id: true } })
      : await tx.product.create({ data, select: { id: true } })

    const keep = variants.filter((v) => v.id).map((v) => v.id!)
    // Options removed in the form. Past orders keep their own copy of names and prices.
    await tx.productVariant.deleteMany({ where: { productId: product.id, id: { notIn: keep } } })
    for (const v of variants) {
      const { id, ...fields } = v
      if (id) await tx.productVariant.updateMany({ where: { id, productId: product.id }, data: fields })
      else await tx.productVariant.create({ data: { ...fields, productId: product.id } })
    }
    return product.id
  })

  revalidatePath('/shop')
  redirect(`/admin/products/${productId}/?done=saved`)
}

export async function deleteProduct(form: FormData) {
  await requireAdmin()
  const id = clean(form.get('id'), 40)
  if (form.get('confirm') !== 'on') redirect(`/admin/products/${id}/?error=Tick+the+box+to+confirm+deleting`)
  await prisma.product.delete({ where: { id } })
  revalidatePath('/shop')
  redirect('/admin/products/?done=deleted')
}

export async function toggleProduct(form: FormData) {
  await requireAdmin()
  const id = clean(form.get('id'), 40)
  const field = form.get('field') === 'availableThisWeek' ? 'availableThisWeek' : 'active'
  const product = await prisma.product.findUnique({ where: { id }, select: { active: true, availableThisWeek: true } })
  if (product) await prisma.product.update({ where: { id }, data: { [field]: !product[field] } })
  revalidatePath('/shop')
  redirect('/admin/products/')
}

export async function saveCategory(form: FormData) {
  await requireAdmin()
  const id = clean(form.get('id'), 40)
  const name = clean(form.get('name'), 60)
  if (!name) redirect('/admin/products/categories/?error=Please+enter+a+name')
  let slug = slugify(clean(form.get('slug'), 60) || name)
  const clash = await prisma.shopCategory.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) } })
  if (clash) slug = `${slug}-${Date.now().toString(36).slice(-4)}`
  const data = {
    name,
    slug,
    description: clean(form.get('description'), 200) || null,
    active: form.get('active') === 'on',
    sortOrder: whole(form.get('sortOrder'), -1000, 1000),
  }
  if (id) await prisma.shopCategory.update({ where: { id }, data })
  else await prisma.shopCategory.create({ data })
  revalidatePath('/shop')
  redirect('/admin/products/categories/?done=saved')
}
