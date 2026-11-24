import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Two jobs:
 *
 * 1. Shop on its own address. With SHOP_URL set, the bare shop address
 *    (e.g. https://shop.sylviasbasket.co.ke/) opens the shop page. When
 *    MAIN_URL is set too (for example
 *    https://shop.sylviasbasket.co.ke and https://www.sylviasbasket.co.ke),
 *    shop and payment pages are only served on the shop address and every
 *    other page only on the main address. Visitors who land on the wrong one
 *    are sent across. Without both settings, or on any other address (the
 *    netlify.app trial, previews, your computer), nothing is redirected.
 *
 * 2. Quick gate for the admin area: without a session cookie, send the visitor
 *    to the login page. The session itself is fully checked on every admin
 *    page (app/admin/(protected)/layout.tsx), so a fake cookie gets nowhere.
 */

// Pages that belong to the shop address
const SHOP_PAGES = ['/shop', '/payment', '/farm-visits/pay']

const isShopPage = (path: string) => SHOP_PAGES.some((p) => path === p || path.startsWith(p + '/'))

function hostOf(url: string | undefined) {
  if (!url) return null
  try {
    return new URL(url).host.toLowerCase()
  } catch {
    return null
  }
}

function splitRedirect(request: NextRequest) {
  const shopUrl = process.env.SHOP_URL
  const mainUrl = process.env.MAIN_URL
  const shopHost = hostOf(shopUrl)
  const mainHost = hostOf(mainUrl)
  if (!shopUrl || !shopHost) return null

  const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').toLowerCase()
  const { pathname, search } = request.nextUrl
  // The bare shop address opens the shop (needs SHOP_URL only)
  if (host === shopHost && pathname === '/') return new URL('/shop/' + search, shopUrl)
  if (!mainUrl || !mainHost) return null
  // Shared files and data requests work on both addresses
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) return null

  const onShop = host === shopHost
  const onMain = host === mainHost || host === mainHost.replace(/^www\./, '')
  if (onShop && !isShopPage(pathname)) return new URL(pathname + search, mainUrl)
  if (onMain && isShopPage(pathname)) return new URL(pathname + search, shopUrl)
  return null
}

export function middleware(request: NextRequest) {
  const target = splitRedirect(request)
  if (target) return NextResponse.redirect(target, 308)

  const { pathname } = request.nextUrl
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!request.cookies.get('sb_admin')?.value) {
      return NextResponse.redirect(new URL('/admin/login/', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  // Every page, but not built files, images or other files with an extension
  matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'],
}
