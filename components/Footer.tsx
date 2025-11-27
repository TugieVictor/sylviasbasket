'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiArrowRight, FiHeart } from 'react-icons/fi'
import { GiPlantSeed } from 'react-icons/gi'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [subscribeMessage, setSubscribeMessage] = useState('')

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

  return (
    <footer className="bg-gradient-to-br from-accent-50 via-sage-50 to-sky-50 text-gray-900 relative overflow-hidden pt-20 pb-8">
      {/* Decorative Glowing Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-harvest-500/20 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        {/* Newsletter Section - Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-10 mb-16 shadow-2xl"
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-sage-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <GiPlantSeed className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-display font-bold mb-4 bg-gradient-to-r from-accent-700 via-sage-700 to-accent-800 bg-clip-text text-transparent">
              Join Our Community
            </h3>
            <p className="text-gray-700 text-lg mb-8">
              Get monthly updates on organic farming, training opportunities, and inspiring stories from our farmer network
            </p>
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full glass-card focus:outline-none focus:ring-2 focus:ring-accent-500 text-gray-900 placeholder-gray-500"
                  disabled={subscribing}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={subscribing}
                  className="bg-gradient-to-r from-accent-600 to-sage-600 text-white px-8 py-4 rounded-full font-semibold shadow-2xl hover:shadow-accent-500/50 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                  <FiArrowRight className="w-5 h-5" />
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

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-display font-bold mb-4 bg-gradient-to-r from-accent-700 via-sage-700 to-accent-800 bg-clip-text text-transparent">
              Sylvia's Basket
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Empowering communities through organic farming and agroecology. Growing more than food – growing awareness, opportunity, and a healthier planet.
            </p>
            <div className="flex space-x-3">
              <motion.a
                whileHover={{ scale: 1.15, rotate: 5 }}
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center hover:bg-gradient-to-br hover:from-accent-600 hover:to-sage-600 hover:text-white transition-all shadow-lg"
              >
                <FiFacebook size={22} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, rotate: 5 }}
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center hover:bg-gradient-to-br hover:from-accent-600 hover:to-sage-600 hover:text-white transition-all shadow-lg"
              >
                <FiTwitter size={22} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, rotate: 5 }}
                href="https://www.instagram.com/sylvias_basket"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center hover:bg-gradient-to-br hover:from-accent-600 hover:to-sage-600 hover:text-white transition-all shadow-lg"
              >
                <FiInstagram size={22} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, rotate: 5 }}
                href="https://www.linkedin.com/in/sylvia-kuria-%F0%9F%87%B0%F0%9F%87%AA-14a61657/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center hover:bg-gradient-to-br hover:from-accent-600 hover:to-sage-600 hover:text-white transition-all shadow-lg"
              >
                <FiLinkedin size={22} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-display font-semibold mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-700 hover:text-accent-600 transition-colors flex items-center gap-2 group"><FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />About Us</Link></li>
              <li><Link href="/our-work" className="text-gray-700 hover:text-accent-600 transition-colors flex items-center gap-2 group"><FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Our Work</Link></li>
              <li><Link href="/farmers-stories" className="text-gray-700 hover:text-accent-600 transition-colors flex items-center gap-2 group"><FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Farmers Stories</Link></li>
              <li><Link href="/news" className="text-gray-700 hover:text-accent-600 transition-colors flex items-center gap-2 group"><FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />News & Blog</Link></li>
              <li><Link href="/get-involved" className="text-gray-700 hover:text-accent-600 transition-colors flex items-center gap-2 group"><FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Get Involved</Link></li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="text-lg font-display font-semibold mb-4 text-gray-900">Get Involved</h4>
            <ul className="space-y-3">
              <li><Link href="/get-involved#donate" className="text-gray-700 hover:text-accent-600 transition-colors flex items-center gap-2 group"><FiHeart className="w-4 h-4 group-hover:scale-110 transition-transform" />Donate</Link></li>
              <li><Link href="/get-involved#volunteer" className="text-gray-700 hover:text-accent-600 transition-colors flex items-center gap-2 group"><FiHeart className="w-4 h-4 group-hover:scale-110 transition-transform" />Volunteer</Link></li>
              <li><Link href="/get-involved#partner" className="text-gray-700 hover:text-accent-600 transition-colors flex items-center gap-2 group"><FiHeart className="w-4 h-4 group-hover:scale-110 transition-transform" />Partner With Us</Link></li>
              <li><Link href="/get-involved#newsletter" className="text-gray-700 hover:text-accent-600 transition-colors flex items-center gap-2 group"><FiMail className="w-4 h-4 group-hover:scale-110 transition-transform" />Newsletter</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-display font-semibold mb-4 text-gray-900">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-700 group">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-sage-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <FiMapPin className="w-5 h-5 text-white" />
                </div>
                <span className="mt-2">Limuru, Kiambu County, Kenya</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700 group">
                <div className="w-10 h-10 bg-gradient-to-br from-harvest-500 to-clay-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <FiMail className="w-5 h-5 text-white" />
                </div>
                <a href="mailto:info@sylviasbasket.org" className="hover:text-accent-600 transition-colors">
                  info@sylviasbasket.org
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-700 group">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-accent-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <FiPhone className="w-5 h-5 text-white" />
                </div>
                <a href="tel:+254700000000" className="hover:text-accent-600 transition-colors">
                  +254 700 000 000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section with Glass Effect */}
        <div className="glass-card rounded-3xl p-8 mt-16 text-center border border-white/20 shadow-2xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 text-2xl italic bg-gradient-to-r from-accent-700 via-sage-700 to-accent-800 bg-clip-text text-transparent font-bold"
          >
            "When we care for the earth, it cares for us"
          </motion.p>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-accent-500 to-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium mb-2">
            © {currentYear} Sylvia's Basket. All rights reserved.
          </p>
          <p className="text-sm text-gray-600">
            Built with <FiHeart className="inline w-4 h-4 text-accent-600" /> for sustainable farming and a healthier planet
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
