import BlogPostClient from './BlogPostClient'

// Generate static params - return empty array until blog posts are added to Contentful
export async function generateStaticParams() {
  return []
}

// Mark as dynamic to allow runtime rendering when accessing individual posts
export const dynamic = 'force-static'
export const dynamicParams = false

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostClient />
}
