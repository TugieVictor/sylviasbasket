import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { COURSE_REQUEST_LABELS, courseRequestBadge, describeSessionDates } from '@/lib/courses'
import { formatDate } from '@/lib/visits'
import { saveCourseRequestNotes, setCourseRequestStatus } from '../../actions'

export const dynamic = 'force-dynamic'

const STEPS = [
  { status: 'CONTACTED', label: 'I have contacted them' },
  { status: 'ENROLLED', label: 'They joined the course' },
  { status: 'DECLINED', label: 'Not going ahead' },
] as const

export default async function CourseRequestPage({ params, searchParams }: { params: { id: string }; searchParams: { done?: string } }) {
  const r = await prisma.courseRequest.findUnique({ where: { id: params.id }, include: { session: true } })
  if (!r) notFound()
  const phone = `+${r.phone}`

  return (
    <div className="space-y-5 max-w-3xl">
      <Link href="/admin/courses/" className="text-sm text-accent-700 underline">← Course requests</Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">{r.name}</h1>
        <span className={courseRequestBadge(r.status)}>{COURSE_REQUEST_LABELS[r.status]}</span>
      </div>
      {searchParams.done && <p role="status" className="bg-accent-50 border border-accent-200 text-accent-800 rounded-xl px-4 py-3 text-sm">Saved.</p>}

      <section className="bg-white rounded-2xl border border-gray-200 p-5">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div><dt className="text-gray-500">Course</dt><dd className="font-semibold text-gray-900">{r.courseTitle}</dd></div>
          <div><dt className="text-gray-500">Date</dt><dd className="font-semibold text-gray-900">{r.session ? `${describeSessionDates(r.session.startDate, r.session.endDate)}, ${r.session.location}` : r.preferredDate ? `Prefers ${formatDate(r.preferredDate)}` : 'Any date'}</dd></div>
          <div><dt className="text-gray-500">People</dt><dd className="font-semibold text-gray-900">{r.groupSize}</dd></div>
          {r.organisation && <div><dt className="text-gray-500">Organisation</dt><dd className="font-semibold text-gray-900">{r.organisation}</dd></div>}
          <div><dt className="text-gray-500">Reference</dt><dd className="font-semibold text-gray-900">{r.reference}</dd></div>
          <div><dt className="text-gray-500">Received</dt><dd className="font-semibold text-gray-900">{r.createdAt.toLocaleString('en-GB', { timeZone: 'Africa/Nairobi', dateStyle: 'medium', timeStyle: 'short' })}</dd></div>
        </dl>
        {r.message && <p className="mt-4 text-sm text-gray-800 bg-earth-50 rounded-xl p-3 whitespace-pre-line">{r.message}</p>}
        <div className="flex flex-wrap gap-2 mt-4">
          <a href={`tel:${phone}`} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-300">Call {phone}</a>
          <a href={`https://wa.me/${r.phone}`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-300">WhatsApp</a>
          <a href={`mailto:${r.email}?subject=Your course request ${r.reference}`} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-300">Email {r.email}</a>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <h2 className="font-bold text-gray-900">Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STEPS.map((s) => (
            <form key={s.status} action={setCourseRequestStatus}>
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="status" value={s.status} />
              <button disabled={r.status === s.status} className="w-full px-3 py-2.5 rounded-lg text-sm font-semibold bg-accent-600 text-white disabled:bg-accent-100 disabled:text-accent-800">
                {r.status === s.status ? `✓ ${s.label}` : s.label}
              </button>
            </form>
          ))}
        </div>
      </section>

      <form action={saveCourseRequestNotes} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <h2 className="font-bold text-gray-900">Your notes</h2>
        <input type="hidden" name="id" value={r.id} />
        <textarea name="adminNotes" rows={3} defaultValue={r.adminNotes || ''} className="w-full px-3 py-2.5 rounded-xl border border-gray-300" placeholder="For example the fee agreed and how they paid" />
        <button className="px-4 py-2.5 rounded-xl font-semibold text-sm border border-gray-300">Save notes</button>
      </form>
    </div>
  )
}
