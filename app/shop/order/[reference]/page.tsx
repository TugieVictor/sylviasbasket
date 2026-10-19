import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiCheck } from 'react-icons/fi'
import { prisma } from '@/lib/prisma'
import { releaseExpiredOrders } from '@/lib/orders'
import PayOrderButton from './PayOrderButton'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Your order', robots: { index: false } }

const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`
const steps = ['PAID', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const

export default async function OrderPage({ params }: { params: { reference: string } }) {
  await releaseExpiredOrders()
  const order = await prisma.order.findUnique({
    where: { reference: params.reference.slice(0, 40) },
    include: { items: true, payments: { orderBy: { createdAt: 'desc' }, take: 1 } },
  })
  if (!order) notFound()

  const lastPayment = order.payments[0]
  const minutesLeft = order.stockHeldUntil ? Math.max(0, Math.ceil((order.stockHeldUntil.getTime() - Date.now()) / 60000)) : 0
  const paid = (steps as readonly string[]).includes(order.status)
  const stepLabels = { PAID: 'Paid', PACKED: 'Packed', OUT_FOR_DELIVERY: order.isPickup ? 'Ready to collect' : 'On the way', DELIVERED: order.isPickup ? 'Collected' : 'Delivered' }
  const current = steps.indexOf(order.status as (typeof steps)[number])

  let heading = 'Your order'
  let message = ''
  if (paid) {
    heading = 'Thank you for your order'
    message = order.isPickup
      ? 'Your payment is confirmed. We will call you when your order is ready to collect from the farm.'
      : 'Your payment is confirmed. We will call you to arrange delivery.'
  } else if (order.status === 'AWAITING_PAYMENT') {
    heading = lastPayment?.status === 'PENDING' && lastPayment.providerCode ? 'Payment being confirmed' : 'Waiting for payment'
    message =
      lastPayment?.status === 'FAILED'
        ? 'The payment did not go through and no money was taken. You can try again below.'
        : lastPayment?.status === 'REVIEW'
          ? 'We received a payment that does not match the order total. We will contact you shortly.'
          : `Your items are held for you for ${minutesLeft} more ${minutesLeft === 1 ? 'minute' : 'minutes'}. Pay now to complete your order.`
  } else if (order.status === 'EXPIRED') {
    heading = 'This order has expired'
    message = 'It was not paid within 60 minutes, so the items were released. No money was taken. You are welcome to order again.'
  } else if (order.status === 'CANCELLED') {
    heading = 'This order was cancelled'
    message = 'Please contact us if you have any questions.'
  }

  return (
    <>
      <section className="relative overflow-hidden bg-sage-900">
        <div aria-hidden="true" className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-accent-500/25 rounded-full blur-3xl"></div>
        <div className="container-custom relative z-10 pt-32 pb-12 md:pt-36 md:pb-16 text-center">
          <p className="text-kicker text-white/70">Order {order.reference}</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-3">{heading}</h1>
          <p className="text-body-lg text-white/85 mt-4 max-w-2xl mx-auto">{message}</p>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-earth-50 via-white to-harvest-50">
        <div className="container-custom max-w-3xl space-y-6">
          {paid && (
            <ol className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 grid grid-cols-4 gap-2" aria-label="Order progress">
              {steps.map((step, index) => {
                const done = index <= current
                return (
                  <li key={step} className="flex flex-col items-center text-center gap-2">
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center ${done ? 'bg-accent-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {done ? <FiCheck /> : index + 1}
                    </span>
                    <span className={`text-xs sm:text-sm font-semibold ${done ? 'text-gray-900' : 'text-gray-400'}`}>{stepLabels[step]}</span>
                  </li>
                )
              })}
            </ol>
          )}

          {order.status === 'AWAITING_PAYMENT' && lastPayment?.status !== 'REVIEW' && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 text-center">
              <PayOrderButton reference={order.reference} totalLabel={kes(order.totalKes)} />
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-display font-bold text-gray-900">Order details</h2>
            <ul className="mt-4 divide-y divide-gray-100">
              {order.items.map((item) => (
                <li key={item.id} className="py-3 flex justify-between gap-4 text-sm">
                  <span className="text-gray-800">
                    {item.quantity} × {item.productName}
                    {item.variantLabel.toLowerCase() !== 'standard' && <span className="text-gray-500"> ({item.variantLabel})</span>}
                  </span>
                  <span className="font-semibold text-gray-900 whitespace-nowrap">{kes(item.lineTotalKes)}</span>
                </li>
              ))}
            </ul>
            <dl className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-600">Subtotal</dt><dd className="font-semibold">{kes(order.subtotalKes)}</dd></div>
              <div className="flex justify-between">
                <dt className="text-gray-600">{order.isPickup ? 'Collection from the farm' : `Delivery (${order.deliveryZoneName})`}</dt>
                <dd className="font-semibold">{order.deliveryFeeKes ? kes(order.deliveryFeeKes) : 'Free'}</dd>
              </div>
              <div className="flex justify-between text-lg pt-2 border-t border-gray-100"><dt className="font-bold">Total</dt><dd className="font-bold">{kes(order.totalKes)}</dd></div>
            </dl>
            {!order.isPickup && order.address && (
              <p className="text-sm text-gray-600 mt-4"><span className="font-semibold text-gray-800">Deliver to: </span>{order.address}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop/" className="text-center bg-gradient-to-r from-accent-600 to-sage-600 text-white px-6 py-3 rounded-full font-semibold">
              {order.status === 'EXPIRED' ? 'Shop again' : 'Back to the shop'}
            </Link>
            <Link href="/get-involved/#contact-section" className="text-center border border-gray-300 bg-white text-gray-800 px-6 py-3 rounded-full font-semibold">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
