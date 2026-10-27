import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { describeWeekdays, earliestVisitDate } from '@/lib/visits'
import VisitRequestForm from './VisitRequestForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Farm Visits',
  description: "Request a visit to Sylvia's Basket farm in Limuru for individuals, groups and schools.",
}

export default async function FarmVisitsPage() {
  const types = await prisma.visitType.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } })
  const options = types.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    feeKes: t.feeKes,
    maxGroupSize: t.maxGroupSize,
    weekdays: t.weekdays,
    days: describeWeekdays(t.weekdays),
    minNoticeDays: t.minNoticeDays,
    earliestDate: earliestVisitDate(t),
  }))

  return (
    <>
      <section className="relative overflow-hidden bg-sage-900">
        <div aria-hidden="true" className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-accent-500/25 rounded-full blur-3xl"></div>
        <div aria-hidden="true" className="absolute -bottom-24 -right-24 w-[26rem] h-[26rem] bg-harvest-500/20 rounded-full blur-3xl"></div>
        <div className="container-custom relative z-10 pt-36 pb-20 text-center">
          <p className="text-kicker text-white/70">Learn &amp; Visit</p>
          <h1 className="text-hero text-white mt-3">Visit the farm</h1>
          <p className="text-body-lg text-white/85 mt-6 max-w-2xl mx-auto">
            See organic farming and agroecology in practice. Individuals, groups and schools are welcome. Send a
            request below and Sylvia will confirm your date.
          </p>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-earth-50 via-white to-harvest-50">
        <div className="container-custom">
          {options.length === 0 ? (
            <div className="max-w-xl mx-auto text-center bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-display font-bold text-gray-900">Visit requests are not open yet</h2>
              <p className="text-gray-700 mt-3">Please contact us to arrange a visit.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-display font-bold text-gray-900">Types of visit</h2>
                {options.map((t) => (
                  <div key={t.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display font-bold text-gray-900">{t.name}</h3>
                      <p className="font-bold text-accent-700 whitespace-nowrap">
                        {t.feeKes > 0 ? `KES ${t.feeKes.toLocaleString('en-KE')}` : 'Free'}
                      </p>
                    </div>
                    {t.description && <p className="text-sm text-gray-600 mt-1">{t.description}</p>}
                    <ul className="text-sm text-gray-600 mt-3 space-y-1">
                      <li>Up to {t.maxGroupSize} people</li>
                      <li>{t.days}</li>
                      <li>At least {t.minNoticeDays} days' notice</li>
                    </ul>
                  </div>
                ))}
                <p className="text-sm text-gray-600">
                  Fees are paid online after Sylvia confirms your visit.
                </p>
              </div>
              <div className="lg:col-span-3">
                <VisitRequestForm types={options} />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
