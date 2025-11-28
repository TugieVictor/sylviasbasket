'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiHeart } from 'react-icons/fi'

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/about/', label: 'About' },
    { href: '/our-work/', label: 'Our Work' },
    { href: '/markets/', label: 'Markets' },
    { href: '/farmers-stories/', label: 'Farmers Stories' },
    { href: '/news/', label: 'News & Blog' },
    { href: '/get-involved/', label: 'Get Involved' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-gray-900/80 backdrop-blur-md shadow-md'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo - African-inspired cursive */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col"
              style={{ filter: isScrolled ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            >
              <h1 className="text-3xl md:text-4xl font-cursive font-bold leading-tight">
                <span className={`${
                  isScrolled
                    ? 'bg-gradient-to-r from-harvest-600 via-sage-700 to-accent-700 bg-clip-text text-transparent'
                    : 'text-harvest-300'
                }`}>
                  Sylvia's
                </span>
                <br />
                <span className={`text-2xl md:text-3xl font-bold tracking-wider ${
                  isScrolled ? 'text-earth-700' : 'text-white'
                }`}>
                  BASKET
                </span>
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              // Check if current page matches - handle both with and without trailing slash
              const isActive = pathname === link.href || pathname === link.href + '/' || pathname + '/' === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-all relative group font-display ${
                    isActive
                      ? isScrolled
                        ? 'text-accent-600 font-bold'
                        : 'text-harvest-300 font-bold'
                      : isScrolled
                      ? 'text-gray-700 hover:text-accent-600 font-semibold'
                      : 'text-white hover:text-harvest-300 font-semibold'
                  }`}
                  style={{ textShadow: isScrolled ? 'none' : '0 2px 4px rgba(0,0,0,0.3)' }}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 transition-all ${
                    isActive ? 'w-full h-1' : 'w-0 h-0.5 group-hover:w-full'
                  } ${
                    isScrolled ? 'bg-accent-600' : 'bg-harvest-300'
                  } ${isActive ? 'rounded-full' : ''}`} />
                </Link>
              )
            })}
            <Link href="/get-involved/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-harvest-600 via-clay-600 to-sage-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
              >
                <FiHeart className="w-4 h-4" />
                Donate
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
            style={{ filter: isScrolled ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="container-custom py-4 space-y-4">
              {navLinks.map((link, index) => {
                // Check if current page matches - handle both with and without trailing slash
                const isActive = pathname === link.href || pathname === link.href + '/' || pathname + '/' === link.href
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-2 font-display ${
                        isActive
                          ? 'text-accent-600 font-bold'
                          : 'text-gray-700 hover:text-accent-600 font-semibold'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="inline-block w-1.5 h-1.5 bg-accent-600 rounded-full ml-2" />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                <Link href="/get-involved/" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full bg-gradient-to-r from-harvest-600 via-clay-600 to-sage-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg flex items-center justify-center gap-2">
                    <FiHeart className="w-4 h-4" />
                    Donate Now
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navigation
