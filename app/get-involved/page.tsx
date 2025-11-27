'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiHeart, FiUsers, FiGlobe, FiMail, FiPhone, FiMapPin, FiShare2, FiDollarSign, FiUserCheck } from 'react-icons/fi'
import { GiFarmer } from 'react-icons/gi'

const GetInvolvedPage = () => {
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [subscribeMessage, setSubscribeMessage] = useState('')

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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setSubscribeMessage('Please enter a valid email address')
      return
    }

    setSubscribing(true)
    setSubscribeMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubscribeMessage('Successfully subscribed! Check your email for confirmation.')
        setEmail('')
      } else {
        setSubscribeMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setSubscribeMessage('An error occurred. Please try again later.')
    } finally {
      setSubscribing(false)
    }
  }

  // Handler functions for buttons
  const handleDonate = () => {
    // Scroll to contact section
    const contactSection = document.getElementById('contact-section')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handlePartner = () => {
    // Scroll to partnership section then to contact
    const contactSection = document.getElementById('contact-section')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleShare = async () => {
    // Use Web Share API if available, otherwise copy link
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Sylvia's Basket - Organic Farming in Kenya",
          text: "Join Sylvia's Basket in transforming agriculture and empowering farmers across Kenya through organic and agroecological practices.",
          url: window.location.origin
        })
      } catch (err) {
        console.log('Share canceled or failed')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin)
      alert('Link copied to clipboard! Share it with your network.')
    }
  }

  const ways = [
    {
      icon: <FiDollarSign className="w-12 h-12" />,
      title: 'Support the Movement',
      description: 'Your contribution helps Sylvia\'s Basket train more smallholder farmers, expand organic production, and strengthen local food systems.',
      benefits: [
        'Fund farmer training programs',
        'Support women\'s empowerment initiatives',
        'Enable climate resilience projects',
        'Build sustainable infrastructure'
      ],
      cta: 'Donate Now',
      color: 'from-primary-500 to-primary-600',
      id: 'donate'
    },
    {
      icon: <FiUserCheck className="w-12 h-12" />,
      title: 'Volunteer or Partner',
      description: 'Join us as a volunteer, research partner, or collaborator. Together, we can amplify awareness and expand our reach.',
      benefits: [
        'Field work and training support',
        'Communications and marketing',
        'Research and documentation',
        'Event organization'
      ],
      cta: 'Become a Partner',
      color: 'from-harvest-500 to-harvest-600',
      id: 'partner'
    },
    {
      icon: <FiShare2 className="w-12 h-12" />,
      title: 'Spread the Word',
      description: 'Advocacy thrives on awareness. Share our story with your friends, networks, and communities.',
      benefits: [
        'Share on social media',
        'Host talks and events',
        'Start conversations about organic farming',
        'Amplify our advocacy campaigns'
      ],
      cta: 'Share Our Story',
      color: 'from-earth-600 to-earth-700',
      id: 'share'
    },
  ]

  const donationTiers = [
    {
      amount: 'KES 500',
      usd: '$5',
      impact: 'Provides seeds for one farmer',
      icon: <GiFarmer className="w-8 h-8" />
    },
    {
      amount: 'KES 2,500',
      usd: '$25',
      impact: 'Funds one training session',
      icon: <FiUsers className="w-8 h-8" />
    },
    {
      amount: 'KES 5,000',
      usd: '$50',
      impact: 'Supports a women\'s farming group',
      icon: <FiHeart className="w-8 h-8" />
    },
    {
      amount: 'KES 10,000',
      usd: '$100',
      impact: 'Sponsors 5 farmers for a month',
      icon: <FiGlobe className="w-8 h-8" />
    },
  ]

  const partnershipTypes = [
    {
      type: 'NGOs & Organizations',
      description: 'Collaborate on programs, research, and advocacy initiatives',
      icon: <FiGlobe className="w-6 h-6" />
    },
    {
      type: 'Educational Institutions',
      description: 'Research partnerships, student internships, and knowledge exchange',
      icon: <FiUsers className="w-6 h-6" />
    },
    {
      type: 'Food Businesses',
      description: 'Market access partnerships for organic produce',
      icon: <FiUserCheck className="w-6 h-6" />
    },
    {
      type: 'Individual Volunteers',
      description: 'Field support, communications, events, and more',
      icon: <FiHeart className="w-6 h-6" />
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
              Be Part of the{' '}
              <span className="bg-gradient-to-r from-accent-600 via-sage-600 to-accent-700 bg-clip-text text-transparent">Change</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700">
              Real change begins when ordinary people come together with a shared purpose to nurture the earth, empower farmers, and make healthy food accessible to all.
            </p>
          </motion.div>
        </div>
      </section>


      {/* Ways to Get Involved - Glassmorphism */}
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
              How You Can Help
            </h2>
            <p className="text-xl text-gray-700">
              Choose the way that works best for you
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {ways.map((way, index) => (
              <motion.div
                key={index}
                id={way.id}
                variants={fadeInUp}
                whileHover={{ y: -12, scale: 1.02 }}
                className="glass-card rounded-3xl overflow-hidden shadow-2xl hover:shadow-accent-500/20 transition-all"
              >
                <div className={`h-1.5 bg-gradient-to-r ${way.color} rounded-t-3xl`}></div>
                <div className="p-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${way.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl`}>
                    {way.icon}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
                    {way.title}
                  </h3>
                  <p className="text-gray-700 mb-6">
                    {way.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    {way.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2"></div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={way.id === 'donate' ? handleDonate : way.id === 'partner' ? handlePartner : handleShare}
                    className={`w-full bg-gradient-to-r ${way.color} text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow`}
                  >
                    {way.cta}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Donation Impact */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="max-w-5xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                Your Impact
              </h2>
              <p className="text-xl text-gray-700">
                Every donation, big or small, directly supports sustainable farming and empowerment
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {donationTiers.map((tier, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-200 shadow-md text-center"
                >
                  <div className="text-primary-600 mb-4 flex justify-center">
                    {tier.icon}
                  </div>
                  <div className="text-3xl font-display font-bold text-gray-900 mb-1">
                    {tier.amount}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    ({tier.usd} USD)
                  </div>
                  <p className="text-sm text-gray-700">
                    {tier.impact}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-12 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-gradient-to-br from-primary-700 to-primary-800 rounded-2xl p-10 text-white shadow-2xl">
                <h3 className="text-2xl font-display font-bold mb-4">
                  Ready to Make a Difference?
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Choose a donation amount or enter your own
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDonate}
                  className="bg-white text-primary-700 px-10 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-2 mx-auto"
                >
                  <FiHeart className="w-5 h-5" />
                  Donate Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partnership Opportunities - Glassmorphism */}
      <section className="section-padding bg-gradient-to-br from-primary-600 via-earth-600 to-harvest-600 text-white relative overflow-hidden">
        {/* Decorative Glowing Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sage-500/20 rounded-full blur-3xl"></div>
        <div className="container-custom">
          <motion.div
            className="max-w-5xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Partnership Opportunities
              </h2>
              <p className="text-xl opacity-90">
                We welcome collaboration with organizations and individuals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partnershipTypes.map((partner, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      {partner.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold mb-2">
                        {partner.type}
                      </h3>
                      <p className="opacity-90">
                        {partner.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding gradient-earth">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto bg-white rounded-2xl p-10 shadow-xl"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center">
              <FiMail className="w-12 h-12 mx-auto mb-4 text-primary-600" />
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
                Stay Connected
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Sign up for our newsletter to receive updates, impact stories, and opportunities to get involved
              </p>
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-full border-2 border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={subscribing}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={subscribing}
                    className="gradient-primary text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap disabled:opacity-50"
                  >
                    {subscribing ? 'Subscribing...' : 'Subscribe'}
                  </motion.button>
                </div>
                {subscribeMessage && (
                  <p className={`text-sm mt-4 ${subscribeMessage.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {subscribeMessage}
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="max-w-5xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-700">
                Have questions? Want to partner? We'd love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Tell us how you'd like to get involved..."
                    ></textarea>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full gradient-primary text-white px-6 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                      <p className="text-gray-600">Limuru, Kiambu County, Kenya</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-harvest-50 to-white p-6 rounded-xl border border-harvest-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-harvest-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiMail className="w-6 h-6 text-harvest-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <a href="mailto:info@sylviasbasket.org" className="text-harvest-600 hover:text-harvest-700">
                        info@sylviasbasket.org
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-earth-50 to-white p-6 rounded-xl border border-earth-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-earth-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiPhone className="w-6 h-6 text-earth-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <a href="tel:+254700000000" className="text-earth-700 hover:text-earth-800">
                        +254 700 000 000
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <p className="text-gray-600 italic">
                    "Would you like to be part of the change in Africa? Making Organic Products Accessible. Agroecology as the only option for our food systems."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default GetInvolvedPage
