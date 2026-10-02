import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { WEEKDAY_NAMES, parseWeekdays } from '@/lib/visits'
import { saveVisitType } from '../actions'

export const dynamic = 'force-dynamic'

const input = 'w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-accent-600 outline-none'

type TypeRow = { id: string; name: string; description: string | null; feeKes: number; maxGroupSize: number; weekdays: string; minNoticeDays: number; active: boolean; sortOrder: number }

function TypeForm({ type }: { type?: TypeRow }) {
  const days = parseWeekdays(type?.weekdays || '1,2,3,4,5')
  return (
    <form action={saveVisitType} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <input type="hidden" name="id" value={type?.id || ''} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
          <input name="name" required defaultValue={type?.name} className={input} placeholder="e.g. School" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Fee (KES, 0 = free)</label>
          <input name="feeKes" type="number" min={0} required defaultValue={type?.feeKes ?? 0} className={input} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Largest group</label>
          <input name="maxGroupSize" type="number" min={1} required defaultValue={type?.maxGroupSize ?? 10} className={input} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Days of notice needed</label>
          <input name="minNoticeDays" type="number" min={0} required defaultValue={type?.minNoticeDays ?? 7} className={input} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Short description (optional)</label>
        <input name="description" defaultValue={type?.description || ''} className={input} />
      </div>
      <fieldset>
        <legend className="block text-sm font-semibold text-gray-700 mb-2">Days visits are possible</legend>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5, 6, 0].map((d) => (
            <label key={d} className="flex items-center gap-1.5 text-sm text-gray-700">
              <input type="checkbox" name="weekdays" value={d} defaultChecked={days.includes(d)} />
              {WEEKDAY_NAMES[d].slice(0, 3)}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name="active" defaultChecked={type ? type.active : true} /> Shown on the website
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            Order <input name="sortOrder" type="number" defaultValue={type?.sortOrder ?? 0} className="w-16 px-2 py-1 rounded-lg border border-gray-300" />
          </label>
        </div>
        <button className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-accent-600 text-white">{type ? 'Save' : 'Add visit type'}</button>
      </div>
    </form>
  )
}

export default async function VisitTypesPage({ searchParams }: { searchParams: { done?: string; error?: string } }) {
  const types = await prisma.visitType.findMany({ orderBy: { sortOrder: 'asc' } })
  return (
    <div className="space-y-5">
      <Link href="/admin/visits/" className="text-sm text-accent-700 underline">← Farm visits</Link>
      <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Visit types and fees</h1>
      <p className="text-gray-600">These appear on the Farm Visits page. Changes show on the website straight away.</p>
      {searchParams.done && <p role="status" className="bg-accent-50 border border-accent-200 text-accent-800 rounded-xl px-4 py-3 text-sm">Saved.</p>}
      {searchParams.error && <p role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">{searchParams.error}</p>}
      {types.map((t) => <TypeForm key={t.id} type={t} />)}
      <h2 className="text-lg font-bold text-gray-900 pt-4">Add a new visit type</h2>
      <TypeForm />
    </div>
  )
}
