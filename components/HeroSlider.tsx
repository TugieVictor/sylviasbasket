'use client'

import { useCallback, useEffect, useState } from 'react'

export type HeroSlide = {
  /** File name prefix in /public/images/hero, e.g. "hero-training" */
  name: string
  alt: string
  caption: string
  /** CSS object-position for phones and for large screens */
  position?: { mobile: string; desktop: string }
}

const SLIDE_SECONDS = 7

/**
 * Background photo slider for the homepage hero.
 * Crossfades between photos with a slow zoom. Stops moving for visitors who
 * ask for reduced motion, and pauses while the tab is hidden.
 */
export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false) // paused by the visitor
  const [hidden, setHidden] = useState(false) // browser tab not visible
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(query.matches)
    const onChange = () => setReduceMotion(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const next = useCallback(() => setActive((i) => (i + 1) % slides.length), [slides.length])

  useEffect(() => {
    if (paused || hidden || reduceMotion || slides.length < 2) return
    const timer = window.setTimeout(next, SLIDE_SECONDS * 1000)
    return () => window.clearTimeout(timer)
  }, [active, paused, hidden, reduceMotion, next, slides.length])

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return (
    <>
      {/* Photos, stacked; only the active one is visible */}
      <div className="absolute inset-0 overflow-hidden" aria-live="off">
        {slides.map((slide, index) => {
          const isActive = index === active
          return (
            <picture
              key={slide.name}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden={!isActive}
            >
              <source
                type="image/webp"
                srcSet={`/images/hero/${slide.name}-800.webp 800w, /images/hero/${slide.name}-1200.webp 1200w, /images/hero/${slide.name}-1920.webp 1920w`}
                sizes="100vw"
              />
              <img
                src={`/images/hero/${slide.name}-1200.jpg`}
                alt={isActive ? slide.alt : ''}
                loading={index === 0 ? 'eager' : 'lazy'}
                className={`hero-slide-img absolute inset-0 w-full h-full object-cover ${isActive && !reduceMotion ? 'hero-kenburns' : ''}`}
                style={
                  {
                    '--pos-mobile': slide.position?.mobile ?? 'center',
                    '--pos-desktop': slide.position?.desktop ?? 'center',
                    animationDuration: `${SLIDE_SECONDS + 2}s`,
                  } as React.CSSProperties
                }
              />
            </picture>
          )
        })}
      </div>

      {/* Caption and slide controls, in the site's glass-card style */}
      {slides.length > 1 && (
        <div className="absolute z-20 bottom-24 right-4 md:right-8 lg:bottom-28 lg:right-12 hidden sm:flex items-center gap-4 glass-card rounded-full pl-5 pr-3 py-2 shadow-xl">
          <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            {slides[active].caption}
          </p>
          <div className="flex items-center gap-1.5" role="group" aria-label="Choose a photo">
            {slides.map((slide, index) => (
              <button
                key={slide.name}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1} of ${slides.length}: ${slide.caption}`}
                aria-current={index === active}
                className={`h-2 rounded-full transition-all duration-500 ${index === active ? 'w-6 bg-accent-600' : 'w-2 bg-gray-400 hover:bg-gray-600'}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-700 hover:bg-white/60 text-xs"
          >
            {paused ? '▶' : '❚❚'}
          </button>
        </div>
      )}

      {/* Phones: simple dots only */}
      {slides.length > 1 && (
        <div className="absolute z-20 bottom-24 left-0 right-0 flex sm:hidden justify-center gap-1.5" role="group" aria-label="Choose a photo">
          {slides.map((slide, index) => (
            <button
              key={slide.name}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1} of ${slides.length}: ${slide.caption}`}
              aria-current={index === active}
              className={`h-2 rounded-full transition-all duration-500 ${index === active ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </>
  )
}
