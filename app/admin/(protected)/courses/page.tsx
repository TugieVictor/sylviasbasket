import Link from 'next/link'
import type { CourseRequestStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { COURSE_REQUEST_LABELS, courseRequestBadge } from '@/lib/courses'

export const dynamic = 'force-dynamic'

const FILTERS: { key: string; label: string; statuses: CourseRequestStatus[] }[] = [
  { key: 'open', label: 'Needs action', statuses: ['NEW', 'CONTACTED'] },
  { key: 'enrolled', label: 'Joined', statuses: ['ENROLLED'] },
  { key: 'closed', label: 'Not going ahead', statuses: ['DECLINED'] },
]

export default async function AdminCoursesPage({ searchParams }: { searchParams: { show?: string } }) {
  const filter = FILTERS.find((f) => f.key === searchParams.show) || FILTERS[0]
  const requests = await prisma.courseRequest.findMany({ where: { status: { in: filter.statuses } }, orderBy: { createdAt: 'desc' }, take: 200 })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Course requests</h1>
        <Link href="/admin/courses/manage/" className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-accent-600 text-white">Courses and dates</Link>
      </div>
      <div className="flex gap-2 overflow-x-auto mt-5 pb-1">
        {FILTERS.map((f) => (
          <Link key={f.key} href={`/admin/courses/?show=${f.key}`} className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${f.key === filter.key ? 'bg-sage-900 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>
            {f.label}
          </Link>
        ))}
      </div>
      {requests.length === 0 ? (
        <p className="mt-8 text-gray-600">Nothing here.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {requests.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/courses/requests/${r.id}/`} className="block bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900">{r.name}{r.organisation ? ` (${r.organisation})` : ''}</p>
                  <span className={courseRequestBadge(r.status)}>{COURSE_REQUEST_LABELS[r.status]}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{r.courseTitle} · {r.groupSize} {r.groupSize === 1 ? 'person' : 'people'}</p>
                <p className="text-xs text-gray-500 mt-1">{r.reference} · received {r.createdAt.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
