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
    { href: '/advocacy/', label: 'Advocacy' },
    { href: '/markets/', label: 'Markets' },
    { href: '/farmers-stories/', label: 'Farmers Stories' },
    { href: '/news/', label: 'News & Blog' },
    { href: '/get-involved/', label: 'Get Involved' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-700 ease-in-out ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
          : 'bg-gradient-to-b from-black/50 via-black/30 to-transparent backdrop-blur-xl'
      }`}
    >
      {/* Decorative gradient line at top */}
      {!isScrolled && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-400/50 to-transparent" />
      )}

      <div className="container-custom">
        <div className={`flex items-center justify-between transition-all duration-700 ${
          isScrolled ? 'h-20' : 'h-24'
        }`}>
          {/* Logo - Premium Badge Design */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="transition-all duration-700 relative"
            >
              {/* Logo Badge Container */}
              <div className={`relative transition-all duration-700 ${
                isScrolled
                  ? 'px-3 py-2 rounded-xl bg-gradient-to-br from-accent-50 to-sage-50'
                  : 'px-4 py-3 rounded-2xl bg-gradient-to-br from-white via-accent-50/80 to-sage-50/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-2 border-white/40'
              }`}>
                {/* Subtle inner glow when not scrolled */}
                {!isScrolled && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-400/20 via-transparent to-sage-400/20 blur-sm" />
                )}

                {/* Logo Image */}
                <img
                  src="/images/sylvias-logo.png"
                  alt="Sylvia's Basket Logo"
                  className={`relative z-10 transition-all duration-700 ${
                    isScrolled
                      ? 'h-10 md:h-12'
                      : 'h-12 md:h-14'
                  }`}
                />

                {/* Bottom accent bar when not scrolled */}
                {!isScrolled && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-accent-500 to-transparent rounded-full opacity-60" />
                )}
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              // Check if current page matches - handle both with and without trailing slash
              const isActive = pathname === link.href || pathname === link.href + '/' || pathname + '/' === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group"
                >
                  <div className={`px-3 py-2 rounded-lg transition-all duration-300 font-display text-sm whitespace-nowrap ${
                    isActive
                      ? isScrolled
                        ? 'text-accent-600 font-bold bg-accent-50'
                        : 'text-white font-bold bg-white/15 backdrop-blur-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]'
                      : isScrolled
                      ? 'text-gray-700 hover:text-accent-600 font-semibold hover:bg-accent-50/50'
                      : 'text-white/95 hover:text-white font-semibold hover:bg-white/10 backdrop-blur-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
                  }`}>
                    {link.label}
                  </div>

                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDot"
                      className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                        isScrolled
                          ? 'bg-accent-600'
                          : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      }`}
                    />
                  )}
                </Link>
              )
            })}
            <Link href="/get-involved/" className="ml-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  isScrolled
                    ? 'bg-gradient-to-r from-harvest-600 via-clay-600 to-sage-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-white text-accent-700 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)]'
                }`}
              >
                <FiHeart className="w-4 h-4" />
                <span>Donate</span>
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`lg:hidden p-3 rounded-xl transition-all duration-300 ${
              isScrolled
                ? 'text-gray-700 bg-accent-50 hover:bg-accent-100'
                : 'text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
            }`}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg"
          >
            <div className="container-custom py-6 space-y-2">
              {navLinks.map((link, index) => {
                // Check if current page matches - handle both with and without trailing slash
                const isActive = pathname === link.href || pathname === link.href + '/' || pathname + '/' === link.href
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl font-display transition-all duration-200 ${
                        isActive
                          ? 'text-accent-600 font-bold bg-accent-50'
                          : 'text-gray-700 hover:text-accent-600 font-semibold hover:bg-accent-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{link.label}</span>
                        {isActive && (
                          <span className="w-2 h-2 bg-accent-600 rounded-full" />
                        )}
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="pt-4"
              >
                <Link href="/get-involved/" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full bg-gradient-to-r from-harvest-600 via-clay-600 to-sage-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group">
                    <FiHeart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Donate Now</span>
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
