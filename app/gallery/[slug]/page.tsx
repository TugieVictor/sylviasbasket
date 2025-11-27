import { getAllGallerySlugs } from '@/lib/galleryData'
import GalleryPageClient from './GalleryPageClient'

// Generate static params for all gallery pages
export function generateStaticParams() {
  return getAllGallerySlugs().map((slug) => ({
    slug: slug,
  }))
}

export default function GalleryPage({ params }: { params: { slug: string } }) {
  return <GalleryPageClient slug={params.slug} />
}
