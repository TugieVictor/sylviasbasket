'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiPause, FiPlay } from 'react-icons/fi'
import type { ShopSlide } from '@/lib/shopSlides'

const SLIDE_SECONDS = 6

/** Rounded photo banner at the top of the shop, with its own headline per slide. */
export default function ShopHeroSlider({ slides }: { slides: ShopSlide[] }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const count = slides.length

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(query.matches)
    const onChange = () => setReduceMotion(query.matches)
    query.addEventListener('change', onChange)
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      query.removeEventListener('change', onChange)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const go = useCallback((step: number) => setActive((i) => (i + step + count) % count), [count])

  useEffect(() => {
    if (paused || hidden || reduceMotion || count < 2) return
    const timer = window.setTimeout(() => go(1), SLIDE_SECONDS * 1000)
    return () => window.clearTimeout(timer)
  }, [active, paused, hidden, reduceMotion, count, go])

  if (count === 0) return null
  const slide = slides[active]

  return (
    <div
      className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[520px] sm:h-[460px] lg:h-[500px] bg-sage-800"
      role="region"
      aria-roledescription="carousel"
      aria-label="Shop highlights"
    >
      {slides.map((s, index) => {
        const isActive = index === active
        return (
          <picture
            key={s.image}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
          >
            <source type="image/webp" srcSet={`${s.image}-800.webp 800w, ${s.image}-1200.webp 1200w, ${s.image}-1920.webp 1920w`} sizes="(min-width: 1280px) 1200px, 100vw" />
            <img
              src={`${s.image}-1200.jpg`}
              alt={isActive ? s.alt : ''}
              loading={index === 0 ? 'eager' : 'lazy'}
              className={`absolute inset-0 w-full h-full object-cover ${isActive && !reduceMotion ? 'hero-kenburns' : ''}`}
              style={{ objectPosition: s.position || 'center', animationDuration: `${SLIDE_SECONDS + 2}s` }}
            />
          </picture>
        )
      })}

      {/* Shade so the words stay readable: from the left on wide screens, from the bottom on phones */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sage-900/95 via-sage-900/55 to-sage-900/10 md:bg-gradient-to-r md:from-sage-900/90 md:via-sage-900/55 md:to-transparent"></div>

      <div className="relative z-10 h-full flex flex-col justify-end md:justify-center p-6 pb-20 sm:p-10 sm:pb-20 lg:px-14 max-w-2xl" aria-live={paused ? 'polite' : 'off'}>
        <div key={active} className="shop-slide-text">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-harvest-200 bg-white/10 border border-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
            {slide.kicker}
          </span>
          <h2 className="font-display font-bold text-white text-[1.75rem] sm:text-4xl lg:text-5xl leading-tight mt-3 sm:mt-4">{slide.title}</h2>
          <p className="text-white/85 text-[0.95rem] sm:text-lg mt-3 max-w-lg">{slide.text}</p>
          <Link
            href={slide.button.href}
            className="inline-flex items-center gap-2 mt-5 sm:mt-6 bg-white text-accent-800 hover:bg-harvest-50 px-6 py-3 rounded-full font-semibold shadow-lg transition-colors"
          >
            {slide.button.label} <FiArrowRight />
          </Link>
        </div>
      </div>

      {count > 1 && (
        <div className="absolute z-20 bottom-5 left-6 right-6 sm:left-10 sm:right-10 lg:left-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5" role="group" aria-label="Choose a slide">
            {slides.map((s, index) => (
              <button
                key={s.image}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Slide ${index + 1} of ${count}: ${s.title}`}
                aria-current={index === active}
                className={`h-2 rounded-full transition-all duration-500 ${index === active ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play slideshow' : 'Pause slideshow'} className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 border border-white/25 text-white flex items-center justify-center backdrop-blur-sm">
              {paused ? <FiPlay /> : <FiPause />}
            </button>
            <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 border border-white/25 text-white flex items-center justify-center backdrop-blur-sm">
              <FiChevronLeft />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next slide" className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 border border-white/25 text-white flex items-center justify-center backdrop-blur-sm">
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
