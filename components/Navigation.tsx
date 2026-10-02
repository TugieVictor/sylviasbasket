'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiHeart, FiChevronDown, FiShoppingBag } from 'react-icons/fi'

type NavItem = { label: string; href: string; description?: string }
type NavGroup = { label: string; href?: string; items?: NavItem[] }

// Site menu: version_2_plan.md, section 3 "Navigation (confirmed)"
const navGroups: NavGroup[] = [
  {
    label: 'About',
    items: [
      { label: 'Our Story', href: '/about/', description: "How Sylvia's Basket began and grew" },
      { label: 'Meet Sylvia', href: '/about/#meet-sylvia', description: 'Our founder, Sylvia Kuria' },
      { label: 'Farmers Stories', href: '/farmers-stories/', description: 'Real people, real change' },
      { label: 'Gallery', href: '/our-work/#gallery', description: 'Our work in pictures' },
      { label: 'Partners', href: '/our-work/#partners', description: 'Who we work with' },
    ],
  },
  {
    label: 'Our Work',
    items: [
      { label: 'Training', href: '/our-work/', description: 'Farmer training and programmes' },
      { label: 'Advocacy', href: '/advocacy/', description: 'Agroecology and food policy' },
      { label: 'Markets and aggregation', href: '/markets/', description: 'Getting organic produce to market' },
    ],
  },
  {
    label: 'Learn & Visit',
    items: [
      { label: 'Courses', href: '/courses/', description: 'Hands-on courses on the farm' },
      { label: 'Farm Visits', href: '/farm-visits/', description: 'Plan a visit to the farm' },
    ],
  },
  { label: 'News & Publications', href: '/news/' },
  { label: 'Get Involved', href: '/get-involved/' },
]

const withSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`)
// Links to a section of a page (with #) never mark a menu item as the current page
const isItemActive = (pathname: string, href: string) =>
  !href.includes('#') && withSlash(pathname) === withSlash(href)
const isGroupActive = (pathname: string, group: NavGroup) =>
  group.href ? isItemActive(pathname, group.href) : !!group.items?.some((item) => isItemActive(pathname, item.href))

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  // When a mouse hover opened a dropdown, the click that follows should not close it again
  const hoverOpenedAt = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus when the page changes
  useEffect(() => {
    setOpenMenu(null)
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Escape closes menus; clicking outside closes the dropdown
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null)
        setIsMobileMenuOpen(false)
      }
    }
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [])

  // Stop the page scrolling behind the open mobile menu
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const linkStyle = (active: boolean) =>
    `px-3 py-2 rounded-lg transition-all duration-300 font-display text-sm whitespace-nowrap flex items-center gap-1 ${
      active
        ? isScrolled
          ? 'text-accent-600 font-bold bg-accent-50'
          : 'text-white font-bold bg-white/15 backdrop-blur-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]'
        : isScrolled
        ? 'text-gray-700 hover:text-accent-600 font-semibold hover:bg-accent-50/50'
        : 'text-white/95 hover:text-white font-semibold hover:bg-white/10 backdrop-blur-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
    }`

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-700 ease-in-out ${
        isScrolled || isMobileMenuOpen
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
          : 'bg-gradient-to-b from-black/50 via-black/30 to-transparent backdrop-blur-xl'
      }`}
      aria-label="Main menu"
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
          <div className="hidden lg:flex items-center gap-1">
            {navGroups.map((group) => {
              const active = isGroupActive(pathname, group)

              if (!group.items) {
                return (
                  <Link
                    key={group.label}
                    href={group.href!}
                    className={linkStyle(active)}
                    aria-current={active ? 'page' : undefined}
                  >
                    {group.label}
                  </Link>
                )
              }

              const open = openMenu === group.label
              return (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => {
                    hoverOpenedAt.current = Date.now()
                    setOpenMenu(group.label)
                  }}
                  onMouseLeave={() => setOpenMenu(null)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenMenu(null)
                  }}
                >
                  <button
                    type="button"
                    className={linkStyle(active)}
                    aria-expanded={open}
                    aria-haspopup="true"
                    onClick={() => {
                      const justHovered = Date.now() - hoverOpenedAt.current < 400
                      setOpenMenu(open && !justHovered ? null : group.label)
                    }}
                  >
                    {group.label}
                    <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full pt-3 w-72"
                      >
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-2">
                          {group.items.map((item) => {
                            const itemActive = isItemActive(pathname, item.href)
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpenMenu(null)}
                                aria-current={itemActive ? 'page' : undefined}
                                className={`block rounded-xl px-4 py-3 transition-colors ${
                                  itemActive ? 'bg-accent-50' : 'hover:bg-accent-50/70 focus:bg-accent-50/70'
                                }`}
                              >
                                <span className={`block font-display font-semibold text-sm ${itemActive ? 'text-accent-700' : 'text-gray-900'}`}>
                                  {item.label}
                                </span>
                                {item.description && (
                                  <span className="block text-xs text-gray-600 mt-0.5">{item.description}</span>
                                )}
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            {/* Shop button: commercial actions are styled apart from the menu */}
            <Link href="/shop/" className="ml-2">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 border-2 ${
                  isScrolled
                    ? 'border-accent-600 text-accent-700 hover:bg-accent-50'
                    : 'border-white/70 text-white hover:bg-white/15 backdrop-blur-sm'
                }`}
              >
                <FiShoppingBag className="w-4 h-4" />
                <span>Shop</span>
              </motion.span>
            </Link>

            <Link href="/donate" className="ml-1">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 border-2 border-transparent ${
                  isScrolled
                    ? 'bg-gradient-to-r from-harvest-600 via-clay-600 to-sage-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-white text-accent-700 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)]'
                }`}
              >
                <FiHeart className="w-4 h-4" />
                <span>Donate</span>
              </motion.span>
            </Link>
          </div>

          {/* Mobile: Shop and menu buttons stay in the top bar */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/shop/"
              aria-label="Shop"
              className={`p-3 rounded-xl transition-all duration-300 ${
                isScrolled || isMobileMenuOpen
                  ? 'text-accent-700 bg-accent-50 hover:bg-accent-100'
                  : 'text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20'
              }`}
            >
              <FiShoppingBag size={22} />
            </Link>
            <motion.button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className={`p-3 rounded-xl transition-all duration-300 ${
                isScrolled || isMobileMenuOpen
                  ? 'text-gray-700 bg-accent-50 hover:bg-accent-100'
                  : 'text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
              }`}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu: full screen, groups expand in place */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ height: `calc(100svh - ${isScrolled ? 5 : 6}rem)` }}
            className="lg:hidden absolute left-0 right-0 top-full overflow-y-auto bg-white border-t border-gray-200"
          >
            <div className="container-custom py-4 flex flex-col min-h-full">
              <ul className="space-y-1">
                {navGroups.map((group) => {
                  const active = isGroupActive(pathname, group)
                  if (!group.items) {
                    return (
                      <li key={group.label}>
                        <Link
                          href={group.href!}
                          onClick={() => setIsMobileMenuOpen(false)}
                          aria-current={active ? 'page' : undefined}
                          className={`block px-4 py-4 rounded-xl font-display text-lg ${
                            active ? 'text-accent-700 font-bold bg-accent-50' : 'text-gray-800 font-semibold'
                          }`}
                        >
                          {group.label}
                        </Link>
                      </li>
                    )
                  }
                  const expanded = openMobileGroup === group.label
                  return (
                    <li key={group.label}>
                      <button
                        type="button"
                        onClick={() => setOpenMobileGroup(expanded ? null : group.label)}
                        aria-expanded={expanded}
                        className={`w-full flex items-center justify-between px-4 py-4 rounded-xl font-display text-lg ${
                          active ? 'text-accent-700 font-bold' : 'text-gray-800 font-semibold'
                        }`}
                      >
                        <span>{group.label}</span>
                        <FiChevronDown className={`w-5 h-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4"
                          >
                            {group.items.map((item) => {
                              const itemActive = isItemActive(pathname, item.href)
                              return (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    aria-current={itemActive ? 'page' : undefined}
                                    className={`block px-4 py-3 rounded-xl border-l-2 ${
                                      itemActive ? 'border-accent-600 bg-accent-50 text-accent-700 font-semibold' : 'border-gray-200 text-gray-700'
                                    }`}
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              )
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-auto pt-6 pb-4 space-y-3">
                <Link
                  href="/shop/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full border-2 border-accent-600 text-accent-700 px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <FiShoppingBag className="w-5 h-5" />
                  <span>Shop</span>
                </Link>
                <Link
                  href="/donate"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-gradient-to-r from-harvest-600 via-clay-600 to-sage-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"
                >
                  <FiHeart className="w-5 h-5" />
                  <span>Donate Now</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navigation
