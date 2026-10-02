import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Payment status', robots: { index: false } }

const messages = {
  COMPLETED: { title: 'Payment received', text: 'Thank you. Your payment has been confirmed.', tone: 'text-accent-700' },
  PENDING: { title: 'Payment being confirmed', text: 'We are waiting for confirmation from iPay. This usually takes a minute. Refresh this page to check again.', tone: 'text-harvest-700' },
  REVIEW: { title: 'Payment needs checking', text: 'We received a payment that does not match the amount due. We will contact you shortly.', tone: 'text-harvest-700' },
  FAILED: { title: 'Payment not completed', text: 'The payment did not go through. No money was taken. You can try again.', tone: 'text-red-700' },
  CANCELLED: { title: 'Payment cancelled', text: 'The payment was cancelled.', tone: 'text-red-700' },
} as const

export default async function PaymentStatusPage({ params }: { params: { reference: string } }) {
  const payment = await prisma.payment.findUnique({
    where: { reference: params.reference },
    select: { reference: true, status: true, amountKes: true, purpose: true },
  })
  const message = payment ? messages[payment.status] : null

  return (
    <section className="min-h-[70svh] flex items-center bg-gradient-to-br from-earth-50 via-primary-50 to-harvest-50 pt-32 pb-20">
      <div className="container-custom">
        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
          {payment && message ? (
            <>
              <h1 className={`text-2xl md:text-3xl font-display font-bold ${message.tone}`}>{message.title}</h1>
              <p className="text-gray-700 mt-3">{message.text}</p>
              <dl className="mt-6 text-sm text-gray-600 space-y-1">
                <div><dt className="inline font-semibold">Reference: </dt><dd className="inline">{payment.reference}</dd></div>
                <div><dt className="inline font-semibold">Amount: </dt><dd className="inline">KES {payment.amountKes.toLocaleString('en-KE')}</dd></div>
              </dl>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-display font-bold text-gray-900">Payment not found</h1>
              <p className="text-gray-700 mt-3">We could not find this payment. Please contact us if money was taken.</p>
            </>
          )}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="bg-gradient-to-r from-accent-600 to-sage-600 text-white px-6 py-3 rounded-full font-semibold">Back to home</Link>
            <Link href="/get-involved/#contact-section" className="border border-gray-300 text-gray-800 px-6 py-3 rounded-full font-semibold">Contact us</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
