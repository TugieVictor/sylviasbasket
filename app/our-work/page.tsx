'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiUsers, FiBook, FiGlobe, FiAward, FiTrendingUp, FiTarget, FiArrowRight } from 'react-icons/fi'
import { GiFarmer, GiPlantSeed, GiWheat, GiTomato } from 'react-icons/gi'

const OurWorkPage = () => {
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

  const programs = [
    {
      icon: <FiBook className="w-8 h-8" />,
      title: 'Farmer Training Programs',
      description: 'Comprehensive hands-on training in agro-ecological practices, organic farming methods, and sustainable agriculture techniques.',
      highlights: ['1,000+ farmers trained', 'Practical field sessions', 'Ongoing mentorship']
    },
    {
      icon: <GiFarmer className="w-8 h-8" />,
      title: 'Women & Youth Empowerment',
      description: 'Special focus programs designed to empower women and youth farmers with skills, resources, and market access.',
      highlights: ['Active youth engagement', 'Women-led initiatives', 'Income generation support']
    },
    {
      icon: <GiPlantSeed className="w-8 h-8" />,
      title: 'Production & Aggregation Hub',
      description: 'Our farm serves as both a training center and production hub, growing 10-15 seasonal crops and aggregating produce from 50+ partner farmers.',
      highlights: ['5+ tonnes monthly', '50+ partner farmers', '10-15 seasonal crops']
    },
    {
      icon: <FiGlobe className="w-8 h-8" />,
      title: 'Policy Advocacy',
      description: 'Active engagement in shaping policies for sustainable food systems through participation in County Integrated Development Plans (CIDPs).',
      highlights: ['Kiambu County committee', 'Regional representation', 'International forums']
    },
  ]

  const partners = [
    {
      name: 'CIFOR-ICRAF',
      description: 'Collaboration on smallholder agroecology training programs',
      type: 'Research & Training'
    },
    {
      name: 'IFOAM',
      description: 'Organic Leadership Course alumni network',
      type: 'International Network'
    },
    {
      name: 'GIZ-KCOA',
      description: 'Master trainer for Knowledge Centre for Organic Agriculture',
      type: 'Training Partner'
    },
    {
      name: 'Access Agriculture',
      description: 'Community training and knowledge sharing partnership',
      type: 'Training Partner'
    },
    {
      name: 'KOAN',
      description: 'Kenya Organic Agriculture Network collaboration',
      type: 'Industry Association'
    },
    {
      name: 'PELUM',
      description: 'Participatory Ecological Land Use Management network',
      type: 'Regional Network'
    },
    {
      name: 'Biovision Africa Trust',
      description: 'Sustainable agriculture and environmental initiatives',
      type: 'Development Partner'
    },
  ]

  const impactAreas = [
    {
      icon: <FiUsers className="w-12 h-12" />,
      stat: '1,000+',
      label: 'Farmers Trained',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: <GiPlantSeed className="w-12 h-12" />,
      stat: '10-15',
      label: 'Seasonal Crops',
      color: 'from-harvest-500 to-harvest-600'
    },
    {
      icon: <FiTrendingUp className="w-12 h-12" />,
      stat: '5+ Tonnes',
      label: 'Aggregated Monthly',
      color: 'from-earth-600 to-earth-700'
    },
    {
      icon: <FiAward className="w-12 h-12" />,
      stat: '50+',
      label: 'Partner Farmers',
      color: 'from-primary-500 to-primary-600'
    },
  ]

  const galleryItems = [
    {
      title: 'Training Sessions',
      description: 'Hands-on farmer education in the field',
      icon: <FiBook />,
      slug: 'training-sessions'
    },
    {
      title: 'Organic Harvest',
      description: 'Fresh produce from our partner farms',
      icon: <GiTomato />,
      slug: 'organic-harvest'
    },
    {
      title: 'Community Events',
      description: 'Bringing farmers together',
      icon: <FiUsers />,
      slug: 'community-events'
    },
    {
      title: 'Indigenous Trees',
      description: 'Planting for the future',
      icon: <GiPlantSeed />,
      slug: 'indigenous-trees'
    },
    {
      title: 'Women Farmers',
      description: 'Empowering women in agriculture',
      icon: <GiFarmer />,
      slug: 'women-farmers'
    },
    {
      title: 'Youth Training',
      description: 'Next generation of farmers',
      icon: <FiTarget />,
      slug: 'youth-training'
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
              Our Work in{' '}
              <span className="bg-gradient-to-r from-accent-600 via-sage-600 to-accent-700 bg-clip-text text-transparent">Action</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700">
              Training farmers, building communities, and transforming food systems across Kenya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {impactAreas.map((area, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.08, y: -12 }}
                className="text-center glass-card rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className={`w-24 h-24 bg-gradient-to-br ${area.color.replace('from-', 'from-').replace('to-', 'to-')} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-2xl`}>
                  {area.icon}
                </div>
                <div className="text-4xl font-display font-bold text-gray-900 mb-2">
                  {area.stat}
                </div>
                <div className="text-lg text-gray-700 font-semibold">
                  {area.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Programs Section - Glassmorphism */}
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
              Our Programs
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Comprehensive initiatives designed to empower farmers and build sustainable food systems
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {programs.map((program, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -12, scale: 1.02 }}
                className="glass-card rounded-3xl p-8 shadow-2xl hover:shadow-accent-500/20 transition-all"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${['from-accent-500 to-sage-600', 'from-harvest-500 to-clay-600', 'from-sage-500 to-accent-600', 'from-sky-500 to-accent-600'][index]} rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl text-3xl`}>
                  {program.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
                  {program.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {program.description}
                </p>
                <div className="space-y-2">
                  {program.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Our Partners
            </h2>
            <p className="text-xl text-gray-700">
              Collaborating with leading organizations to amplify our impact
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-200 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-display font-bold text-gray-900">
                    {partner.name}
                  </h3>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                    {partner.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {partner.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section - Glassmorphism */}
      <section className="section-padding bg-gradient-to-br from-primary-600 via-earth-600 to-harvest-600 text-white relative overflow-hidden">
        {/* Decorative Glowing Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sage-500/20 rounded-full blur-3xl"></div>
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Our Work in Pictures
            </h2>
            <p className="text-xl opacity-90">
              Visual stories from the field
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {galleryItems.map((item, index) => (
              <Link key={index} href={`/gallery/${item.slug}`}>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                >
                  <div className="text-4xl mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="opacity-90 mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm opacity-80">
                    <span>View Gallery</span>
                    <FiArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Want to Learn More?
            </h2>
            <p className="text-xl text-gray-700 mb-10">
              Read stories from the farmers we've trained and the communities we've transformed
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/farmers-stories">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="gradient-primary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-2"
                >
                  Read Farmers Stories
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/get-involved">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-700 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-2 border-2 border-primary-200"
                >
                  Partner With Us
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default OurWorkPage
