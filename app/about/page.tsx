'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiAward, FiUsers, FiGlobe, FiHeart, FiArrowRight } from 'react-icons/fi'
import { GiFarmer, GiPlantSeed } from 'react-icons/gi'

const AboutPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const achievements = [
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: '1,000+ Farmers Trained',
      description: 'Across Kenya in agro-ecological farming practices'
    },
    {
      icon: <GiPlantSeed className="w-8 h-8" />,
      title: '5+ Tonnes Monthly',
      description: 'Organic produce aggregated from our farmer network'
    },
    {
      icon: <FiGlobe className="w-8 h-8" />,
      title: 'International Representation',
      description: 'Representing African farmers at regional and global forums'
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: 'Strategic Partnerships',
      description: 'With CIFOR-ICRAF, GIZ-KCOA, KOAN, PELUM, Access Agriculture, and more'
    },
  ]

  const roles = [
    {
      icon: <GiFarmer className="w-6 h-6" />,
      title: 'Trainer and Mentor',
      description: 'Empowering farmers with knowledge and sustainable practices'
    },
    {
      icon: <GiPlantSeed className="w-6 h-6" />,
      title: 'Farm Production Hub',
      description: 'Growing 10-15 seasonal organic crops year-round'
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: 'Aggregation Hub',
      description: 'Sourcing from 50+ organic farmers, aggregating 5+ tonnes monthly'
    },
    {
      icon: <FiHeart className="w-6 h-6" />,
      title: 'Advocate',
      description: 'Championing policies for sustainable food systems in Kenya'
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
              From a Kitchen Garden to a{' '}
              <span className="bg-gradient-to-r from-accent-600 via-sage-600 to-accent-700 bg-clip-text text-transparent">Movement for Change</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700">
              A story of passion, purpose, and the power to transform communities
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="prose prose-lg max-w-none"
            >
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Sylvia's Basket began in a <span className="font-semibold text-primary-600">small kitchen garden in Limuru, Kenya</span>. What started as Sylvia Kuria's passion for growing organic vegetables for her family has blossomed into a movement transforming communities.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Today, Sylvia's Basket combines organic food production, training, and advocacy to help farmers adopt agro-ecological methods, earn fair incomes, and secure nutritious food for their families.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through hands-on training, community building, and policy engagement, we're proving that sustainable agriculture isn't just possible — it's the path to a healthier, more equitable future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission - Glassmorphism */}
      <section className="section-padding bg-gradient-to-br from-accent-50 via-sage-50 to-sky-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-harvest-500/10 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.03, y: -8 }}
              className="glass-card p-10 rounded-3xl shadow-2xl"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-sage-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <FiGlobe className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
                Our Vision
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                A Kenya, an Africa, and a World where every family has access to safe, organic food, and every farmer has the skills and support to produce it sustainably.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.03, y: -8 }}
              className="glass-card p-10 rounded-3xl shadow-2xl"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-harvest-500 to-clay-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <FiHeart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To promote agro-ecological farming through training, community building, and policy advocacy — empowering farmers while restoring the health of our ecosystems.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Achievements */}
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
              Our Achievements
            </h2>
            <p className="text-xl text-gray-600">
              Building momentum for change across Kenya and beyond
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -12, scale: 1.03 }}
                className="glass-card p-8 rounded-2xl shadow-2xl hover:shadow-accent-500/20 transition-all"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${['from-accent-500 to-sage-600', 'from-sage-500 to-accent-600', 'from-harvest-500 to-clay-600', 'from-sky-500 to-accent-600'][index]} rounded-2xl flex items-center justify-center mb-4 shadow-xl text-white text-3xl`}>
                  {achievement.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
                  {achievement.title}
                </h3>
                <p className="text-gray-700">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder Section - Glassmorphism */}
      <section className="section-padding bg-gradient-to-br from-primary-600 via-earth-600 to-harvest-600 text-white relative overflow-hidden">
        {/* Decorative Glowing Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sage-500/20 rounded-full blur-3xl"></div>
        <div className="container-custom">
          <motion.div
            className="max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Meet Sylvia Kuria
              </h2>
              <p className="text-xl opacity-90">
                Founder, CEO, and Passionate Advocate for Organic Farming
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-center mb-12">
              {/* Sylvia's Photo */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/sylvia-hero.jpg"
                    alt="Sylvia Kuria"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-accent-900/40 to-transparent"></div>
                </div>
              </motion.div>

              {/* Sylvia's Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <p className="text-lg leading-relaxed">
                  <span className="font-semibold text-xl">Sylvia Kuria</span> is an organic farmer, trainer, and passionate advocate who has dedicated her life to transforming Kenya's agricultural landscape. With a deep commitment to agroecology and food sovereignty, she has trained over 1,000 farmers and built partnerships with leading organizations.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-300 rounded-full mt-2 flex-shrink-0"></div>
                    <p><span className="font-semibold">Alumni</span> of the IFOAM Organic Leadership Course</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-300 rounded-full mt-2 flex-shrink-0"></div>
                    <p><span className="font-semibold">Master Trainer</span> for GIZ-funded Knowledge Centre for Organic Agriculture (KCOA)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-300 rounded-full mt-2 flex-shrink-0"></div>
                    <p><span className="font-semibold">Partner</span> with CIFOR-ICRAF on smallholder agroecology training</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-300 rounded-full mt-2 flex-shrink-0"></div>
                    <p><span className="font-semibold">Ambassador</span> for IFOAM - Organics International</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 border border-white/20">
              <div>
                <h3 className="text-2xl font-display font-bold mb-6">Her Brand Roles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roles.map((role, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        {role.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">{role.title}</h4>
                        <p className="text-sm opacity-90">{role.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
              Join Our Movement
            </h2>
            <p className="text-xl text-gray-700 mb-10">
              Together, we can build a future where safe, organic food is accessible to all, and farmers thrive sustainably.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/our-work">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="gradient-primary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-2"
                >
                  Explore Our Work
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/get-involved">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-700 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-2 border-2 border-primary-200"
                >
                  <FiHeart className="w-5 h-5" />
                  Get Involved
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
