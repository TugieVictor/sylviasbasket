import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export default async function AdminOverviewPage() {
  const admin = await getCurrentAdmin()
  const [ordersToHandle, products, upcomingSessions, visitRequests, pendingPayments] = await Promise.all([
    prisma.order.count({ where: { status: { in: ['PAID', 'PACKED', 'OUT_FOR_DELIVERY'] } } }),
    prisma.product.count({ where: { active: true } }),
    prisma.courseSession.count({ where: { status: 'OPEN', startDate: { gte: new Date() } } }),
    prisma.visitRequest.count({ where: { status: 'REQUESTED' } }),
    prisma.payment.count({ where: { status: { in: ['PENDING', 'REVIEW'] } } }),
  ])

  const cards = [
    { label: 'Orders to handle', value: ordersToHandle, href: '/admin/orders/' },
    { label: 'Products in the shop', value: products, href: '/admin/products/' },
    { label: 'Upcoming course dates', value: upcomingSessions, href: '/admin/courses/' },
    { label: 'New visit requests', value: visitRequests, href: '/admin/visits/' },
    { label: 'Payments to check', value: pendingPayments, href: '/admin/orders/' },
  ]

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Welcome, {admin?.name}</h1>
      <p className="text-gray-600 mt-1">Here is what needs your attention.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-3xl font-bold text-accent-700">{card.value}</p>
            <p className="text-sm font-semibold text-gray-700 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
