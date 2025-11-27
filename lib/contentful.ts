import { createClient, Entry } from 'contentful'

// Function to get Contentful client (lazy initialization)
let _contentfulClient: ReturnType<typeof createClient> | null = null

export function getContentfulClient() {
  if (!_contentfulClient) {
    const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
    const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN

    if (!spaceId || !accessToken) {
      console.warn('Contentful credentials not configured. Please check .env.local')
      throw new Error('Contentful not configured')
    }

    _contentfulClient = createClient({
      space: spaceId,
      accessToken: accessToken,
    })
  }
  return _contentfulClient
}

// Legacy export for compatibility
export const contentfulClient = {
  getEntries: (...args: Parameters<ReturnType<typeof createClient>['getEntries']>) => {
    return getContentfulClient().getEntries(...args)
  }
}

// Optional: Preview client for draft content (useful for previews)
let _previewClient: ReturnType<typeof createClient> | null = null

export function getPreviewClient() {
  if (!_previewClient) {
    const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
    const previewToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN

    if (!spaceId || !previewToken) {
      throw new Error('Contentful preview not configured')
    }

    _previewClient = createClient({
      space: spaceId,
      accessToken: previewToken,
      host: 'preview.contentful.com',
    })
  }
  return _previewClient
}

export const previewClient = {
  getEntries: (...args: Parameters<ReturnType<typeof createClient>['getEntries']>) => {
    return getPreviewClient().getEntries(...args)
  }
}

// Type definitions for our Blog Post content type
export interface BlogPostFields {
  title: string
  slug: string
  excerpt: string
  featuredImage: {
    fields: {
      file: {
        url: string
        details: {
          size: number
          image: {
            width: number
            height: number
          }
        }
      }
      title: string
      description?: string
    }
  }
  content: any // Rich text document
  author: string
  publishDate: string
  category: string[]
  featured?: boolean
  readTime?: number
}

export type BlogPost = Entry<any>

// Helper function to parse blog posts
export function parseBlogPost(entry: BlogPost) {
  const fields = entry.fields as any
  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug,
    excerpt: fields.excerpt,
    featuredImage: {
      url: fields.featuredImage?.fields.file.url.startsWith('//')
        ? `https:${fields.featuredImage?.fields.file.url}`
        : fields.featuredImage?.fields.file.url,
      alt: fields.featuredImage?.fields.title || fields.title,
      width: fields.featuredImage?.fields.file.details.image?.width,
      height: fields.featuredImage?.fields.file.details.image?.height,
    },
    content: fields.content,
    author: fields.author,
    publishDate: fields.publishDate,
    category: fields.category || [],
    featured: fields.featured || false,
    readTime: fields.readTime || 5,
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
  }
}

// Fetch all published blog posts
export async function getAllBlogPosts(limit = 100) {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      order: ['-fields.publishDate'],
      limit,
    })

    return response.items.map(parseBlogPost)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

// Fetch featured blog posts
export async function getFeaturedBlogPosts(limit = 3) {
  try {
    // Try to get featured posts first
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.featured': true,
      order: ['-fields.publishDate'],
      limit,
    })

    return response.items.map(parseBlogPost)
  } catch (error: any) {
    // If "featured" field doesn't exist yet, just return empty array
    // The page will fall back to showing the first post as featured
    if (error?.details?.errors?.[0]?.name === 'unknown') {
      console.warn('Featured field not found in content model. Falling back to getAllBlogPosts.')
      return []
    }
    console.error('Error fetching featured posts:', error)
    return []
  }
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string) {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      limit: 1,
    })

    if (response.items.length === 0) {
      return null
    }

    return parseBlogPost(response.items[0])
  } catch (error) {
    console.error(`Error fetching blog post with slug "${slug}":`, error)
    return null
  }
}

// Fetch blog posts by category
export async function getBlogPostsByCategory(category: string, limit = 100) {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.category[in]': category,
      order: ['-fields.publishDate'],
      limit,
    })

    return response.items.map(parseBlogPost)
  } catch (error) {
    console.error(`Error fetching posts for category "${category}":`, error)
    return []
  }
}

// Get all unique categories
export async function getAllCategories() {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      select: ['fields.category'],
    })

    const categoriesSet = new Set<string>()
    response.items.forEach((item: any) => {
      if (item.fields.category) {
        item.fields.category.forEach((cat: string) => categoriesSet.add(cat))
      }
    })

    return Array.from(categoriesSet).sort()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Search blog posts by title or excerpt
export async function searchBlogPosts(query: string, limit = 20) {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      query,
      order: ['-fields.publishDate'],
      limit,
    })

    return response.items.map(parseBlogPost)
  } catch (error) {
    console.error(`Error searching for "${query}":`, error)
    return []
  }
}

// Get recent blog posts (for sidebar, etc.)
export async function getRecentBlogPosts(limit = 5) {
  try {
    const response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      order: ['-fields.publishDate'],
      limit,
    })

    return response.items.map(parseBlogPost)
  } catch (error) {
    console.error('Error fetching recent posts:', error)
    return []
  }
}
