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
      title: 'Policy Advocacy & System Change',
      description: 'Leading advocacy for agroecology in Kenya through CIDP engagement, pesticide regulation reform, and policy framework development. Member of Kiambu County agroecology policy steering committee.',
      highlights: ['Successful pesticide ban advocacy (July 2023)', '100+ farmer advocacy group', 'Kiambu County CIDP integration', 'Agroecology policy development']
    },
  ]

  const partners = [
    {
      name: 'IFOAM',
      description: 'Training & Advocacy ambassador for organic movement',
      type: 'NGO/Civil Society'
    },
    {
      name: 'KOAN',
      description: 'Market access for smallholder farmers',
      type: 'NGO/Civil Society'
    },
    {
      name: 'HPS',
      description: 'Advocacy mainstreaming Agro-ecology',
      type: 'NGO/Civil Society'
    },
    {
      name: 'Biovision',
      description: 'Creating enabling environment for Agro-ecological entrepreneurs',
      type: 'NGO/Civil Society'
    },
    {
      name: 'ICRAF',
      description: 'Agroforestry research and training',
      type: 'NGO/Civil Society'
    },
    {
      name: 'Greenspoon',
      description: 'Organic produce marketing and distribution',
      type: 'Commercial Partner'
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
    {
      icon: <GiWheat className="w-12 h-12" />,
      stat: '2,000+',
      label: 'Trees Planted',
      color: 'from-accent-500 to-sage-600'
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
      description: 'Agroforestry for sustainability',
      icon: <GiPlantSeed />,
      slug: 'indigenous-trees'
    },
    {
      title: 'The Voice of Africa',
      description: 'Representing African farmers globally',
      icon: <FiGlobe />,
      slug: 'voice-of-africa'
    },
    {
      title: 'Advocacy',
      description: 'Policy change for sustainable food systems',
      icon: <FiTarget />,
      slug: 'advocacy'
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Glassmorphism */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20 overflow-hidden mt-20">
        {/* Background Image */}
        <div className="absolute inset-0 top-0">
          <img
            src="/images/green_maize.jpg"
            alt="Green maize plantation - organic farming in action"
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
            <span className="text-overline text-white">Making a Difference</span>
            <h1 className="text-display text-white mt-3 mb-6">
              Our Work in{' '}
              <span className="text-harvest-300">Action</span>
            </h1>
            <p className="text-subtitle text-white">
              Training farmers, building communities, and <span className="font-bold">transforming food systems</span> across Kenya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
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
            <span className="text-kicker text-harvest-600">What We Offer</span>
            <h2 className="text-hero text-gray-900 mt-3 mb-6">
              Our Programs
            </h2>
            <p className="text-subtitle text-gray-600 max-w-3xl mx-auto">
              Comprehensive initiatives designed to <span className="text-gradient-accent font-bold">empower farmers</span> and build <span className="text-gradient-warm font-bold">sustainable food systems</span>
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
            <span className="text-kicker text-harvest-600">Working Together</span>
            <h2 className="text-hero text-gray-900 mt-3 mb-6">
              Our Partners
            </h2>
            <p className="text-subtitle text-gray-600">
              Collaborating with <span className="text-gradient-primary font-bold">leading organizations</span> to amplify our impact
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
      <section className="section-padding bg-gradient-to-br from-harvest-600 via-clay-600 to-sage-700 text-white relative overflow-hidden">
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
            <span className="text-overline text-white">Photo Gallery</span>
            <h2 className="text-hero text-white mt-3 mb-6">
              Our Work in Pictures
            </h2>
            <p className="text-subtitle text-white">
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
            <span className="text-kicker text-harvest-600">Discover More</span>
            <h2 className="text-hero text-gray-900 mt-3 mb-6">
              Want to Learn More?
            </h2>
            <p className="text-subtitle text-gray-700 mb-10">
              Read stories from the <span className="text-gradient-warm font-bold">farmers we've trained</span> and the <span className="text-gradient-accent font-bold">communities we've transformed</span>
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
