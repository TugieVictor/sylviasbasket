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
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/happy_african_child.jpg"
            alt="Happy African child - the future we're building"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-harvest-900/90 via-clay-900/85 to-sage-900/90"></div>
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <span className="text-overline text-white">Real Stories, Real Impact</span>
            <h1 className="text-display text-white mt-3 mb-6">
              Stories from{' '}
              <span className="text-harvest-300">Our Farmers</span>
            </h1>
            <p className="text-subtitle text-white">
              <span className="font-bold">Real people</span>. <span className="font-bold">Real change</span>. <span className="font-bold">Real impact</span> on communities across Kenya and Africa.
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
            <p className="text-body-lg mb-6">
              <span className="text-highlight font-semibold">Every farmer has a story</span>. Behind each harvest is a journey of <span className="text-gradient-warm font-bold">learning, perseverance, and transformation</span>. Here are just a few of the incredible farmers who have been part of Sylvia's Basket community.
            </p>
            <p className="text-lg text-gray-600">
              These stories demonstrate the power of organic farming to <span className="font-semibold text-accent-700">change lives</span>, <span className="font-semibold text-sage-700">strengthen communities</span>, and <span className="font-semibold text-harvest-700">build a more sustainable future</span>.
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
      <section className="section-padding bg-gradient-to-br from-harvest-600 via-clay-600 to-sage-700 text-white">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-overline text-white">Testimonials</span>
            <h2 className="text-hero text-white mt-3 mb-6">
              In Their Own Words
            </h2>
            <p className="text-subtitle text-white">
              Hear what farmers are saying about <span className="font-bold">their experience</span>
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
              <span className="text-kicker text-harvest-600">By the Numbers</span>
              <h2 className="text-hero text-gray-900 mt-3 mb-6">
                Collective Impact
              </h2>
              <p className="text-subtitle text-gray-700">
                Together, our farmers are creating <span className="text-gradient-accent font-bold">lasting change</span>
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

      {/* Message from Sylvia */}
      <section className="section-padding bg-gradient-to-br from-accent-600 via-sage-600 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/sylvia-hero_3.jpg"
            alt="Sylvia Kuria with farmers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-accent-900/80 to-sage-900/80"></div>
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="mb-8">
              <div className="w-40 h-40 mx-auto mb-6 bg-white p-2 rounded-full shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src="/images/sylvia-hero_2.jpg"
                    alt="Sylvia Kuria"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-cursive font-bold mb-4">
                A Message from Sylvia
              </h2>
            </div>
            <blockquote className="text-xl md:text-2xl leading-relaxed italic mb-6">
              "Every farmer has a unique story and immense potential. My vision is to train and support as many farmers as possible so we can leave a lasting legacy for our children - one of healthy food, thriving communities, and a restored planet."
            </blockquote>
            <p className="text-lg font-semibold">
              - Sylvia Kuria, Founder & CEO
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center mb-12">
              <span className="text-kicker text-harvest-600">Watch & Listen</span>
              <h2 className="text-hero text-gray-900 mt-3 mb-6">
                Video Testimonials
              </h2>
              <p className="text-subtitle text-gray-600">
                Hear directly from farmers whose <span className="text-gradient-warm font-bold">lives have been transformed</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video 1 - Moya Moja */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-gray-100">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/xL3rzsk3DO0"
                    title="Moya Moja"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">Moya Moja</h3>
                  <p className="text-sm text-gray-600">Farm visit experience and organic farming insights</p>
                </div>
              </motion.div>

              {/* Video 2 - Elephant Vert East Africa */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-gray-100">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/wtSGEnezhlY"
                    title="Elephant Vert East Africa"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">Elephant Vert East Africa</h3>
                  <p className="text-sm text-gray-600">Partnership in sustainable agriculture solutions</p>
                </div>
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
            <span className="text-kicker text-harvest-600">Join the Movement</span>
            <h2 className="text-hero text-gray-900 mt-3 mb-6">
              Your Story Could Be Next
            </h2>
            <p className="text-subtitle text-gray-700 mb-10">
              Join our <span className="text-gradient-accent font-bold">community of farmers</span> and be part of the <span className="text-gradient-warm font-bold">organic farming revolution</span> in Kenya
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
