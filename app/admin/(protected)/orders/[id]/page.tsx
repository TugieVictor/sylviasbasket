import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ORDER_STATUS_LABELS, orderStatusBadge } from '@/lib/orders'
import { cancelOrderAction, saveOrderNotes, setOrderStatus } from '../actions'

export const dynamic = 'force-dynamic'

const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`
const when = (d: Date) => d.toLocaleString('en-GB', { timeZone: 'Africa/Nairobi', dateStyle: 'medium', timeStyle: 'short' })
const DONE: Record<string, string> = { updated: 'Order updated.', emailed: 'Order updated and the customer was emailed.', cancelled: 'Order cancelled and items put back in stock.', notes: 'Notes saved.' }

export default async function AdminOrderPage({ params, searchParams }: { params: { id: string }; searchParams: { done?: string; error?: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, payments: { orderBy: { createdAt: 'desc' } } },
  })
  if (!order) notFound()

  const paidStage = ['PAID', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status)
  const steps = [
    { status: 'PACKED', label: 'Mark as packed', email: false },
    { status: 'OUT_FOR_DELIVERY', label: order.isPickup ? 'Ready to collect' : 'Out for delivery', email: true },
    { status: 'DELIVERED', label: order.isPickup ? 'Collected' : 'Delivered', email: true },
  ]
  const phone = `+${order.customerPhone}`
  const wasPaid = order.payments.some((p) => p.status === 'COMPLETED')

  return (
    <div className="space-y-5 max-w-3xl">
      <Link href="/admin/orders/" className="text-sm text-accent-700 underline">← All orders</Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Order {order.reference}</h1>
        <span className={orderStatusBadge(order.status)}>{ORDER_STATUS_LABELS[order.status]}</span>
      </div>
      <p className="text-sm text-gray-500">Placed {when(order.createdAt)}</p>
      {searchParams.done && <p role="status" className="bg-accent-50 border border-accent-200 text-accent-800 rounded-xl px-4 py-3 text-sm">{DONE[searchParams.done] || 'Saved.'}</p>}
      {searchParams.error && <p role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">{searchParams.error}</p>}
      {order.adminNotes?.includes('stock was short') && (
        <p className="bg-harvest-50 border border-harvest-300 text-harvest-900 rounded-xl px-4 py-3 text-sm font-semibold">Check stock: this order was paid after its hold ran out and some items had sold out.</p>
      )}

      <section className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-900">Customer</h2>
        <p className="mt-2 font-semibold text-gray-900">{order.customerName}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <a href={`tel:${phone}`} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-300">Call {phone}</a>
          <a href={`https://wa.me/${order.customerPhone}`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-300">WhatsApp</a>
          {order.customerEmail && <a href={`mailto:${order.customerEmail}?subject=Your order ${order.reference}`} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-300">Email</a>}
        </div>
        <dl className="mt-4 text-sm space-y-2">
          <div><dt className="inline text-gray-500">{order.isPickup ? 'Collection: ' : `Delivery (${order.deliveryZoneName}): `}</dt><dd className="inline text-gray-900">{order.isPickup ? 'From the farm' : order.address}</dd></div>
          {order.notes && <div><dt className="inline text-gray-500">Customer notes: </dt><dd className="inline text-gray-900">{order.notes}</dd></div>}
        </dl>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-900">Items</h2>
        <ul className="mt-3 divide-y divide-gray-100">
          {order.items.map((i) => (
            <li key={i.id} className="py-2.5 flex justify-between gap-4 text-sm">
              <span><span className="font-bold">{i.quantity} ×</span> {i.productName}{i.variantLabel.toLowerCase() !== 'standard' ? ` (${i.variantLabel})` : ''} <span className="text-gray-500">at {kes(i.unitPriceKes)}</span></span>
              <span className="font-semibold whitespace-nowrap">{kes(i.lineTotalKes)}</span>
            </li>
          ))}
        </ul>
        <dl className="border-t border-gray-200 pt-3 text-sm space-y-1">
          <div className="flex justify-between"><dt className="text-gray-600">Subtotal</dt><dd>{kes(order.subtotalKes)}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-600">{order.isPickup ? 'Collection' : 'Delivery'}</dt><dd>{order.deliveryFeeKes ? kes(order.deliveryFeeKes) : 'Free'}</dd></div>
          <div className="flex justify-between font-bold"><dt>Total</dt><dd>{kes(order.totalKes)}</dd></div>
        </dl>
      </section>

      {paidStage && (
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <h2 className="font-bold text-gray-900">Update progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {steps.map((s) => (
              <form key={s.status} action={setOrderStatus} className={`rounded-xl border p-3 space-y-2 ${order.status === s.status ? 'border-accent-500 bg-accent-50' : 'border-gray-200'}`}>
                <input type="hidden" name="id" value={order.id} />
                <input type="hidden" name="status" value={s.status} />
                {s.email && order.customerEmail && (
                  <label className="flex items-center gap-2 text-xs text-gray-700"><input type="checkbox" name="sendEmail" defaultChecked /> Email the customer</label>
                )}
                {s.status === 'OUT_FOR_DELIVERY' && !order.isPickup && (
                  <input name="note" className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs" placeholder="Courier or rider details (optional)" />
                )}
                <button disabled={order.status === s.status} className="w-full px-3 py-2.5 rounded-lg text-sm font-semibold bg-accent-600 text-white disabled:bg-accent-100 disabled:text-accent-800">
                  {order.status === s.status ? `✓ ${s.label}` : s.label}
                </button>
              </form>
            ))}
          </div>
        </section>
      )}

      <section className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-900">Payments</h2>
        {order.payments.length === 0 ? (
          <p className="text-sm text-gray-600 mt-2">No payment attempts yet.</p>
        ) : (
          <ul className="mt-2 text-sm divide-y divide-gray-100">
            {order.payments.map((p) => (
              <li key={p.id} className="py-2 flex flex-wrap justify-between gap-2">
                <span>{p.reference}{p.providerTxnId ? ` · iPay ${p.providerTxnId}` : ''}</span>
                <span className={p.status === 'COMPLETED' ? 'text-accent-700 font-semibold' : p.status === 'REVIEW' ? 'text-harvest-700 font-semibold' : 'text-gray-500'}>
                  {p.status === 'COMPLETED' ? `Paid ${kes(p.amountKes)}` : p.status === 'REVIEW' ? 'Amount did not match: check in iPay' : p.status.toLowerCase()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form action={saveOrderNotes} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <h2 className="font-bold text-gray-900">Your notes</h2>
        <p className="text-xs text-gray-500">Only you see these. For example courier details or what the customer asked for.</p>
        <input type="hidden" name="id" value={order.id} />
        <textarea name="adminNotes" rows={3} defaultValue={order.adminNotes || ''} className="w-full px-3 py-2.5 rounded-xl border border-gray-300" />
        <button className="px-4 py-2.5 rounded-xl font-semibold text-sm border border-gray-300">Save notes</button>
      </form>

      {!['CANCELLED', 'EXPIRED', 'DELIVERED'].includes(order.status) && (
        <form action={cancelOrderAction} className="bg-white rounded-2xl border border-red-200 p-5 space-y-3">
          <h2 className="font-bold text-red-800">Cancel this order</h2>
          <p className="text-sm text-gray-600">
            The items go back into stock.{wasPaid ? ' The customer has paid, so please refund them yourself through iPay or M-Pesa, and let them know.' : ''}
          </p>
          <input type="hidden" name="id" value={order.id} />
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" name="confirm" /> Yes, cancel order {order.reference}</label>
          <button className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-red-700 text-white">Cancel order</button>
        </form>
      )}
    </div>
  )
}
