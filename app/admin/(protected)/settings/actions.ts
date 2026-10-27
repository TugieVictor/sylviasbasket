'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { endOtherSessions, getCurrentAdmin } from '@/lib/auth/session'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { setSetting } from '@/lib/settings'
import { isValidEmail, normaliseKenyanPhone } from '@/lib/validation'

const MIN_PASSWORD = 10
const str = (form: FormData, key: string, max = 200) => String(form.get(key) ?? '').slice(0, max)
const back = (params: string) => redirect(`/admin/settings/?${params}`)
const fail = (message: string) => back(`error=${encodeURIComponent(message)}`)

async function requireAdmin() {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/admin/login/')
  return admin
}

export async function saveWhatsappNumber(form: FormData) {
  await requireAdmin()
  const number = normaliseKenyanPhone(str(form, 'whatsappNumber', 20))
  if (!number) fail('Please enter a valid Kenyan mobile number.')
  await setSetting('whatsappNumber', number!)
  revalidatePath('/shop')
  back('done=whatsapp')
}

export async function changeMyPassword(form: FormData) {
  const admin = await requireAdmin()
  const current = str(form, 'currentPassword')
  const next = str(form, 'newPassword')
  const repeat = str(form, 'repeatPassword')

  const user = await prisma.adminUser.findUnique({ where: { id: admin.id } })
  if (!user || !verifyPassword(current, user.passwordHash)) fail('Your current password is not right.')
  if (next.length < MIN_PASSWORD) fail(`Your new password needs at least ${MIN_PASSWORD} characters.`)
  if (next !== repeat) fail('The two new passwords do not match.')
  if (next === current) fail('Please choose a password different from the current one.')

  await prisma.adminUser.update({ where: { id: admin.id }, data: { passwordHash: hashPassword(next) } })
  await endOtherSessions(admin.id) // any other signed-in phone or computer must sign in again
  back('done=password')
}

export async function addAdmin(form: FormData) {
  await requireAdmin()
  const name = str(form, 'name', 100).trim()
  const email = str(form, 'email', 200).trim().toLowerCase()
  const password = str(form, 'password')

  if (!name) fail('Please enter their name.')
  if (!isValidEmail(email)) fail('Please enter a valid email address.')
  if (password.length < MIN_PASSWORD) fail(`The temporary password needs at least ${MIN_PASSWORD} characters.`)
  if (await prisma.adminUser.findUnique({ where: { email } })) fail('There is already an admin login for that email.')

  await prisma.adminUser.create({ data: { name, email, passwordHash: hashPassword(password) } })
  revalidatePath('/admin/settings')
  back('done=admin-added')
}

export async function setAdminAccess(form: FormData) {
  const admin = await requireAdmin()
  const id = str(form, 'id', 40)
  const active = form.get('active') === 'on'
  if (id === admin.id) fail('You cannot switch off your own access.')
  if (!active) {
    const others = await prisma.adminUser.count({ where: { active: true, NOT: { id } } })
    if (others < 1) fail('At least one admin must keep access.')
  }
  await prisma.adminUser.update({ where: { id }, data: { active } })
  if (!active) await prisma.adminSession.deleteMany({ where: { userId: id } })
  revalidatePath('/admin/settings')
  back(`done=${active ? 'admin-on' : 'admin-off'}`)
}
