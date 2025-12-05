'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiHeart, FiUsers, FiTrendingUp, FiShield, FiDroplet, FiGlobe, FiArrowRight, FiActivity, FiCheckCircle, FiTarget, FiAward, FiMapPin } from 'react-icons/fi'

const AdvocacyPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const advocacyPillars = [
    {
      icon: <FiActivity className="w-12 h-12" />,
      title: 'Chemical-Free Food for Families',
      description: 'Sylvia\'s journey began with a heartfelt goal: to feed her children vegetables free from synthetic pesticides and harmful chemicals. Organic produce supports food safety and public health—a small change on the plate that makes a big difference in people\'s lives.',
      color: 'from-accent-500 to-sage-600'
    },
    {
      icon: <FiShield className="w-12 h-12" />,
      title: 'Making Organic Food Accessible',
      description: 'Through Sylvia\'s Basket, barriers that make organic food inaccessible are being removed. What started as a home garden has grown into a thriving farm business reaching urban consumers, especially mothers seeking healthy, chemical-free food.',
      color: 'from-harvest-500 to-clay-600'
    },
    {
      icon: <FiUsers className="w-12 h-12" />,
      title: 'Empowering Small-Scale Farmers',
      description: 'Sylvia has trained more than 1,000 farmers, both in Kenya and internationally, in organic and agro-ecological farming practices. Her work enables women and small-scale farmers to gain skills, confidence, and resources to produce food sustainably.',
      color: 'from-primary-500 to-earth-600'
    },
    {
      icon: <FiGlobe className="w-12 h-12" />,
      title: 'Restoring Soil and Biodiversity',
      description: 'Through agroforestry, composting, biological pest control, crop rotation, and diversification, Sylvia\'s farming approach builds soil organic matter, improves soil structure, increases water retention, and enhances biodiversity.',
      color: 'from-accent-600 to-sage-700'
    },
  ]

  const agroecologicalPractices = [
    { icon: <FiTarget className="w-6 h-6" />, practice: 'Agroforestry' },
    { icon: <FiCheckCircle className="w-6 h-6" />, practice: 'Composting and organic manure use' },
    { icon: <FiShield className="w-6 h-6" />, practice: 'Biological (non-synthetic) pest control' },
    { icon: <FiDroplet className="w-6 h-6" />, practice: 'Crop rotation and diversification' },
    { icon: <FiActivity className="w-6 h-6" />, practice: 'Natural pest and disease management' },
    { icon: <FiUsers className="w-6 h-6" />, practice: 'Participation' },
  ]

  const keyOutcomes = [
    {
      icon: <FiActivity className="w-8 h-8" />,
      title: 'Healthier Food for Consumers',
      description: 'Chemical-free produce that promotes family health and wellbeing'
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: 'Economic Opportunity',
      description: 'Farmer empowerment through fair markets and sustainable livelihoods'
    },
    {
      icon: <FiDroplet className="w-8 h-8" />,
      title: 'Improved Soil Health',
      description: 'Enhanced soil fertility and structure for long-term productivity'
    },
    {
      icon: <FiGlobe className="w-8 h-8" />,
      title: 'Biodiversity & Balance',
      description: 'Ecological balance through diverse, resilient farming systems'
    },
    {
      icon: <FiCheckCircle className="w-8 h-8" />,
      title: 'Climate Mitigation',
      description: 'Long-term sustainability and climate resilience'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Co-creation of Knowledge',
      description: 'Collaborative learning and knowledge sharing between farmers and communities'
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden mt-20">
        {/* Background Image */}
        <div className="absolute inset-0 top-0">
          <img
            src="/images/woman_planting.jpg"
            alt="Advocacy for sustainable agriculture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-accent-900/70 via-sage-900/65 to-accent-900/70"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-harvest-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="container-custom relative z-10 pt-32 pb-20">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-block mb-6"
            >
              <span className="text-overline text-harvest-300 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">Leading Change</span>
            </motion.div>
            <h1 className="text-display text-white mt-3 mb-6">
              Advocacy &{' '}
              <span className="font-cursive text-harvest-300">Policy Work</span>
            </h1>
            <p className="text-subtitle text-white/95 mb-8">
              From <span className="font-bold text-harvest-300">farm-level action</span> to <span className="font-bold text-harvest-300">national policy</span>, driving systemic change for sustainable food systems across Kenya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-4 shadow-xl"
              >
                <div className="text-3xl font-bold text-white">1,000+</div>
                <div className="text-sm text-white/80">Farmers Trained</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-4 shadow-xl"
              >
                <div className="text-3xl font-bold text-white">100+</div>
                <div className="text-sm text-white/80">Advocacy Coalition</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-4 shadow-xl"
              >
                <div className="text-3xl font-bold text-white">2023</div>
                <div className="text-sm text-white/80">Pesticide Ban Victory</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <p className="text-body-lg mb-6">
              Sylvia's advocacy extends <span className="text-highlight font-semibold">well beyond her farm</span>. She works at the intersection of <span className="text-gradient-accent font-bold">grassroots farmer empowerment</span> and <span className="text-gradient-warm font-bold">policy transformation</span>, championing sustainable agriculture at county and national levels.
            </p>
            <p className="text-lg text-gray-600">
              Her work demonstrates that real change happens when <span className="font-semibold text-accent-700">local action</span> meets <span className="font-semibold text-sage-700">systemic advocacy</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Advocacy Pillars */}
      <section className="section-padding bg-gradient-to-br from-sage-50 via-accent-50 to-sky-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-harvest-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-kicker text-harvest-600">Core Focus Areas</span>
            <h2 className="text-hero text-gray-900 mt-3 mb-6">
              Advocacy Pillars
            </h2>
            <p className="text-subtitle text-gray-600 max-w-3xl mx-auto">
              Four foundational areas driving <span className="text-gradient-accent font-bold">transformative change</span> in Kenya's food systems
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {advocacyPillars.map((pillar, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                <div className="relative glass-card rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                  <div className={`h-1.5 bg-gradient-to-r ${pillar.color}`}></div>
                  <div className="p-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${pillar.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                      {pillar.icon}
                    </div>
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Agro-ecological Practices */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-custom">
          <motion.div
            className="max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center mb-12">
              <span className="text-kicker text-harvest-600">Farming Approach</span>
              <h2 className="text-hero text-gray-900 mt-3 mb-6">
                Agro-Ecological Principles
              </h2>
              <p className="text-subtitle text-gray-600 max-w-3xl mx-auto">
                Practices that <span className="text-gradient-warm font-bold">build soil health</span>, enhance biodiversity, and create <span className="text-gradient-accent font-bold">climate-resilient farms</span>
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {agroecologicalPractices.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-sage-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative glass-card p-6 rounded-2xl border border-accent-200 shadow-lg hover:shadow-xl transition-all flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-sage-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="flex-1 pt-3">
                      <p className="font-bold text-gray-900">{item.practice}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Policy Advocacy Section - Redesigned */}
      <section className="section-padding bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <img
            src="/images/Africa_map.jpg"
            alt="Africa map"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-harvest-500/10 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-kicker text-harvest-600">Systems Change</span>
            <h2 className="text-hero text-gray-900 mt-3 mb-6">
              Policy & Institutional Advocacy
            </h2>
            <p className="text-subtitle text-gray-600 max-w-3xl mx-auto">
              Leading transformative change from <span className="text-gradient-accent font-bold">grassroots to government</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* County Level */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-primary-100 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <FiMapPin className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold mb-2">
                      COUNTY LEVEL
                    </div>
                    <h3 className="text-xl font-display font-bold text-gray-900">Kiambu County</h3>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Policy Steering Committee</p>
                      <p className="text-sm text-gray-600">Member since 2022, shaping county agroecology policy framework</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">CIDP Integration</p>
                      <p className="text-sm text-gray-600">Integrating agro-ecological practices into county planning and extension services</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Farmer Coalition</p>
                      <p className="text-sm text-gray-600">Working with farmer groups and civil society organizations</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* National Level */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-harvest-500 to-clay-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-harvest-100 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-harvest-500 to-clay-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <FiShield className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="inline-block px-3 py-1 bg-harvest-100 text-harvest-700 rounded-full text-xs font-bold mb-2">
                      NATIONAL LEVEL
                    </div>
                    <h3 className="text-xl font-display font-bold text-gray-900">Pesticide Reform</h3>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-harvest-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Coalition Building (2022-2023)</p>
                      <p className="text-sm text-gray-600">United 100+ farmers and environmental advocates for safer food systems</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiAward className="w-5 h-5 text-harvest-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Major Victory: 2023 Pesticide Ban</p>
                      <p className="text-sm text-gray-600">Successfully advocated for Kenya's ban on several hazardous pesticides</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-harvest-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Ongoing Advocacy</p>
                      <p className="text-sm text-gray-600">Continued push for chemical reduction and food safety standards</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-harvest-50 to-clay-50 rounded-xl border border-harvest-200">
                  <div className="flex items-center gap-2 text-harvest-700">
                    <FiAward className="w-5 h-5" />
                    <span className="text-sm font-bold">Historic Win: July 2023 Pesticide Ban</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Value Chains */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-sage-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-accent-100 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-sage-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <FiTrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="inline-block px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-xs font-bold mb-2">
                      MARKET SYSTEMS
                    </div>
                    <h3 className="text-xl font-display font-bold text-gray-900">Fair Value Chains</h3>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-accent-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Market Access Advocacy</p>
                      <p className="text-sm text-gray-600">Championing fair pricing and market opportunities for organic farmers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-accent-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Viable Livelihoods</p>
                      <p className="text-sm text-gray-600">Making organic farming economically sustainable, not just a niche alternative</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-accent-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Policy Integration</p>
                      <p className="text-sm text-gray-600">Ensuring value chain development in county and national frameworks</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Outcomes */}
      <section className="section-padding bg-gradient-to-br from-harvest-50 via-earth-50 to-sage-50 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 hidden lg:block">
          <img
            src="/images/happy_african_children.jpg"
            alt="Happy children"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-harvest-500/10 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center mb-16">
              <span className="text-kicker text-harvest-600">Impact & Results</span>
              <h2 className="text-hero text-gray-900 mt-3 mb-6">
                Key Outcomes
              </h2>
              <p className="text-subtitle text-gray-600 max-w-3xl mx-auto">
                Tangible results from <span className="text-gradient-accent font-bold">grassroots action</span> to <span className="text-gradient-warm font-bold">policy change</span>
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {keyOutcomes.map((outcome, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="glass-card p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all text-center h-full border border-white/50">
                    <div className="w-20 h-20 bg-gradient-to-br from-harvest-500 to-clay-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all">
                      {outcome.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {outcome.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {outcome.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-harvest-600 via-clay-600 to-sage-700 relative overflow-hidden">
        {/* Decorative Glowing Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-harvest-300/20 rounded-full blur-3xl"></div>

        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-6"
            >
              <span className="text-overline text-harvest-300 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">Join the Movement</span>
            </motion.div>
            <h2 className="text-hero text-white mt-3 mb-6">
              Be Part of the Change
            </h2>
            <p className="text-subtitle text-white/95 mb-10 max-w-2xl mx-auto">
              Support <span className="font-bold text-harvest-300">policy advocacy</span> and help build a <span className="font-bold text-harvest-300">sustainable food future</span> for Kenya and beyond
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/our-work">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-harvest-700 px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-white/30 transition-all flex items-center gap-2 justify-center"
                >
                  See Our Programs
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/get-involved">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:bg-white/20 transition-all flex items-center gap-2 justify-center"
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

export default AdvocacyPage
