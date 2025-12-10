'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiUser, FiClock, FiArrowLeft, FiShare2 } from 'react-icons/fi'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getBlogPostBySlug, getRecentBlogPosts } from '@/lib/contentful'
import { renderRichText } from '@/lib/richTextRenderer'


interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: {
    url: string
    alt: string
    width?: number
    height?: number
  }
  content: any
  author: string
  publishDate: string
  category: string[]
  featured: boolean
  readTime: number
}

const BlogPostPage = () => {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true)
        const blogPost = await getBlogPostBySlug(slug)

        if (!blogPost) {
          setError(true)
          return
        }

        setPost(blogPost as BlogPost)

        // Load recent posts for sidebar
        const recent = await getRecentBlogPosts(4)
        setRecentPosts(recent as BlogPost[])
      } catch (err) {
        console.error('Error loading blog post:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadPost()
    }
  }, [slug])

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = post?.title || "Sylvia's Basket Blog"

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch (err) {
        console.log('Share canceled')
      }
    } else {
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 via-sage-50 to-sky-50 pt-32 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-50 via-sage-50 to-sky-50 pt-32 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-12 rounded-3xl"
            >
              <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
                Post Not Found
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Sorry, we couldn't find the blog post you're looking for.
              </p>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-600 to-sage-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-shadow"
              >
                <FiArrowLeft className="w-5 h-5" />
                Back to Blog
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-sage-50 to-sky-50">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-harvest-500/10 rounded-full blur-3xl"></div>

      {/* Back button */}
      <div className="pt-28 pb-8">
        <div className="container-custom">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-accent-700 hover:text-accent-800 font-semibold transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to all posts
          </Link>
        </div>
      </div>

      <div className="container-custom pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <motion.article
            className="lg:col-span-2"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            {/* Post header */}
            <div className="mb-8">
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.category.map((cat) => (
                  <span
                    key={cat}
                    className="inline-block px-4 py-1 bg-gradient-to-r from-accent-500 to-sage-600 text-white text-sm font-semibold rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <FiUser className="w-5 h-5" />
                  <span className="font-semibold">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-5 h-5" />
                  <span>{formatDate(post.publishDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="w-5 h-5" />
                  <span>{post.readTime} min read</span>
                </div>
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full hover:shadow-lg transition-shadow"
              >
                <FiShare2 className="w-4 h-4" />
                <span className="font-semibold">Share</span>
              </button>
            </div>

            {/* Featured image */}
            <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-10">
              <img
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="glass-card p-8 md:p-12 rounded-3xl shadow-2xl prose prose-lg max-w-none">
              <div className="blog-content">
                {renderRichText(post.content)}
              </div>
            </div>

            {/* Author bio */}
            <div className="mt-12 glass-card p-8 rounded-3xl">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-sage-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">
                    {post.author}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Sylvia Kuria is the founder of Sylvia's Basket and a passionate advocate for organic farming and agroecology in Kenya.
                    She is a GIZ-KCOA Master Trainer and IFOAM Ambassador, working to empower smallholder farmers across the country.
                  </p>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Sidebar */}
          <motion.aside
            className="lg:col-span-1 sticky top-32 self-start"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Recent posts */}
            {recentPosts.length > 0 && (
              <div className="glass-card p-6 rounded-3xl mb-8">
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">
                  Recent Posts
                </h3>
                <div className="space-y-6">
                  {recentPosts
                    .filter((p) => p.slug !== post.slug)
                    .slice(0, 3)
                    .map((recentPost) => (
                      <Link
                        key={recentPost.id}
                        href={`/news/${recentPost.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-4">
                          <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                            <img
                              src={recentPost.featuredImage.url}
                              alt={recentPost.featuredImage.alt}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-accent-600 transition-colors line-clamp-2 mb-1">
                              {recentPost.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(recentPost.publishDate)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-accent-500/10 to-sage-500/10">
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-700 mb-6">
                Subscribe to our newsletter for the latest articles, tips, and updates on organic farming.
              </p>
              <Link
                href="/news#newsletter-section"
                className="block w-full bg-gradient-to-r from-accent-600 to-sage-600 text-white text-center px-6 py-3 rounded-full font-semibold hover:shadow-xl transition-shadow"
              >
                Subscribe Now
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  )
}

export default BlogPostPage
