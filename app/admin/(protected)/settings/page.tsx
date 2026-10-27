import { getIPayConfig } from '@/lib/payments/ipay'
import TestPayment from './TestPayment'
import { getSetting } from '@/lib/settings'
import { checkoutEnabled } from '@/lib/shop'
import { saveWhatsappNumber } from './actions'

export const dynamic = 'force-dynamic'

export default async function SettingsPage({ searchParams }: { searchParams: { done?: string; error?: string } }) {
  const config = getIPayConfig()
  const whatsapp = await getSetting('whatsappNumber')
  const mode = !config.enabled ? 'Not set up' : config.demo ? 'Demo (iPay test account)' : config.live ? 'Live payments' : 'Test mode'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Settings</h1>
      {searchParams.done && <p role="status" className="bg-accent-50 border border-accent-200 text-accent-800 rounded-xl px-4 py-3 text-sm">Saved.</p>}
      {searchParams.error && <p role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">{searchParams.error}</p>}

      <form action={saveWhatsappNumber} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-lg font-bold text-gray-900">WhatsApp number for shop orders</h2>
        <p className="text-sm text-gray-600">
          {checkoutEnabled()
            ? 'Online payment is switched on, so customers check out on the website. This number is still used for questions.'
            : 'Online payment is not set up yet, so customers send their order to this number on WhatsApp.'}
        </p>
        <div className="flex flex-wrap gap-3 items-end">
          <input name="whatsappNumber" type="tel" defaultValue={`0${whatsapp.slice(3)}`} className="px-3 py-2.5 rounded-xl border border-gray-300 w-56" aria-label="WhatsApp number" />
          <button className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-accent-600 text-white">Save number</button>
        </div>
      </form>

      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900">Payments (iPay)</h2>
        <p className="text-gray-700 mt-1">Status: <span className="font-semibold">{mode}</span></p>
        <p className="text-sm text-gray-600 mt-1">
          Delivery fees are under Delivery, visit types under Farm visits, and courses under Courses.
        </p>
        {config.enabled && <TestPayment />}
      </section>
    </div>
  )
}
