import { headers } from 'next/headers'

/** The address of the site handling this request, e.g. https://sylviasbasket.co.ke */
export function siteOriginFromHeaders() {
  const h = headers()
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000'
  const proto = h.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}
