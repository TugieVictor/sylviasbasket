
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight, FiUsers, FiTrendingUp, FiAward, FiHeart, FiTarget, FiGlobe, FiExternalLink, FiPlay } from 'react-icons/fi'
import { GiFarmer, GiPlantSeed, GiWheat } from 'react-icons/gi'

const HomePage = () => {
  const [showVideo, setShowVideo] = useState(false)
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
    { icon: <GiFarmer />, number: '10-15', label: 'Seasonal Crops', description: 'Grown year-round' },
    { icon: <GiPlantSeed />, number: '5+', label: 'Tonnes Monthly', description: 'Organic produce aggregated' },
    { icon: <FiAward />, number: '50+', label: 'Partner Farmers', description: 'In our organic network' },
    { icon: <GiWheat />, number: '2,000+', label: 'Trees Planted', description: 'Agroforestry for sustainability' },
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
    { name: 'IFOAM', description: 'Training & Advocacy ambassador' },
    { name: 'KOAN', description: 'Market for smallholder farmers' },
    { name: 'HBS', description: 'Advocacy mainstreaming Agro-ecology' },
    { name: 'Biovision', description: 'Creating enabling environment for Agro-ecological entrepreneurs' },
    { name: 'CIFOR-ICRAF', description: 'Agroforestry' },
    { name: 'Greenspoon', description: 'Organic produce marketing' },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section - Glassmorphism Style */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-earth-50 via-primary-50 to-harvest-50 pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
        {/* Decorative Glowing Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-harvest-500/20 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInLeft}
              className="space-y-8 md:space-y-10"
            >
              {/* Main Heading with Dynamic Sizing */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4 md:space-y-6"
              >
                <h1 className="text-display leading-none">
                  Empowering
                  <br />
                  <span className="text-gradient-accent">Communities</span>
                </h1>
                <p className="text-subtitle max-w-2xl">
                  Through Organic Farming & Sustainable Agriculture
                </p>
              </motion.div>

              {/* Description with Varied Sizing */}
              <motion.div
                className="space-y-5 md:space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-body-lg max-w-2xl">
                  Growing more than food — we're growing{' '}
                  <span className="font-semibold text-accent-700">awareness</span>,{' '}
                  <span className="font-semibold text-accent-700">opportunity</span>, and a{' '}
                  <span className="font-semibold text-accent-700">healthier planet</span>.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="text-pill">🌱 1,000+ Farmers Trained</span>
                  <span className="text-pill">📍 Kenya & Africa</span>
                  <span className="text-pill">🏆 Since 2016</span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-accent-600 to-sage-600 hover:from-accent-700 hover:to-sage-700 text-white px-8 py-4 md:py-5 rounded-full font-semibold text-base md:text-lg shadow-2xl hover:shadow-accent-500/50 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    Discover Our Story
                    <FiArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/get-involved">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-card hover:bg-white/90 text-gray-900 px-8 py-4 md:py-5 rounded-full font-semibold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <FiHeart className="w-5 h-5 text-accent-600" />
                    Get Involved
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats Row with Gradients */}
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 pt-8 border-t border-gray-200/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-600 to-sage-600 bg-clip-text text-transparent">1,000+</div>
                  <div className="text-sm md:text-base text-gray-700 mt-2 font-medium">Farmers Trained</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-harvest-600 to-clay-600 bg-clip-text text-transparent">5+</div>
                  <div className="text-sm md:text-base text-gray-700 mt-2 font-medium">Tonnes Monthly</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-earth-600 bg-clip-text text-transparent">50+</div>
                  <div className="text-sm md:text-base text-gray-700 mt-2 font-medium">Partners</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sage-600 to-accent-600 bg-clip-text text-transparent">2,000+</div>
                  <div className="text-sm md:text-base text-gray-700 mt-2 font-medium">Trees Planted</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Sylvia's Photo */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInRight}
              className="relative order-first lg:order-last"
            >
              {/* Main Image Card with Glassmorphism */}
              <div className="relative h-[550px] md:h-[650px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl ring-2 ring-white/20">
                {/* Sylvia's Photo with gradient overlay */}
                <img
                  src="/images/sylvia-hero_3.jpg"
                  alt="Sylvia Kuria - Founder of Sylvia's Basket"
                  className="w-full h-full object-cover object-top"
                />
                {/* Gradient overlay - very subtle, only at bottom to help text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent"></div>

                {/* Glass Info Card Overlay - Minimal */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 glass-card p-4 rounded-xl shadow-2xl"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-display font-bold text-base md:text-lg text-gray-900">
                        Sylvia Kuria
                      </h3>
                      <p className="text-xs font-semibold bg-gradient-to-r from-accent-600 to-sage-600 bg-clip-text text-transparent">
                        Founder & CEO
                      </p>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-800 italic leading-snug">
                    "My vision is to train and support as many farmers as possible so we can leave a lasting legacy for our children."
                  </p>
                </motion.div>

                {/* Certified Glass Badge */}
                <div className="absolute top-6 md:top-8 right-6 md:right-8 glass-card px-4 py-2 rounded-full shadow-xl">
                  <span className="text-xs md:text-sm font-semibold bg-gradient-to-r from-accent-700 to-sage-700 bg-clip-text text-transparent">🌱 Organic Certified</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Stand For - Glassmorphism Cards */}
      <section className="py-20 bg-gradient-to-br from-harvest-100 via-clay-50 to-sage-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-harvest-500/10 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center mb-16 max-w-4xl mx-auto space-y-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div>
              <span className="text-kicker">Our Mission</span>
              <h2 className="text-hero mt-3 mb-6">
                What We Stand For
              </h2>
            </div>

            <div className="inline-flex flex-wrap justify-center gap-4 mb-6">
              <span className="text-badge">🌿 Healthy Food</span>
              <span className="text-badge">💚 Healthy People</span>
              <span className="text-badge">🌍 Healthy Planet</span>
            </div>

            <p className="text-body-lg max-w-3xl mx-auto">
              We advocate for farming systems that{' '}
              <span className="text-gradient-accent font-bold">respect nature</span>,{' '}
              <span className="text-gradient-accent font-bold">empower farmers</span>, and ensure that{' '}
              <span className="text-gradient-accent font-bold">nutritious food</span> is accessible to everyone.
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {impactStats.map((stat, index) => {
              const gradients = [
                'from-harvest-600 to-clay-600',
                'from-clay-600 to-sage-700',
                'from-harvest-600 via-clay-600 to-sage-700',
                'from-sage-700 to-harvest-600',
                'from-clay-600 to-harvest-600'
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
      <section className="py-20 bg-gradient-to-br from-harvest-100 via-clay-50 to-sage-100 relative overflow-hidden">
        {/* Decorative farming image */}
        <div className="absolute left-0 top-0 w-1/4 h-full opacity-10 hidden lg:block">
          <img
            src="/images/green_maize.jpg"
            alt="Green maize plantation"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-custom relative z-10">
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
                'from-harvest-600 to-clay-600',
                'from-clay-600 to-sage-700',
                'from-harvest-600 via-clay-600 to-sage-700',
                'from-sage-700 to-harvest-600',
                'from-clay-600 to-harvest-600',
                'from-harvest-600 to-sage-700'
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
            className="max-w-7xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center mb-12 space-y-4">
              <span className="text-overline">Featured Stories</span>
              <h2 className="text-hero">
                See Our Work in{' '}
                <span className="text-gradient-primary">Action</span>
              </h2>
              <p className="text-subtitle max-w-3xl mx-auto">
                Watch Sylvia's journey and impact on communities across Kenya and Africa
              </p>
            </div>

            {/* Main Featured Video */}
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-100 mb-8 relative group">
              {!showVideo && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 cursor-pointer overflow-hidden"
                  onClick={() => setShowVideo(true)}
                >
                  {/* Background with Gradient Mesh Effect */}
                  <div className="absolute inset-0">
                    {/* Sylvia's Image Background */}
                    <div className="absolute inset-0">
                      <img
                        src="/images/sylvia-hero_1.jpg"
                        alt="Sylvia Kuria"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    {/* Gradient Overlay on Image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-600/60 via-sage-600/65 to-accent-700/70"></div>
                    {/* Decorative Gradient Orbs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>

                  {/* Content Layout - Asymmetric Design */}
                  <div className="absolute inset-0 flex items-center justify-between p-8 md:p-12 lg:p-16">
                    {/* Left Side - Text Content */}
                    <div className="flex-1 text-white max-w-3xl">
                      {/* Brand Badge */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/20"
                      >
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <p className="text-xs md:text-sm font-bold tracking-wide uppercase">IFOAM - Organics International</p>
                      </motion.div>

                      {/* Main Title */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                      >
                        <h3 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4">
                          Nourishing the World{' '}
                          <span className="inline-block">🌍</span>
                        </h3>
                        <h4 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-6 text-white/90">
                          Organically{' '}
                          <span className="inline-block">🥗</span>
                        </h4>
                      </motion.div>

                      {/* Subtitle */}
                      <motion.p
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                        className="text-lg md:text-xl lg:text-2xl font-sans mb-8 text-white/90 max-w-xl"
                      >
                        The Story of Sylvia Kuria
                      </motion.p>

                      {/* Watch CTA */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <FiPlay className="w-6 h-6 md:w-7 md:h-7 text-accent-600 ml-0.5" />
                        </div>
                        <div>
                          <p className="text-sm md:text-base font-bold uppercase tracking-wider">Watch Now</p>
                          <p className="text-xs md:text-sm opacity-80">Featured Documentary</p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Right Side - Large Play Button */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                      whileHover={{ scale: 1.05 }}
                      className="hidden lg:flex items-center justify-center"
                    >
                      <div className="relative">
                        {/* Outer Ring */}
                        <div className="absolute inset-0 w-32 h-32 bg-white/20 rounded-full animate-ping"></div>
                        {/* Inner Circle */}
                        <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm">
                          <FiPlay className="w-16 h-16 text-harvest-600 ml-2" />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom Decorative Line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent origin-left"
                  ></motion.div>
                </motion.div>
              )}

              <iframe
                className="w-full h-full"
                src={showVideo ? "https://www.youtube.com/embed/Qy8WZfT0DqE?autoplay=1" : "https://www.youtube.com/embed/Qy8WZfT0DqE"}
                title="Sylvia's Basket - Organic Farming in Kenya"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Video 1 */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-gray-100">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/mfiKOtcDYn4"
                    title="Training Program"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">The Power of Kitchen Garden</h3>
                  <p className="text-sm text-gray-600">Growing food at home for better nutrition</p>
                </div>
              </motion.div>

              {/* Video 2 */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-gray-100">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/IjTaNJFOr9I"
                    title="Farmer Success Stories"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">Sylvia's Bountiful Sanctuary</h3>
                  <p className="text-sm text-gray-600">A haven of organic abundance and life</p>
                </div>
              </motion.div>

              {/* Video 3 - Community Impact */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-gray-100">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/fLH-r4gtWbg"
                    title="Community Impact"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">Why Eat Organic</h3>
                  <p className="text-sm text-gray-600">The benefits of organic food for health and planet</p>
                </div>
              </motion.div>
            </div>

            {/* View More Link */}
            <div className="text-center mt-10">
              <a
                href="https://www.youtube.com/results?search_query=sylvia%27s+basket"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-semibold text-lg"
              >
                <span>View More Videos</span>
                <FiExternalLink className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Creative Split Design */}
      <section className="relative overflow-hidden bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left Side - Image with Overlay Content */}
          <div className="relative bg-gradient-to-br from-accent-600 via-sage-600 to-accent-700 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-60">
              <img
                src="/images/woman_planting.jpg"
                alt="Farmer planting"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-accent-700/30 to-sage-700/40"></div>
            </div>

            {/* Animated Circles */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-sage-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12 lg:p-16">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Your Impact Matters</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                  Be Part of the{' '}
                  <span className="font-cursive text-accent-200 block mt-2">Revolution</span>
                </h2>

                <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-xl">
                  Every contribution helps us train more farmers, plant more trees, and build a sustainable food future for Africa.
                </p>

                {/* Impact Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                  >
                    <div className="text-3xl font-bold text-white">1,000+</div>
                    <div className="text-sm text-white/80">Farmers Trained</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                  >
                    <div className="text-3xl font-bold text-white">2,000+</div>
                    <div className="text-sm text-white/80">Trees Planted</div>
                  </motion.div>
                </div>

                <Link href="/get-involved">
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white text-accent-700 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all flex items-center gap-3 group"
                  >
                    <FiHeart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Support Our Mission
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right Side - Interactive Cards */}
          <div className="bg-gradient-to-br from-accent-50 via-white to-sage-50 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="mb-8">
                <span className="text-kicker text-accent-600">Get Involved Today</span>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2 mb-4">
                  Choose Your Impact
                </h3>
                <p className="text-lg text-gray-600">
                  Multiple ways to make a difference in sustainable agriculture
                </p>
              </div>

              {/* Interactive Option Cards */}
              <motion.div
                whileHover={{ x: 10 }}
                className="group"
              >
                <Link href="/donate">
                  <div className="glass-card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border-l-4 border-accent-500">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-sage-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <FiHeart className="w-6 h-6" />
                      </div>
                      <FiArrowRight className="w-5 h-5 text-accent-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Make a Donation</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Directly support farmer training programs and organic agriculture initiatives across Kenya
                    </p>
                    <div className="mt-4 text-sm font-semibold text-accent-600">
                      Donate Now →
                    </div>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ x: 10 }}
                className="group"
              >
                <Link href="/farmers-stories">
                  <div className="glass-card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border-l-4 border-harvest-500">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-harvest-500 to-clay-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <FiUsers className="w-6 h-6" />
                      </div>
                      <FiArrowRight className="w-5 h-5 text-harvest-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Read Success Stories</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Discover how farmers are transforming their lives through organic farming practices
                    </p>
                    <div className="mt-4 text-sm font-semibold text-harvest-600">
                      Explore Stories →
                    </div>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ x: 10 }}
                className="group"
              >
                <Link href="/our-work">
                  <div className="glass-card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border-l-4 border-sage-500">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-accent-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <FiTarget className="w-6 h-6" />
                      </div>
                      <FiArrowRight className="w-5 h-5 text-sage-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Explore Our Programs</h4>
                    <p className="text-gray-600 leading-relaxed">
                      See the full scope of our training, advocacy, and community development work
                    </p>
                    <div className="mt-4 text-sm font-semibold text-sage-600">
                      View Programs →
                    </div>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
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
