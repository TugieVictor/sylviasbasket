import Link from 'next/link'
import type { OrderStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ORDER_STATUS_LABELS, orderStatusBadge, releaseExpiredOrders } from '@/lib/orders'

export const dynamic = 'force-dynamic'

const FILTERS: { key: string; label: string; statuses: OrderStatus[] }[] = [
  { key: 'open', label: 'To handle', statuses: ['PAID', 'PACKED', 'OUT_FOR_DELIVERY'] },
  { key: 'unpaid', label: 'Awaiting payment', statuses: ['AWAITING_PAYMENT'] },
  { key: 'done', label: 'Delivered', statuses: ['DELIVERED'] },
  { key: 'closed', label: 'Cancelled or expired', statuses: ['CANCELLED', 'EXPIRED'] },
]

const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`
const when = (d: Date) => d.toLocaleString('en-GB', { timeZone: 'Africa/Nairobi', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export default async function AdminOrdersPage({ searchParams }: { searchParams: { show?: string } }) {
  await releaseExpiredOrders()
  const filter = FILTERS.find((f) => f.key === searchParams.show) || FILTERS[0]
  const [orders, review] = await Promise.all([
    prisma.order.findMany({
      where: { status: { in: filter.statuses } },
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.payment.findMany({ where: { purpose: 'ORDER', status: 'REVIEW' }, include: { order: { select: { id: true, reference: true } } } }),
  ])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Orders</h1>
        <Link href="/admin/delivery/" className="text-sm font-semibold text-accent-700 underline">Delivery options and fees</Link>
      </div>

      {review.length > 0 && (
        <div className="mt-5 bg-harvest-50 border border-harvest-300 rounded-2xl p-4 text-sm text-harvest-900">
          <p className="font-semibold">Payments to check</p>
          <p className="mt-1">These payments did not match the order total, so they were not confirmed automatically. Please check them in your iPay account.</p>
          <ul className="mt-2 list-disc pl-5">
            {review.map((p) => (
              <li key={p.id}>
                {p.reference}{p.order ? <> for order <Link className="underline" href={`/admin/orders/${p.order.id}/`}>{p.order.reference}</Link></> : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto mt-5 pb-1">
        {FILTERS.map((f) => (
          <Link key={f.key} href={`/admin/orders/?show=${f.key}`} className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${f.key === filter.key ? 'bg-sage-900 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
            {f.label}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 text-gray-600">Nothing here.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/admin/orders/${o.id}/`} className="block bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900">{o.customerName}</p>
                  <span className={orderStatusBadge(o.status)}>{ORDER_STATUS_LABELS[o.status]}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {kes(o.totalKes)} · {o._count.items} {o._count.items === 1 ? 'item' : 'items'} · {o.isPickup ? 'Collect from farm' : o.deliveryZoneName}
                </p>
                <p className="text-xs text-gray-500 mt-1">{o.reference} · {when(o.createdAt)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
