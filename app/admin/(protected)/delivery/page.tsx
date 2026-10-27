import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { saveDeliveryZone } from '../orders/actions'

export const dynamic = 'force-dynamic'

const input = 'w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-accent-600 outline-none'

type Zone = { id: string; name: string; feeKes: number; isPickup: boolean; active: boolean; sortOrder: number }

function ZoneForm({ zone }: { zone?: Zone }) {
  return (
    <form action={saveDeliveryZone} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      <input type="hidden" name="id" value={zone?.id || ''} />
      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name customers see</label>
          <input name="name" required defaultValue={zone?.name} className={input} placeholder="e.g. Nairobi CBD" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Fee (KES, 0 = free)</label>
          <input name="feeKes" type="number" min={0} required defaultValue={zone?.feeKes ?? 0} className={input} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
          <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={zone ? zone.active : true} /> Offered at checkout</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="isPickup" defaultChecked={zone?.isPickup} /> Collect from the farm (no address needed)</label>
          <label className="flex items-center gap-2">Position <input name="sortOrder" type="number" defaultValue={zone?.sortOrder ?? 0} className="w-16 px-2 py-1 rounded-lg border border-gray-300" /></label>
        </div>
        <button className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-accent-600 text-white">{zone ? 'Save' : 'Add option'}</button>
      </div>
    </form>
  )
}

export default async function DeliveryPage({ searchParams }: { searchParams: { done?: string; error?: string } }) {
  const zones = await prisma.deliveryZone.findMany({ orderBy: { sortOrder: 'asc' } })
  return (
    <div className="space-y-5 max-w-3xl">
      <Link href="/admin/orders/" className="text-sm text-accent-700 underline">← Orders</Link>
      <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Delivery options and fees</h1>
      <p className="text-gray-600">Customers choose one of these at checkout. The fee is added to their order. Changes apply to new orders only.</p>
      {searchParams.done && <p role="status" className="bg-accent-50 border border-accent-200 text-accent-800 rounded-xl px-4 py-3 text-sm">Saved.</p>}
      {searchParams.error && <p role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">{searchParams.error}</p>}
      {zones.map((z) => <ZoneForm key={z.id} zone={z} />)}
      <h2 className="text-lg font-bold text-gray-900 pt-4">Add a delivery option</h2>
      <ZoneForm />
    </div>
  )
}
