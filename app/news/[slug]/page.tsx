import type { Metadata } from 'next'
import BlogPostClient from './BlogPostClient'
import { getBlogPostBySlug } from '@/lib/contentful'

// Enable dynamic rendering for blog posts
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post: any = await getBlogPostBySlug(params.slug)
  return {
    title: post?.title || 'News & Publications',
    description: post?.excerpt || undefined,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostClient />
}
