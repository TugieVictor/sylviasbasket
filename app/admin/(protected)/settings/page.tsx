import { getIPayConfig } from '@/lib/payments/ipay'
import TestPayment from './TestPayment'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const config = getIPayConfig()
  const mode = !config.enabled ? 'Not set up' : config.demo ? 'Demo (iPay test account)' : config.live ? 'Live payments' : 'Test mode'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Settings</h1>

      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900">Payments (iPay)</h2>
        <p className="text-gray-700 mt-1">Status: <span className="font-semibold">{mode}</span></p>
        <p className="text-sm text-gray-600 mt-1">
          Delivery zones, visit types and other shop settings will be managed here in the next stages.
        </p>
        {config.enabled && <TestPayment />}
      </section>
    </div>
  )
}
