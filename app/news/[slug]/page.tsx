import BlogPostClient from './BlogPostClient'

// Enable dynamic rendering for blog posts
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostClient />
}
