import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate, statusBadge, VISIT_STATUS_LABELS } from '@/lib/visits'

export const dynamic = 'force-dynamic'

const FILTERS = [
  { key: 'open', label: 'Needs action', statuses: ['REQUESTED', 'CONFIRMED', 'PAID'] },
  { key: 'REQUESTED', label: 'New', statuses: ['REQUESTED'] },
  { key: 'CONFIRMED', label: 'Awaiting payment', statuses: ['CONFIRMED'] },
  { key: 'PAID', label: 'Paid', statuses: ['PAID'] },
  { key: 'closed', label: 'Done', statuses: ['COMPLETED', 'DECLINED', 'CANCELLED'] },
] as const

export default async function AdminVisitsPage({ searchParams }: { searchParams: { show?: string } }) {
  const filter = FILTERS.find((f) => f.key === searchParams.show) || FILTERS[0]
  const visits = await prisma.visitRequest.findMany({
    where: { status: { in: [...filter.statuses] } },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Farm visits</h1>
        <Link href="/admin/visits/types/" className="text-sm font-semibold text-accent-700 underline">Visit types and fees</Link>
      </div>

      <div className="flex gap-2 overflow-x-auto mt-5 pb-1">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/admin/visits/?show=${f.key}`}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${f.key === filter.key ? 'bg-sage-900 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {visits.length === 0 ? (
        <p className="mt-8 text-gray-600">Nothing here.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {visits.map((v) => (
            <li key={v.id}>
              <Link href={`/admin/visits/${v.id}/`} className="block bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900">{v.name}{v.organisation ? ` (${v.organisation})` : ''}</p>
                  <span className={statusBadge(v.status)}>{VISIT_STATUS_LABELS[v.status]}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {v.visitTypeName} · {v.groupSize} people · {formatDate(v.confirmedDate || v.preferredDate1)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{v.reference} · received {v.createdAt.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
