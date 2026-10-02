import type { Metadata } from 'next'
import { getAllGallerySlugs, getGalleryBySlug } from '@/lib/galleryData'
import GalleryPageClient from './GalleryPageClient'

// Generate static params for all gallery pages
export function generateStaticParams() {
  return getAllGallerySlugs().map((slug) => ({
    slug: slug,
  }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const gallery = getGalleryBySlug(params.slug)
  return { title: gallery ? `${gallery.title} Gallery` : 'Gallery' }
}

export default function GalleryPage({ params }: { params: { slug: string } }) {
  return <GalleryPageClient slug={params.slug} />
}
