import fs from 'fs'
import path from 'path'
import type { Product, ProductVariant } from '@prisma/client'
import { prisma } from '@/lib/prisma'

/**
 * Shop helpers used by the shop pages, checkout and admin.
 *
 * The shop is always on while developing. On the live site it stays on the
 * "coming soon" page until SHOP_ENABLED=true is set (version_2_plan.md:
 * one codebase, commerce switched on or off by a setting).
 */
export const shopEnabled = () => process.env.SHOP_ENABLED === 'true' || process.env.NODE_ENV !== 'production'

export const MAX_PER_ITEM = 20

export type ProductImage = { url: string; alt?: string }

// Remembers which local photo files exist, so a missing file never shows as a broken image
const fileChecks = new Map<string, boolean>()
export function localFileExists(url: string) {
  if (!url.startsWith('/images/')) return true // uploaded in the admin, or hosted elsewhere
  if (!fileChecks.has(url) || process.env.NODE_ENV !== 'production') {
    fileChecks.set(url, fs.existsSync(path.join(process.cwd(), 'public', decodeURIComponent(url.split('?')[0]))))
  }
  return fileChecks.get(url)!
}

export function productImages(product: Pick<Product, 'images' | 'name'>): ProductImage[] {
  const list = Array.isArray(product.images) ? (product.images as unknown[]) : []
  return list
    .filter((item): item is ProductImage => !!item && typeof (item as ProductImage).url === 'string')
    .filter((item) => localFileExists(item.url))
    .map((item) => ({ url: item.url, alt: item.alt || product.name }))
}

export const CATEGORY_LABELS = { PRODUCE: 'Farm produce', MERCHANDISE: 'Merchandise' } as const

type WithVariants = Product & { variants: ProductVariant[] }

/** Whether a product can be bought now, and the price range to show. */
export function productAvailability(product: WithVariants) {
  const variants = product.variants.filter((v) => v.active)
  const inStock = variants.filter((v) => v.stock > 0)
  const seasonal = product.category === 'PRODUCE' && !product.availableThisWeek
  const prices = variants.map((v) => v.priceKes)
  return {
    variants,
    canBuy: !seasonal && inStock.length > 0,
    status: seasonal ? 'Not available this week' : inStock.length === 0 ? 'Sold out' : null,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
  }
}

export function priceLabel(min: number, max: number) {
  const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`
  return min === max ? kes(min) : `${kes(min)} to ${kes(max)}`
}

/** Shop sections for the left-hand menu, with how many products each has. */
export async function getShopCategories() {
  const categories = await prisma.shopCategory.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { products: { where: { active: true } } } } },
  })
  return categories.map(({ _count, ...c }) => ({ ...c, productCount: _count.products }))
}

export async function getShopProducts(shopCategoryId?: string) {
  return prisma.product.findMany({
    where: { active: true, ...(shopCategoryId ? { shopCategoryId } : {}) },
    include: { variants: { orderBy: { sortOrder: 'asc' } } },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  })
}

/**
 * Current details for the items in a cart. Prices and stock always come from
 * the database, never from the browser.
 */
export async function describeCart(items: { variantId: string; quantity: number }[]) {
  const ids = Array.from(new Set(items.map((i) => i.variantId))).slice(0, 50)
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: ids } },
    include: { product: true },
  })
  return items.flatMap((item) => {
    const variant = variants.find((v) => v.id === item.variantId)
    if (!variant) return []
    const product = variant.product
    const seasonal = product.category === 'PRODUCE' && !product.availableThisWeek
    const available = product.active && variant.active && !seasonal ? Math.max(0, variant.stock) : 0
    const quantity = Math.max(1, Math.min(MAX_PER_ITEM, Math.floor(item.quantity) || 1))
    return [{
      variantId: variant.id,
      productName: product.name,
      productSlug: product.slug,
      category: product.category,
      variantLabel: variant.label,
      image: productImages(product)[0] || null,
      unitPriceKes: variant.priceKes,
      quantity,
      available,
      problem: available === 0
        ? (seasonal ? 'Not available this week' : 'Sold out')
        : quantity > available ? `Only ${available} left` : null,
    }]
  })
}
