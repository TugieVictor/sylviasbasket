import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate, statusBadge, toDateOnly, VISIT_STATUS_LABELS } from '@/lib/visits'
import { confirmVisit, declineVisit, saveVisitNotes, setVisitStatus } from '../actions'

export const dynamic = 'force-dynamic'

const DONE_MESSAGES: Record<string, string> = {
  'confirmed-emailed': 'Visit confirmed and email sent.',
  confirmed: 'Visit confirmed. No email was sent.',
  declined: 'Visit declined.',
  updated: 'Status updated.',
  notes: 'Notes saved.',
}

const button = 'px-4 py-2.5 rounded-xl font-semibold text-sm'
const input = 'w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-accent-600 outline-none'

export default async function AdminVisitPage({ params, searchParams }: { params: { id: string }; searchParams: { done?: string; error?: string } }) {
  const visit = await prisma.visitRequest.findUnique({
    where: { id: params.id },
    include: { payments: { orderBy: { createdAt: 'desc' } } },
  })
  if (!visit) notFound()

  const rows: [string, string][] = [
    ['Reference', visit.reference],
    ['Visit type', visit.visitTypeName],
    ['People', String(visit.groupSize)],
    ['Preferred date', formatDate(visit.preferredDate1)],
    ['Second choice', visit.preferredDate2 ? formatDate(visit.preferredDate2) : '—'],
    ['Confirmed date', visit.confirmedDate ? formatDate(visit.confirmedDate) : '—'],
    ['Fee', visit.feeKes != null ? `KES ${visit.feeKes.toLocaleString('en-KE')}` : '—'],
    ['Phone', visit.phone],
    ['Email', visit.email || 'Not given'],
    ['Organisation', visit.organisation || '—'],
    ['Received', visit.createdAt.toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })],
  ]

  return (
    <div className="space-y-6">
      <Link href="/admin/visits/" className="text-sm text-accent-700 underline">← All visits</Link>

      {searchParams.done && DONE_MESSAGES[searchParams.done] && (
        <p role="status" className="bg-accent-50 border border-accent-200 text-accent-800 rounded-xl px-4 py-3 text-sm">{DONE_MESSAGES[searchParams.done]}</p>
      )}
      {searchParams.error && (
        <p role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">{searchParams.error}</p>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-display font-bold text-gray-900">{visit.name}</h1>
          <span className={statusBadge(visit.status)}>{VISIT_STATUS_LABELS[visit.status]}</span>
        </div>
        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between sm:block py-2 border-b border-gray-100">
              <dt className="text-sm text-gray-500">{label}</dt>
              <dd className="text-sm font-semibold text-gray-900">
                {label === 'Phone' ? <a href={`tel:+${value}`} className="underline">+{value}</a> : value}
              </dd>
            </div>
          ))}
        </dl>
        {visit.message && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Message</p>
            <p className="text-sm text-gray-900 whitespace-pre-wrap mt-1">{visit.message}</p>
          </div>
        )}
      </div>

      {(visit.status === 'REQUESTED' || visit.status === 'CONFIRMED') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form action={confirmVisit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">{visit.status === 'CONFIRMED' ? 'Change date or fee' : 'Confirm this visit'}</h2>
            <input type="hidden" name="id" value={visit.id} />
            <div>
              <label htmlFor="confirmedDate" className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
              <input id="confirmedDate" name="confirmedDate" type="date" required defaultValue={toDateOnly(visit.confirmedDate || visit.preferredDate1)} className={input} />
              <p className="text-xs text-gray-500 mt-1">Their first choice is filled in. Change it if you agreed another date.</p>
            </div>
            <div>
              <label htmlFor="feeKes" className="block text-sm font-semibold text-gray-700 mb-1">Fee (KES)</label>
              <input id="feeKes" name="feeKes" type="number" min={0} required defaultValue={visit.feeKes ?? 0} className={input} />
              <p className="text-xs text-gray-500 mt-1">Enter 0 if there is no fee.</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="sendEmail" defaultChecked={!!visit.email} disabled={!visit.email} />
              {visit.email ? 'Email the visitor the confirmation and payment link' : 'No email address: call or text them instead'}
            </label>
            <button type="submit" className={`${button} bg-accent-600 text-white w-full`}>Confirm visit</button>
          </form>

          <form action={declineVisit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Decline this visit</h2>
            <input type="hidden" name="id" value={visit.id} />
            <div>
              <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-1">Message to the visitor (optional)</label>
              <textarea id="reason" name="reason" rows={4} className={input} placeholder="For example: We are fully booked that week. Could you try a date in March?" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="sendEmail" defaultChecked={!!visit.email} disabled={!visit.email} />
              {visit.email ? 'Email the visitor' : 'No email address: call or text them instead'}
            </label>
            <button type="submit" className={`${button} bg-white border border-red-300 text-red-700 w-full`}>Decline visit</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Other actions</h2>
        <div className="flex flex-wrap gap-3">
          {(visit.status === 'PAID' || (visit.status === 'CONFIRMED' && !visit.feeKes)) && (
            <form action={setVisitStatus}>
              <input type="hidden" name="id" value={visit.id} />
              <input type="hidden" name="status" value="COMPLETED" />
              <button className={`${button} bg-sage-900 text-white`}>Mark visit as done</button>
            </form>
          )}
          {visit.status === 'CONFIRMED' && (visit.feeKes || 0) > 0 && (
            <form action={setVisitStatus}>
              <input type="hidden" name="id" value={visit.id} />
              <input type="hidden" name="status" value="PAID" />
              <button className={`${button} bg-white border border-gray-300 text-gray-800`}>Mark as paid (paid another way)</button>
            </form>
          )}
          {!['CANCELLED', 'COMPLETED', 'DECLINED'].includes(visit.status) && (
            <form action={setVisitStatus}>
              <input type="hidden" name="id" value={visit.id} />
              <input type="hidden" name="status" value="CANCELLED" />
              <button className={`${button} bg-white border border-gray-300 text-gray-800`}>Cancel visit</button>
            </form>
          )}
          {['CANCELLED', 'DECLINED'].includes(visit.status) && (
            <form action={setVisitStatus}>
              <input type="hidden" name="id" value={visit.id} />
              <input type="hidden" name="status" value="REQUESTED" />
              <button className={`${button} bg-white border border-gray-300 text-gray-800`}>Reopen request</button>
            </form>
          )}
        </div>
        {visit.status === 'CONFIRMED' && (visit.feeKes || 0) > 0 && (
          <p className="text-sm text-gray-600">
            Payment link for the visitor:{' '}
            <span className="font-mono break-all">/farm-visits/pay/{visit.reference}/</span>
          </p>
        )}

        <form action={saveVisitNotes} className="space-y-2 pt-2 border-t border-gray-100">
          <input type="hidden" name="id" value={visit.id} />
          <label htmlFor="adminNotes" className="block text-sm font-semibold text-gray-700">Private notes</label>
          <textarea id="adminNotes" name="adminNotes" rows={3} defaultValue={visit.adminNotes || ''} className={input} />
          <button className={`${button} bg-white border border-gray-300 text-gray-800`}>Save notes</button>
        </form>
      </div>

      {visit.payments.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900">Payments</h2>
          <ul className="mt-3 divide-y divide-gray-100">
            {visit.payments.map((p) => (
              <li key={p.id} className="py-2 text-sm flex flex-wrap justify-between gap-2">
                <span>{p.reference} · KES {p.amountKes.toLocaleString('en-KE')}</span>
                <span className="font-semibold">{p.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
