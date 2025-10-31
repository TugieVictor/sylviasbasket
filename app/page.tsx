
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight, FiUsers, FiTrendingUp, FiAward, FiHeart, FiTarget, FiGlobe, FiExternalLink } from 'react-icons/fi'
import { GiFarmer, GiPlantSeed, GiWheat } from 'react-icons/gi'

const HomePage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  }

  const fadeInLeft = {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const fadeInRight = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  // VERIFIED METRICS ONLY
  const impactStats = [
    { icon: <FiUsers />, number: '1,000+', label: 'Farmers Trained', description: 'Across Kenya in organic methods' },
    { icon: <GiPlantSeed />, number: '5+', label: 'Tonnes Monthly', description: 'Organic produce aggregated' },
    { icon: <FiAward />, number: '50+', label: 'Partner Farmers', description: 'In our organic network' },
    { icon: <GiFarmer />, number: '10-15', label: 'Seasonal Crops', description: 'Grown year-round' },
  ]

  const focusAreas = [
    {
      icon: <GiWheat className="w-7 h-7" />,
      title: 'Promoting Agroecology & Organic Farming',
      description: 'Teaching sustainable farming practices that restore soil health and biodiversity'
    },
    {
      icon: <FiUsers className="w-7 h-7" />,
      title: 'Training & Empowering Women and Youth',
      description: 'Building capacity and creating opportunities for the next generation of farmers'
    },
    {
      icon: <FiGlobe className="w-7 h-7" />,
      title: 'Strengthening Farmer Communities',
      description: 'Creating networks and market access for small-scale organic farmers'
    },
    {
      icon: <FiTarget className="w-7 h-7" />,
      title: 'Influencing Policy for Sustainable Food Systems',
      description: 'Advocating for policies that support organic agriculture and food security'
    },
  ]

  // Verified partnerships
  const partnerships = [
    { name: 'CIFOR-ICRAF', description: 'Smallholder agroecology training' },
    { name: 'GIZ-KCOA', description: 'Master trainer certification' },
    { name: 'KOAN', description: 'Kenya Organic Agriculture Network' },
    { name: 'PELUM', description: 'Ecological land use management' },
    { name: 'Access Agriculture', description: 'Community training partner' },
    { name: 'Biovision Africa', description: 'Sustainable agriculture initiatives' },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section - Glassmorphism Style */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-earth-50 via-primary-50 to-harvest-50 pt-24 pb-16 overflow-hidden">
        {/* Decorative Glowing Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-harvest-500/20 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Left Side - Text Content (3/5) */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInLeft}
              className="lg:col-span-3 space-y-6"
            >
              {/* Glass Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full"
              >
                <span className="w-2 h-2 bg-accent-600 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold bg-gradient-to-r from-accent-700 to-sage-700 bg-clip-text text-transparent">IFOAM Ambassador | GIZ-KCOA Master Trainer</span>
              </motion.div>

              {/* Main Heading with Gradient */}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Empowering Communities Through{' '}
                <span className="bg-gradient-to-r from-accent-600 via-sage-600 to-accent-700 bg-clip-text text-transparent">Organic Farming</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Growing more than food — we're growing awareness, opportunity, and a healthier planet. Since 2016, Sylvia's Basket has trained over 1,000 farmers in sustainable agriculture.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-accent-600 to-sage-600 hover:from-accent-700 hover:to-sage-700 text-white px-8 py-4 rounded-full font-semibold shadow-2xl hover:shadow-accent-500/50 transition-all flex items-center gap-2"
                  >
                    Discover Our Story
                    <FiArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/get-involved">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-card hover:bg-white/90 text-gray-900 px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                  >
                    <FiHeart className="w-5 h-5 text-accent-600" />
                    Get Involved
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats Row with Gradients */}
              <motion.div
                className="grid grid-cols-3 gap-6 pt-8 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-accent-600 to-sage-600 bg-clip-text text-transparent">1,000+</div>
                  <div className="text-sm text-gray-700 mt-1 font-medium">Farmers Trained</div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-harvest-600 to-clay-600 bg-clip-text text-transparent">5+</div>
                  <div className="text-sm text-gray-700 mt-1 font-medium">Tonnes Monthly</div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-earth-600 bg-clip-text text-transparent">50+</div>
                  <div className="text-sm text-gray-700 mt-1 font-medium">Partners</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Sylvia's Photo (2/5) */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInRight}
              className="lg:col-span-2 relative"
            >
              {/* Main Image Card with Glassmorphism */}
              <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl ring-2 ring-white/20">
                {/* Sylvia's Photo with gradient overlay */}
                <img
                  src="/images/sylvia-hero.jpg"
                  alt="Sylvia Kuria - Founder of Sylvia's Basket"
                  className="w-full h-full object-cover object-center"
                />
                {/* Gradient overlay - bottom transparent, top slightly visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-gray-900/5 to-gray-900/20"></div>

                {/* Glass Info Card Overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-6 left-6 right-6 glass-card p-6 rounded-2xl shadow-2xl"
                >
                  <h3 className="font-display font-bold text-xl text-gray-900 mb-1">
                    Sylvia Kuria
                  </h3>
                  <p className="text-sm font-semibold mb-3 bg-gradient-to-r from-accent-600 to-sage-600 bg-clip-text text-transparent">
                    Founder & CEO | Organic Farming Advocate
                  </p>
                  <p className="text-sm text-gray-800 italic leading-relaxed">
                    "My vision is to train and support as many farmers as possible so we can leave a lasting legacy for our children."
                  </p>
                </motion.div>

                {/* Certified Glass Badge */}
                <div className="absolute top-6 right-6 glass-card px-4 py-2 rounded-full shadow-xl">
                  <span className="text-sm font-semibold bg-gradient-to-r from-accent-700 to-sage-700 bg-clip-text text-transparent">🌱 Organic Certified</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Stand For - Glassmorphism Cards */}
      <section className="py-20 bg-gradient-to-br from-primary-100 via-earth-50 to-harvest-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-harvest-500/10 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center mb-16 max-w-3xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              What We Stand For
            </h2>
            <p className="text-xl font-bold mb-3 bg-gradient-to-r from-accent-700 via-sage-700 to-accent-800 bg-clip-text text-transparent">
              Healthy Food. Healthy People. Healthy Planet.
            </p>
            <p className="text-gray-700 text-lg">
              We advocate for farming systems that respect nature, empower farmers, and ensure that nutritious food is accessible to everyone.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {focusAreas.map((area, index) => {
              const iconGradients = [
                'from-accent-500 to-sage-600',
                'from-harvest-500 to-clay-600',
                'from-sky-500 to-accent-600',
                'from-sage-600 to-accent-700'
              ]
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="glass-card rounded-2xl p-8 shadow-2xl hover:shadow-accent-500/20 transition-all"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${iconGradients[index]} rounded-2xl flex items-center justify-center mb-6 shadow-xl text-white`}>
                    {area.icon}
                  </div>
                  <h3 className="text-lg font-display font-bold text-gray-900 mb-3">
                    {area.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {area.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Impact Stats - Glassmorphism */}
      <section className="py-20 bg-gradient-to-br from-accent-50 via-white to-sage-50">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
              Our Impact
            </h2>
            <p className="text-gray-700 text-lg">
              Making a real difference in communities across Kenya
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {impactStats.map((stat, index) => {
              const gradients = [
                'from-accent-500 to-sage-600',
                'from-sage-500 to-accent-600',
                'from-harvest-500 to-clay-600',
                'from-primary-600 to-earth-600'
              ]
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -12, scale: 1.08 }}
                  className="text-center glass-card rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${gradients[index]} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 text-4xl shadow-2xl`}>
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-display font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-600">
                    {stat.description}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Partnerships - Glassmorphism */}
      <section className="py-20 bg-gradient-to-br from-harvest-50 via-earth-50 to-primary-100">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12 max-w-2xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
              Our Partners
            </h2>
            <p className="text-gray-700 text-lg">
              Collaborating with leading organizations to amplify our impact
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {partnerships.map((partner, index) => {
              const gradients = [
                'from-accent-500 to-sage-600',
                'from-sage-500 to-accent-600',
                'from-harvest-500 to-clay-600',
                'from-sky-500 to-accent-600',
                'from-clay-500 to-harvest-600',
                'from-primary-600 to-earth-600'
              ]
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="glass-card p-6 rounded-2xl hover:shadow-2xl transition-all group"
                >
                  <div className={`w-full h-1 bg-gradient-to-r ${gradients[index]} rounded-full mb-4`}></div>
                  <h3 className="font-display font-bold text-gray-900 mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {partner.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/our-work">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="text-accent-600 hover:text-accent-700 font-semibold flex items-center gap-2 mx-auto"
              >
                See Our Work in Detail
                <FiArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
                See Our Work in Action
              </h2>
              <p className="text-gray-600">
                Watch Sylvia's journey and impact on communities
              </p>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-100">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/ZiAI75YcWig"
                title="Sylvia's Basket - Organic Farming in Kenya"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Additional Video Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <a
                href="https://www.youtube.com/watch?v=mfiKOtcDYn4"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiExternalLink className="w-5 h-5 text-accent-600" />
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-semibold text-gray-900">Training Program Video</div>
                  <div className="text-gray-500">Watch on YouTube</div>
                </div>
              </a>
              <a
                href="https://www.youtube.com/watch?v=IjTaNJFOr9I"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiExternalLink className="w-5 h-5 text-accent-600" />
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-semibold text-gray-900">Farmer Success Stories</div>
                  <div className="text-gray-500">Watch on YouTube</div>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Clean */}
      <section className="py-20 bg-accent-50">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Be Part of the Change
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Join us in making organic and agro-ecological farming the norm, not the exception.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-involved">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-accent-600 hover:bg-accent-700 text-white px-8 py-4 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                  <FiHeart className="w-5 h-5" />
                  Donate to Support Our Mission
                </motion.button>
              </Link>
              <Link href="/farmers-stories">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all"
                >
                  Read Farmers' Stories
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* References Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">References & Learn More</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a href="https://www.organicwithoutboundaries.bio/2021/04/01/crazy-for-organic/" target="_blank" rel="noopener noreferrer" className="text-sm text-accent-600 hover:text-accent-700 hover:underline flex items-center gap-2">
                <FiExternalLink className="w-3 h-3" />
                Organic Without Boundaries Interview
              </a>
              <a href="https://www.accessagriculture.org/blogs/young-kenyan-mother-turns-successful-organic-entrepreneur-promote-safe-and-healthy-food" target="_blank" rel="noopener noreferrer" className="text-sm text-accent-600 hover:text-accent-700 hover:underline flex items-center gap-2">
                <FiExternalLink className="w-3 h-3" />
                Access Agriculture Feature
              </a>
              <a href="https://www.the-star.co.ke/news/2021-11-22-how-limuru-farmer-is-changing-lives-through-organic-food" target="_blank" rel="noopener noreferrer" className="text-sm text-accent-600 hover:text-accent-700 hover:underline flex items-center gap-2">
                <FiExternalLink className="w-3 h-3" />
                The Star Kenya Article
              </a>
              <a href="https://www.instagram.com/sylvias_basket/" target="_blank" rel="noopener noreferrer" className="text-sm text-accent-600 hover:text-accent-700 hover:underline flex items-center gap-2">
                <FiExternalLink className="w-3 h-3" />
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
