import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductGallery from '@/components/shop/ProductGallery'
import ShopClosed from '@/components/shop/ShopClosed'
import ShopHeader from '@/components/shop/ShopHeader'
import { CATEGORY_LABELS, MAX_PER_ITEM, productAvailability, productImages, shopEnabled } from '@/lib/shop'
import AddToCart from './AddToCart'
import { releaseExpiredOrders } from '@/lib/orders'

export const dynamic = 'force-dynamic'

const getProduct = (slug: string) =>
  prisma.product.findFirst({
    where: { slug, active: true },
    include: { variants: { orderBy: { sortOrder: 'asc' } }, shopCategory: true },
  })

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  if (!shopEnabled()) return { title: 'Shop' }
  const product = await getProduct(params.slug)
  return product ? { title: product.name, description: product.summary || undefined } : { title: 'Shop' }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  if (!shopEnabled()) return <ShopClosed />
  await releaseExpiredOrders()
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const info = productAvailability(product)
  const images = productImages(product)
  const seasonal = product.category === 'PRODUCE' && !product.availableThisWeek

  return (
    <>
      <ShopHeader
        kicker={product.shopCategory?.name || CATEGORY_LABELS[product.category]}
        title={product.name}
        back={
          product.shopCategory
            ? { label: `Back to ${product.shopCategory.name}`, href: `/shop/?category=${product.shopCategory.slug}#products` }
            : { label: 'Back to the shop', href: '/shop/' }
        }
      />

      <section className="section-padding bg-gradient-to-br from-earth-50 via-white to-harvest-50">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          <ProductGallery images={images} category={product.category} />

          <div>
            {product.summary && <p className="text-body-lg text-gray-700">{product.summary}</p>}

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mt-6">
              {info.canBuy ? (
                <AddToCart
                  variants={info.variants.map((v) => ({
                    id: v.id,
                    label: v.label,
                    priceKes: v.priceKes,
                    stock: Math.min(Math.max(0, v.stock), MAX_PER_ITEM),
                  }))}
                />
              ) : (
                <div>
                  <p className="text-xl font-display font-bold text-gray-900">{info.status}</p>
                  <p className="text-gray-600 mt-2">
                    {seasonal ? 'This is seasonal produce. Please check back next week.' : 'Please check back soon, or contact us to ask when it will be back.'}
                  </p>
                </div>
              )}
            </div>

            {product.description && (
              <div className="mt-8">
                <h2 className="text-xl font-display font-bold text-gray-900">About this product</h2>
                <div className="text-gray-700 mt-3 whitespace-pre-line leading-relaxed">{product.description}</div>
              </div>
            )}

            <p className="text-sm text-gray-600 mt-8">
              Prices are final prices in KES. Delivery in Nairobi and across Kenya, with fees shown at checkout.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
