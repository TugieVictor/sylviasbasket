import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/visits'
import PayVisitForm from './PayVisitForm'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Pay for your farm visit', robots: { index: false } }

export default async function PayVisitPage({ params }: { params: { reference: string } }) {
  const visit = await prisma.visitRequest.findUnique({ where: { reference: params.reference } })

  let content: React.ReactNode
  if (!visit) {
    content = <p className="text-gray-700">We could not find this visit. Please check the link in your email.</p>
  } else if (visit.status === 'PAID' || visit.status === 'COMPLETED') {
    content = <p className="text-accent-700 font-semibold">This visit has been paid. Thank you, see you at the farm!</p>
  } else if (visit.status !== 'CONFIRMED' || !visit.feeKes) {
    content = <p className="text-gray-700">This visit is not ready for payment yet. Sylvia will contact you once it is confirmed.</p>
  } else {
    content = (
      <>
        <dl className="text-left divide-y divide-gray-100 border-y border-gray-100 my-6">
          {[
            ['Reference', visit.reference],
            ['Visit', visit.visitTypeName],
            ['Date', visit.confirmedDate ? formatDate(visit.confirmedDate) : 'To be confirmed'],
            ['People', String(visit.groupSize)],
            ['Fee', `KES ${visit.feeKes.toLocaleString('en-KE')}`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-2 text-sm">
              <dt className="text-gray-600">{label}</dt>
              <dd className="font-semibold text-gray-900 text-right">{value}</dd>
            </div>
          ))}
        </dl>
        <PayVisitForm reference={visit.reference} phone={visit.phone} email={visit.email || ''} />
      </>
    )
  }

  return (
    <section className="min-h-[80svh] bg-gradient-to-br from-earth-50 via-primary-50 to-harvest-50 pt-36 pb-20">
      <div className="container-custom">
        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Your farm visit</h1>
          <div className="mt-4">{content}</div>
          <Link href="/farm-visits/" className="inline-block mt-6 text-sm text-accent-700 underline">Back to Farm Visits</Link>
        </div>
      </div>
    </section>
  )
}
