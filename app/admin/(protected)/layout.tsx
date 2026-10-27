import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

const sections = [
  { href: '/admin/', label: 'Overview' },
  { href: '/admin/orders/', label: 'Orders' },
  { href: '/admin/products/', label: 'Products' },
  { href: '/admin/delivery/', label: 'Delivery' },
  { href: '/admin/courses/', label: 'Courses' },
  { href: '/admin/visits/', label: 'Farm visits' },
  { href: '/admin/settings/', label: 'Settings' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/admin/login/')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-sage-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/admin/" className="flex items-center gap-3">
            <img src="/images/sylvias-logo.png" alt="" className="h-9 bg-white rounded-lg px-2 py-1" />
            <span className="font-display font-bold">Admin</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-white/80">{admin.name}</span>
            <Link href="/" className="text-white/80 hover:text-white">View site</Link>
            <form action="/api/admin/logout" method="post">
              <button type="submit" className="bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5">Sign out</button>
            </form>
          </div>
        </div>
        <nav aria-label="Admin sections" className="max-w-6xl mx-auto px-4 pb-2 flex gap-1 overflow-x-auto">
          {sections.map((s) => (
            <Link key={s.href} href={s.href} className="px-3 py-2 rounded-lg text-sm font-semibold text-white/85 hover:bg-white/10 whitespace-nowrap">
              {s.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
