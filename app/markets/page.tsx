'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiExternalLink, FiShoppingBag, FiTrendingUp, FiUsers, FiPackage } from 'react-icons/fi'
import { GiTomato, GiFruitBowl, GiCarrot } from 'react-icons/gi'

const MarketsPage = () => {
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

  const marketChannels = [
    {
      icon: <FiShoppingBag className="w-8 h-8" />,
      title: 'Greenspoon',
      description: 'Premium organic produce delivery partner serving Nairobi and surrounding areas',
      link: 'https://greenspoon.co.ke/product-tag/sylvia-basket/',
      status: 'Active Partnership',
      color: 'from-accent-500 to-sage-600'
    },
    {
      icon: <GiTomato className="w-8 h-8" />,
      title: 'Kitchens & Restaurants',
      description: 'Direct supply to health-conscious restaurants and institutional kitchens',
      status: 'Active',
      color: 'from-harvest-500 to-clay-600'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Informal Settlements',
      description: 'Making organic food accessible to underserved communities across Kenya',
      status: 'Coming Soon',
      color: 'from-primary-600 to-earth-600'
    },
  ]

  const products = [
    {
      icon: <GiCarrot className="w-12 h-12" />,
      name: 'Fresh Vegetables',
      items: 'Kales, Spinach, Tomatoes, Onions, Capsicum',
      availability: 'Year-round'
    },
    {
      icon: <GiFruitBowl className="w-12 h-12" />,
      name: 'Seasonal Fruits',
      items: 'Avocados, Passion Fruit, Tree Tomatoes',
      availability: 'Seasonal'
    },
    {
      icon: <FiPackage className="w-12 h-12" />,
      name: 'Aggregated Produce',
      items: 'Sourced from 50+ certified organic farmers',
      availability: '5+ tonnes monthly'
    },
  ]

  const features = [
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: 'Fair Prices',
      description: 'Ensuring farmers receive fair compensation for quality organic produce'
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: 'Market Access',
      description: 'Connecting smallholder farmers to premium urban markets'
    },
    {
      icon: <FiPackage className="w-6 h-6" />,
      title: 'Aggregation Hub',
      description: 'Consolidating produce from 50+ partner farmers for efficiency'
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Market Image */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/market_place.jpg"
            alt="African marketplace with fresh organic produce"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-accent-900/90 via-sage-900/85 to-accent-900/90"></div>
        </div>

        {/* Content */}
        <div className="container-custom relative z-10 pt-32 pb-20">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <span className="text-overline text-white">Where to Find Us</span>
            <h1 className="text-display text-white mb-6 mt-3">
              Markets &{' '}
              <span className="font-cursive text-harvest-300">Marketing</span>
            </h1>
            <p className="text-subtitle text-white mb-8">
              Connecting <span className="font-bold">organic farmers to consumers</span> and creating <span className="font-bold">fair, sustainable food systems</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://greenspoon.co.ke/product-tag/sylvia-basket/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-accent-700 px-8 py-4 rounded-full font-semibold shadow-2xl hover:shadow-white/50 transition-all flex items-center gap-2"
                >
                  <FiShoppingBag className="w-5 h-5" />
                  Shop on Greenspoon
                  <FiExternalLink className="w-4 h-4" />
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Market Channels */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12 max-w-3xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-kicker text-harvest-600">Distribution Networks</span>
            <h2 className="text-hero text-gray-900 mt-3 mb-6">
              Our Market Channels
            </h2>
            <p className="text-subtitle text-gray-600">
              Multiple pathways to connect <span className="text-gradient-accent font-bold">organic produce</span> with <span className="text-gradient-warm font-bold">conscious consumers</span>
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {marketChannels.map((channel, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${channel.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl text-white`}>
                  {channel.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-3">
                  {channel.title}
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {channel.description}
                </p>
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  channel.status === 'Coming Soon'
                    ? 'bg-harvest-100 text-harvest-700'
                    : 'bg-accent-100 text-accent-700'
                }`}>
                  {channel.status}
                </div>
                {channel.link && (
                  <a
                    href={channel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-accent-600 hover:text-accent-700 font-semibold flex items-center gap-2"
                  >
                    Visit Website
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding bg-gradient-to-br from-accent-50 via-sage-50 to-sky-50">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-kicker text-harvest-600">Our Products</span>
            <h2 className="text-hero text-gray-900 mt-3 mb-6">
              What We Offer
            </h2>
            <p className="text-subtitle text-gray-600">
              <span className="text-gradient-accent font-bold">Fresh, certified organic produce</span> from our farm and partner network
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {products.map((product, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="text-center glass-card rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-accent-500 to-sage-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl">
                  {product.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-3">
                  {product.name}
                </h3>
                <p className="text-gray-700 mb-2">
                  {product.items}
                </p>
                <p className="text-sm text-accent-600 font-semibold">
                  {product.availability}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Marketing Model Features */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12 max-w-3xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-kicker text-harvest-600">How We Work</span>
            <h2 className="text-hero text-gray-900 mt-3 mb-6">
              Our Marketing Model
            </h2>
            <p className="text-subtitle text-gray-600">
              Aggregation, buying, and selling of organic produce with a focus on <span className="text-gradient-warm font-bold">farmer welfare</span>
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-harvest-500 to-clay-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Coming Soon - Informal Settlements */}
      <section className="section-padding bg-gradient-to-br from-harvest-50 via-earth-50 to-primary-100 relative overflow-hidden">
        {/* African woman with child decorative image */}
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 hidden lg:block">
          <img
            src="/images/woman_with_child_on_farm.jpg"
            alt="African woman farming with child"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-3xl"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="inline-block px-4 py-2 bg-harvest-500 text-white rounded-full text-sm font-bold mb-6">
              COMING SOON
            </div>
            <h2 className="text-hero text-gray-900 mb-6">
              Organic Food for Informal Settlements
            </h2>
            <p className="text-body-lg mb-8 leading-relaxed">
              We're working on an initiative to make <span className="text-gradient-accent font-bold">organic, nutritious food accessible and affordable</span> to communities in informal settlements across Kenya. <span className="text-highlight font-semibold">Everyone deserves access to healthy food</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/get-involved">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-accent-600 to-sage-600 text-white px-8 py-4 rounded-full font-semibold shadow-2xl hover:shadow-accent-500/50 transition-all"
                >
                  Support This Initiative
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default MarketsPage
