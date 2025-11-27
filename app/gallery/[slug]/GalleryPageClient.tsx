'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowLeft, FiHome } from 'react-icons/fi'
import Gallery from '@/components/Gallery'
import { getGalleryBySlug, galleryCategories } from '@/lib/galleryData'

export default function GalleryPageClient({ slug }: { slug: string }) {
  const gallery = getGalleryBySlug(slug)

  // Handle invalid gallery slug
  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-accent-50 to-harvest-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-9xl mb-6">📷</div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Gallery Not Found
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            The gallery you're looking for doesn't exist.
          </p>
          <Link href="/our-work">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-primary text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-2 mx-auto"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to Our Work
            </motion.button>
          </Link>
        </div>
      </div>
    )
  }

  const Icon = gallery.icon

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-earth-50 via-primary-50 to-harvest-50 pt-32 pb-20 overflow-hidden">
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
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-accent-500 to-primary-600 rounded-3xl shadow-2xl mb-6 text-white text-4xl">
              <Icon />
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 mb-6">
              {gallery.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              {gallery.description}
            </p>

            {/* Navigation Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
                <FiHome className="w-4 h-4" />
                Home
              </Link>
              <span>/</span>
              <Link href="/our-work" className="hover:text-primary-600 transition-colors">
                Our Work
              </Link>
              <span>/</span>
              <span className="text-primary-600 font-semibold">{gallery.title}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Image count */}
            <div className="text-center mb-12">
              <p className="text-lg text-gray-600">
                {gallery.images.length} {gallery.images.length === 1 ? 'photo' : 'photos'}
              </p>
            </div>

            {/* Gallery Grid */}
            <Gallery images={gallery.images} columns={3} />

            {/* Back to Our Work button */}
            <div className="mt-16 text-center">
              <Link href="/our-work">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-card px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-2 mx-auto text-gray-900"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  Back to Our Work
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other Galleries Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-accent-50 to-sage-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8 text-center">
              Explore More Galleries
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryCategories
                .filter(cat => cat.slug !== slug)
                .map((category, index) => {
                  const CategoryIcon = category.icon
                  return (
                    <Link key={category.slug} href={`/gallery/${category.slug}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="glass-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                      >
                        <div className="text-4xl mb-4 text-primary-600">
                          <CategoryIcon />
                        </div>
                        <h3 className="text-xl font-display font-bold mb-2 text-gray-900">
                          {category.title}
                        </h3>
                        <p className="text-gray-600">
                          {category.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {category.images.length} {category.images.length === 1 ? 'photo' : 'photos'}
                        </p>
                      </motion.div>
                    </Link>
                  )
                })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
