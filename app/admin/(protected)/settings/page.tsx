import { getIPayConfig } from '@/lib/payments/ipay'
import TestPayment from './TestPayment'
import { getSetting } from '@/lib/settings'
import { checkoutEnabled } from '@/lib/shop'
import { addAdmin, changeMyPassword, saveWhatsappNumber, setAdminAccess } from './actions'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export default async function SettingsPage({ searchParams }: { searchParams: { done?: string; error?: string } }) {
  const config = getIPayConfig()
  const whatsapp = await getSetting('whatsappNumber')
  const me = await getCurrentAdmin()
  const admins = await prisma.adminUser.findMany({ orderBy: { createdAt: 'asc' }, select: { id: true, name: true, email: true, active: true, lastLoginAt: true } })
  const DONE: Record<string, string> = {
    whatsapp: 'WhatsApp number saved.',
    password: 'Your password has been changed. Any other phone or computer you were signed in on will need the new password.',
    'admin-added': 'Admin login created. Give them the temporary password in person or by phone, and ask them to change it here after signing in.',
    'admin-on': 'Access switched on.',
    'admin-off': 'Access switched off. They have been signed out.',
  }
  const mode = !config.enabled ? 'Not set up' : config.demo ? 'Demo (iPay test account)' : config.live ? 'Live payments' : 'Test mode'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Settings</h1>
      {searchParams.done && <p role="status" className="bg-accent-50 border border-accent-200 text-accent-800 rounded-xl px-4 py-3 text-sm">{DONE[searchParams.done] || 'Saved.'}</p>}
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

      <form action={changeMyPassword} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-lg font-bold text-gray-900">Change my password</h2>
        <p className="text-sm text-gray-600">Signed in as {me?.name} ({me?.email}). Use at least 10 characters. A short sentence is easy to remember and hard to guess.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="text-sm font-semibold text-gray-700">Current password<input name="currentPassword" type="password" required autoComplete="current-password" className="w-full px-3 py-2.5 rounded-xl border border-gray-300" /></label>
          <label className="text-sm font-semibold text-gray-700">New password<input name="newPassword" type="password" required minLength={10} autoComplete="new-password" className="w-full px-3 py-2.5 rounded-xl border border-gray-300" /></label>
          <label className="text-sm font-semibold text-gray-700">New password again<input name="repeatPassword" type="password" required minLength={10} autoComplete="new-password" className="w-full px-3 py-2.5 rounded-xl border border-gray-300" /></label>
        </div>
        <button className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-accent-600 text-white">Change password</button>
      </form>

      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">People who can use the admin</h2>
          <p className="text-sm text-gray-600">Untick and save to switch off someone&apos;s access, for example when they leave. Their details are kept.</p>
        </div>
        <ul className="divide-y divide-gray-100">
          {admins.map((a) => (
            <li key={a.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className={`font-semibold ${a.active ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{a.name}{a.id === me?.id ? ' (you)' : ''}</p>
                <p className="text-xs text-gray-500">{a.email} · {a.lastLoginAt ? `last signed in ${a.lastLoginAt.toLocaleDateString('en-GB', { timeZone: 'Africa/Nairobi' })}` : 'not signed in yet'}</p>
              </div>
              {a.id !== me?.id && (
                <form action={setAdminAccess} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={a.id} />
                  <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" name="active" defaultChecked={a.active} /> Has access</label>
                  <button className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-300">Save</button>
                </form>
              )}
            </li>
          ))}
        </ul>
        <form action={addAdmin} className="border-t border-gray-100 pt-4 space-y-3">
          <h3 className="font-semibold text-gray-900">Add someone</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-sm font-semibold text-gray-700">Name<input name="name" required className="w-full px-3 py-2.5 rounded-xl border border-gray-300" /></label>
            <label className="text-sm font-semibold text-gray-700">Email<input name="email" type="email" required className="w-full px-3 py-2.5 rounded-xl border border-gray-300" /></label>
            <label className="text-sm font-semibold text-gray-700">Temporary password<input name="password" type="text" required minLength={10} autoComplete="off" className="w-full px-3 py-2.5 rounded-xl border border-gray-300" /></label>
          </div>
          <p className="text-xs text-gray-500">Tell them the temporary password in person or by phone, not by email. They should change it here after signing in.</p>
          <button className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-accent-600 text-white">Add admin</button>
        </form>
      </section>

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
