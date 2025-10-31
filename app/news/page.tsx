'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiCalendar, FiUser, FiArrowRight, FiMail, FiBookOpen } from 'react-icons/fi'
import { GiWheat, GiPlantSeed, GiTomato } from 'react-icons/gi'

const NewsPage = () => {
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

  // Handler for Read More buttons
  const handleReadMore = () => {
    // Scroll to newsletter section
    const newsletterSection = document.getElementById('newsletter-section')
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ behavior: 'smooth' })
      // Show a message encouraging subscription
      setTimeout(() => {
        alert('Full articles are coming soon! Subscribe to our newsletter "When Silence Isn\'t an Option" to be the first to read our latest stories and updates.')
      }, 500)
    }
  }

  const featuredArticle = {
    title: 'Agroecology is the Only Option for Our Food Systems',
    excerpt: 'As Kenya faces increasing climate challenges, we explore why transitioning to agroecological farming practices is not just beneficial, but essential for our food security and environmental sustainability.',
    author: 'Sylvia Kuria',
    date: 'October 20, 2025',
    category: 'Advocacy',
    readTime: '8 min read'
  }

  const articles = [
    {
      title: 'Training 50 Women Farmers in Kiambu County',
      excerpt: 'A recap of our recent intensive training program that equipped women farmers with organic farming techniques and business skills.',
      author: 'Sylvia Kuria',
      date: 'October 15, 2025',
      category: 'Training',
      icon: <FiUser className="w-5 h-5" />
    },
    {
      title: 'Crop of the Month: Indigenous Leafy Vegetables',
      excerpt: 'Discover the nutritional powerhouse of traditional African leafy vegetables and how to grow them organically.',
      author: 'Sylvia Kuria',
      date: 'October 1, 2025',
      category: 'Farming Tips',
      icon: <GiWheat className="w-5 h-5" />
    },
    {
      title: 'Policy Win: Kiambu County Adopts Agroecology Framework',
      excerpt: 'Our advocacy efforts contribute to groundbreaking policy changes supporting sustainable agriculture in Kiambu County.',
      author: 'Sylvia Kuria',
      date: 'September 28, 2025',
      category: 'Policy',
      icon: <FiBookOpen className="w-5 h-5" />
    },
    {
      title: 'From Seed to Market: Success Story of Our Aggregation Hub',
      excerpt: 'How our farmers collective is connecting small-scale organic producers with premium markets in Nairobi.',
      author: 'Sylvia Kuria',
      date: 'September 20, 2025',
      category: 'Impact',
      icon: <GiTomato className="w-5 h-5" />
    },
    {
      title: 'Composting Workshop Transforms Farm Productivity',
      excerpt: 'Farmers learn to turn waste into black gold, reducing costs and improving soil health.',
      author: 'Sylvia Kuria',
      date: 'September 10, 2025',
      category: 'Training',
      icon: <GiPlantSeed className="w-5 h-5" />
    },
    {
      title: 'Youth in Agriculture: Breaking Stereotypes',
      excerpt: 'Meet the young farmers proving that agriculture can be modern, profitable, and cool.',
      author: 'Sylvia Kuria',
      date: 'September 1, 2025',
      category: 'Youth',
      icon: <FiUser className="w-5 h-5" />
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Glassmorphism */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-earth-50 via-primary-50 to-harvest-50 pt-32 pb-20 overflow-hidden">
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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 mb-6">
              News & <span className="bg-gradient-to-r from-accent-600 via-sage-600 to-accent-700 bg-clip-text text-transparent">Insights</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700">
              Stories, updates, and advocacy from the frontlines of organic farming in Kenya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Highlight - Glassmorphism */}
      <section className="section-padding bg-gradient-to-br from-primary-600 via-earth-600 to-harvest-600 text-white relative overflow-hidden">
        {/* Decorative Glowing Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sage-500/20 rounded-full blur-3xl"></div>
        <div className="container-custom">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <FiMail className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              When Silence Isn't an Option
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Our monthly newsletter featuring advocacy updates, farming tips, and stories from the field
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-700 px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-shadow whitespace-nowrap"
                >
                  Subscribe Now
                </motion.button>
              </div>
              <p className="text-sm mt-4 opacity-75">
                Join 1,000+ subscribers staying informed about sustainable agriculture
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
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
              <div className="p-10 md:p-12">
                <div className="flex flex-wrap gap-4 mb-6">
                  <span className="px-4 py-1 bg-primary-600 text-white rounded-full text-sm font-semibold">
                    {featuredArticle.category}
                  </span>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCalendar className="w-4 h-4" />
                    <span className="text-sm">{featuredArticle.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiUser className="w-4 h-4" />
                    <span className="text-sm">{featuredArticle.author}</span>
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
                  {featuredArticle.title}
                </h2>

                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  {featuredArticle.excerpt}
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReadMore}
                  className="gradient-primary text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
                >
                  Read Full Article
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

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
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Recent Articles
            </h2>
            <p className="text-xl text-gray-700">
              Stay updated with the latest from Sylvia's Basket
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {articles.map((article, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -12, scale: 1.02 }}
                className="glass-card rounded-2xl overflow-hidden shadow-2xl hover:shadow-accent-500/20 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                      {article.category}
                    </span>
                    <div className="text-primary-600">
                      {article.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-bold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-3.5 h-3.5" />
                      <span>{article.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleReadMore}
                    className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-2 group"
                  >
                    Read More
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                Never Miss an Update
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Subscribe to "When Silence Isn't an Option" and get monthly insights on:
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
              <div className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-full border-2 border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="gradient-primary text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap"
                  >
                    Join Now
                  </motion.button>
                </div>
              </div>
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
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Want to Contribute?
            </h2>
            <p className="text-xl text-gray-700 mb-10">
              Have a story to share or want to collaborate on advocacy content? We'd love to hear from you.
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
