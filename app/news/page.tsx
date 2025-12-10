'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiCalendar, FiUser, FiArrowRight, FiMail, FiClock } from 'react-icons/fi'
import { getAllBlogPosts, getFeaturedBlogPosts } from '@/lib/contentful'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: {
    url: string
    alt: string
  }
  author: string
  publishDate: string
  category: string[]
  featured: boolean
  readTime: number
}

const NewsPage = () => {
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [subscribeMessage, setSubscribeMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Pagination settings
  const postsPerPage = 3
  const totalPages = Math.ceil(recentPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = recentPosts.slice(startIndex, endIndex)

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true)
        const featured = await getFeaturedBlogPosts(1)
        const all = await getAllBlogPosts(20)

        if (featured.length > 0) {
          setFeaturedPost(featured[0] as BlogPost)
          // Filter out featured post from recent posts (get all, not just 6)
          setRecentPosts(all.filter((p: any) => p.id !== featured[0].id) as BlogPost[])
        } else {
          // If no featured post, use first post as featured
          if (all.length > 0) {
            setFeaturedPost(all[0] as BlogPost)
            setRecentPosts(all.slice(1) as BlogPost[])
          }
        }
        // Reset to page 1 when posts are loaded
        setCurrentPage(1)
      } catch (error) {
        console.error('Error loading posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setSubscribeMessage('Please enter a valid email address')
      return
    }

    setSubscribing(true)
    setSubscribeMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscribeMessage('Successfully subscribed! Check your email for confirmation.')
        setEmail('')
      } else {
        setSubscribeMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setSubscribeMessage('An error occurred. Please try again later.')
    } finally {
      setSubscribing(false)
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

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.12
      }
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Glassmorphism */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20 overflow-hidden mt-20">
        {/* Background Image */}
        <div className="absolute inset-0 top-0">
          <img
            src="/images/Africa_map.jpg"
            alt="Map of Africa - stories from across the continent"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-accent-900/70 via-sage-900/65 to-accent-900/70"></div>
        </div>
        {/* Decorative Glowing Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-harvest-500/20 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <span className="text-overline text-white">Latest Updates</span>
            <h1 className="text-display text-white mt-3 mb-6">
              News & <span className="text-harvest-300">Insights</span>
            </h1>
            <p className="text-subtitle text-white">
              Stories, updates, and advocacy from the <span className="font-bold">frontlines of organic farming</span> in Kenya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Highlight - Glassmorphism */}
      <section className="section-padding bg-gradient-to-br from-harvest-600 via-clay-600 to-accent-700 text-white relative overflow-hidden">
        {/* Sylvia's Image Background */}
        <div className="absolute inset-0 opacity-15">
          <img
            src="/images/sylvia-hero_4.jpg"
            alt="Sylvia Kuria advocating for farmers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-harvest-900/90 to-accent-900/90"></div>
        </div>
        {/* Decorative Glowing Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sage-500/20 rounded-full blur-3xl"></div>
        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <FiMail className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <span className="text-overline text-white">Monthly Newsletter</span>
            <h2 className="text-hero text-white mt-3 mb-6">
              When Silence Isn't an Option
            </h2>
            <p className="text-subtitle text-white mb-8">
              Our monthly newsletter featuring <span className="font-bold">advocacy updates</span>, <span className="font-bold">farming tips</span>, and <span className="font-bold">stories from the field</span>
            </p>
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  disabled={subscribing}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={subscribing}
                  className="bg-white text-harvest-700 px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-shadow whitespace-nowrap disabled:opacity-50"
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe Now'}
                </motion.button>
              </div>
              {subscribeMessage && (
                <p className={`text-sm mt-4 ${subscribeMessage.includes('Successfully') ? 'text-green-200' : 'text-red-200'}`}>
                  {subscribeMessage}
                </p>
              )}
              <p className="text-sm mt-4 opacity-75">
                Join our community staying informed about sustainable agriculture
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      {loading ? (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-5xl mx-auto animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="glass-card p-12 rounded-3xl">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </section>
      ) : featuredPost ? (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <motion.div
              className="max-w-5xl mx-auto"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="mb-8">
                <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
                  Featured Article
                </span>
              </div>
              <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                className="glass-card rounded-3xl overflow-hidden shadow-2xl hover:shadow-accent-500/20 transition-all"
              >
                {/* Featured Image */}
                <div className="relative w-full h-[400px] overflow-hidden">
                  <img
                    src={featuredPost.featuredImage.url}
                    alt={featuredPost.featuredImage.alt}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-10 md:p-12">
                  <div className="flex flex-wrap gap-4 mb-6">
                    {featuredPost.category.map((cat) => (
                      <span key={cat} className="px-4 py-1 bg-primary-600 text-white rounded-full text-sm font-semibold">
                        {cat}
                      </span>
                    ))}
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiCalendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(featuredPost.publishDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiUser className="w-4 h-4" />
                      <span className="text-sm">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiClock className="w-4 h-4" />
                      <span className="text-sm">{featuredPost.readTime} min read</span>
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    {featuredPost.excerpt}
                  </p>

                  <Link href={`/news/${featuredPost.slug}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="gradient-primary text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
                    >
                      Read Full Article
                      <FiArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      ) : null}

      {/* Recent Articles - Glassmorphism */}
      <section className="section-padding bg-gradient-to-br from-accent-50 via-sage-50 to-sky-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-harvest-500/10 rounded-full blur-3xl"></div>
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-kicker text-harvest-600">From the Blog</span>
            <h2 className="text-hero text-gray-900 mt-3 mb-6">
              Recent Articles
            </h2>
            <p className="text-subtitle text-gray-600">
              Stay updated with the <span className="text-gradient-accent font-bold">latest from Sylvia's Basket</span>
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recentPosts.length > 0 ? (
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                key={currentPage}
              >
                {currentPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={fadeInUp}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="glass-card rounded-2xl overflow-hidden shadow-2xl hover:shadow-accent-500/20 transition-all"
                >
                  {/* Post Image */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                        {post.category[0]}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-3.5 h-3.5" />
                        <span>{formatDate(post.publishDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock className="w-3.5 h-3.5" />
                        <span>{post.readTime} min</span>
                      </div>
                    </div>

                    <Link href={`/news/${post.slug}`}>
                      <button className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-2 group">
                        Read More
                        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div
                className="flex items-center justify-center gap-4 mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="glass-card px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FiArrowRight className="w-5 h-5 rotate-180" />
                  Previous
                </button>

                {/* Page indicators */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-accent-600 to-sage-600 text-white shadow-lg'
                          : 'glass-card hover:shadow-lg'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="glass-card px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup Bottom */}
      <section id="newsletter-section" className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto bg-gradient-to-br from-primary-50 to-harvest-50 rounded-2xl p-10 md:p-12 border border-primary-200 shadow-xl"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center">
              <span className="text-kicker text-harvest-600">Stay Connected</span>
              <h2 className="text-hero text-gray-900 mt-3 mb-6">
                Never Miss an Update
              </h2>
              <p className="text-body-lg text-gray-700 mb-8">
                Subscribe to <span className="text-gradient-warm font-bold">"When Silence Isn't an Option"</span> and get monthly insights on:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">What's New</p>
                    <p className="text-sm text-gray-600">Latest updates from our work</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Crop of the Month</p>
                    <p className="text-sm text-gray-600">Seasonal farming tips</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Advocacy Focus</p>
                    <p className="text-sm text-gray-600">Policy updates and actions</p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-full border-2 border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={subscribing}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={subscribing}
                    className="gradient-primary text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap disabled:opacity-50"
                  >
                    {subscribing ? 'Joining...' : 'Join Now'}
                  </motion.button>
                </div>
                {subscribeMessage && (
                  <p className={`text-sm mt-4 ${subscribeMessage.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {subscribeMessage}
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-earth">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-kicker text-harvest-600">Join the Conversation</span>
            <h2 className="text-hero text-gray-900 mt-3 mb-6">
              Want to Contribute?
            </h2>
            <p className="text-subtitle text-gray-700 mb-10">
              Have a <span className="text-gradient-accent font-bold">story to share</span> or want to collaborate on <span className="text-gradient-warm font-bold">advocacy content</span>? We'd love to hear from you.
            </p>
            <Link href="/get-involved">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="gradient-primary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-2 mx-auto"
              >
                Get in Touch
                <FiArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default NewsPage
