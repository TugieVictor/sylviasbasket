import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Quick gate for the admin area: without a session cookie, send the visitor
 * to the login page. The session itself is fully checked on every admin page
 * (app/admin/(protected)/layout.tsx), so a fake cookie gets nowhere.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/admin/login')) return NextResponse.next()
  if (!request.cookies.get('sb_admin')?.value) {
    return NextResponse.redirect(new URL('/admin/login/', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
