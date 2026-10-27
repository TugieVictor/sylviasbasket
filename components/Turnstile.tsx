'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove: (id?: string) => void
    }
  }
}

// Cloudflare's official always-pass test key, used in development without a key
const TEST_SITE_KEY = '1x00000000000000000000AA'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/**
 * Cloudflare Turnstile spam check. Calls onToken with a token to send to the
 * server with the form. Renders nothing in production until a site key is set.
 */
export default function Turnstile({ onToken, resetKey = 0 }: { onToken: (token: string) => void; resetKey?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>()
  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || (process.env.NODE_ENV !== 'production' ? TEST_SITE_KEY : '')

  useEffect(() => {
    if (!siteKey || !ref.current) return
    const render = () => {
      if (!ref.current || !window.turnstile || widgetId.current) return
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token: string) => onToken(token),
        'expired-callback': () => onToken(''),
        appearance: 'interaction-only',
      })
    }
    if (window.turnstile) render()
    else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
      if (!script) {
        script = document.createElement('script')
        script.src = SCRIPT_SRC
        script.async = true
        document.head.appendChild(script)
      }
      script.addEventListener('load', render)
    }
    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current)
      widgetId.current = undefined
    }
  }, [siteKey, onToken])

  // Get a fresh token after each submission
  useEffect(() => {
    if (resetKey && widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current)
  }, [resetKey])

  if (!siteKey) return null
  return <div ref={ref} className="min-h-[1px]" />
}
