'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiHeart, FiTrendingUp, FiUsers, FiArrowRight } from 'react-icons/fi'
import { GiFarmer, GiPlantSeed } from 'react-icons/gi'

const FarmersStoriesPage = () => {
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

  const stories = [
    {
      name: 'Mary Wanjiku',
      location: 'Kiambu County',
      role: 'Organic Vegetable Farmer',
      story: 'After joining Sylvia\'s training program, I learned how to grow vegetables without chemicals. Now my family eats healthy food, and I sell surplus produce at the local market. My income has tripled, and I\'m training other women in my community.',
      impact: 'Income increased by 300%',
      icon: <GiFarmer className="w-12 h-12" />,
      color: 'from-primary-500 to-primary-600'
    },
    {
      name: 'James Kamau',
      location: 'Limuru',
      role: 'Youth Farmer & Trainer',
      story: 'I thought farming was for old people until I met Sylvia. She showed me that organic farming can be profitable and sustainable. Now I run my own 2-acre farm and mentor other young people interested in agriculture.',
      impact: 'Mentoring 15 youth farmers',
      icon: <FiUsers className="w-12 h-12" />,
      color: 'from-harvest-500 to-harvest-600'
    },
    {
      name: 'Grace Njeri',
      location: 'Kiambu',
      role: 'Community Leader',
      story: 'Sylvia\'s Basket helped us form a women\'s farming group. We now aggregate our produce together and access better markets. What started with 5 women has grown to 30, and we\'re supporting each other beyond farming.',
      impact: '30-member cooperative formed',
      icon: <FiHeart className="w-12 h-12" />,
      color: 'from-earth-600 to-earth-700'
    },
    {
      name: 'Peter Kariuki',
      location: 'Limuru',
      role: 'Sustainable Farmer',
      story: 'I was using expensive chemical fertilizers that were destroying my soil. Through Sylvia\'s training, I learned about composting and natural pest management. My soil is healthier, costs are down, and my yields are better than ever.',
      impact: 'Reduced costs by 60%',
      icon: <GiPlantSeed className="w-12 h-12" />,
      color: 'from-primary-500 to-primary-600'
    },
    {
      name: 'Lucy Muthoni',
      location: 'Kiambu County',
      role: 'Organic Farmer',
      story: 'As a single mother, I needed a reliable income. Sylvia taught me organic farming techniques and connected me with buyers. Now I support my three children through school with income from my farm, and I have hope for the future.',
      impact: 'Supporting 3 children\'s education',
      icon: <FiTrendingUp className="w-12 h-12" />,
      color: 'from-harvest-500 to-harvest-600'
    },
    {
      name: 'David Mwangi',
      location: 'Limuru',
      role: 'Agroecology Advocate',
      story: 'Sylvia inspired me to not just farm organically, but to advocate for sustainable agriculture in my community. I now serve on our local farmers\' committee and help shape policies that support small-scale organic farmers.',
      impact: 'Influencing local policy',
      icon: <FiUsers className="w-12 h-12" />,
      color: 'from-earth-600 to-earth-700'
    },
  ]

  const testimonials = [
    {
      quote: "Sylvia's training changed my life. I went from struggling to make ends meet to having a thriving organic farm that supports my entire family.",
      author: "Mary Wanjiku",
      role: "Organic Farmer"
    },
    {
      quote: "The knowledge and support from Sylvia's Basket gave me confidence to pursue farming as a career. Now I'm proud to call myself a farmer.",
      author: "James Kamau",
      role: "Youth Farmer"
    },
    {
      quote: "We're not just growing food anymore – we're growing a community, growing hope, and growing a better future for our children.",
      author: "Grace Njeri",
      role: "Community Leader"
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center gradient-earth pt-32 pb-20">
        <div className="container-custom">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 mb-6">
              Stories from{' '}
              <span className="text-primary-600">Our Farmers</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700">
              Real people. Real change. Real impact on communities across Kenya.
            </p>
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
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Every farmer has a story. Behind each harvest is a journey of learning, perseverance, and transformation. Here are just a few of the incredible farmers who have been part of Sylvia's Basket community.
            </p>
            <p className="text-lg text-gray-600">
              These stories demonstrate the power of organic farming to change lives, strengthen communities, and build a more sustainable future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Farmer Stories Grid */}
      <section className="section-padding gradient-earth">
        <div className="container-custom">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {stories.map((story, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
              >
                <div className={`h-2 bg-gradient-to-r ${story.color}`}></div>
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-display font-bold text-gray-900 mb-1">
                        {story.name}
                      </h3>
                      <p className="text-sm text-gray-600">{story.location}</p>
                      <p className="text-sm font-semibold text-primary-600 mt-1">
                        {story.role}
                      </p>
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-br ${story.color} rounded-full flex items-center justify-center text-white flex-shrink-0`}>
                      {story.icon}
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "{story.story}"
                  </p>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <FiTrendingUp className="w-5 h-5 text-primary-600" />
                      <span className="font-semibold text-gray-900">{story.impact}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              In Their Own Words
            </h2>
            <p className="text-xl opacity-90">
              Hear what farmers are saying about their experience
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
              >
                <div className="text-4xl mb-4 opacity-50">"</div>
                <p className="text-lg leading-relaxed mb-6">
                  {testimonial.quote}
                </p>
                <div className="border-t border-white/20 pt-4">
                  <p className="font-semibold text-lg">{testimonial.author}</p>
                  <p className="text-sm opacity-90">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                Collective Impact
              </h2>
              <p className="text-xl text-gray-700">
                Together, our farmers are creating lasting change
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-primary-200 shadow-lg"
              >
                <div className="text-5xl font-display font-bold text-primary-600 mb-2">
                  1,000+
                </div>
                <p className="text-lg text-gray-700">Farmers Empowered</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 bg-gradient-to-br from-harvest-50 to-white rounded-2xl border border-harvest-200 shadow-lg"
              >
                <div className="text-5xl font-display font-bold text-harvest-600 mb-2">
                  90%
                </div>
                <p className="text-lg text-gray-700">Youth Participation</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 bg-gradient-to-br from-earth-50 to-white rounded-2xl border border-earth-200 shadow-lg"
              >
                <div className="text-5xl font-display font-bold text-earth-700 mb-2">
                  50+
                </div>
                <p className="text-lg text-gray-700">Partner Farmers</p>
              </motion.div>
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
              Your Story Could Be Next
            </h2>
            <p className="text-xl text-gray-700 mb-10">
              Join our community of farmers and be part of the organic farming revolution in Kenya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/our-work">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="gradient-primary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-2"
                >
                  Learn About Our Programs
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

export default FarmersStoriesPage
