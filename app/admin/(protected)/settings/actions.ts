'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth/session'
import { setSetting } from '@/lib/settings'
import { normaliseKenyanPhone } from '@/lib/validation'

export async function saveWhatsappNumber(form: FormData) {
  if (!(await getCurrentAdmin())) redirect('/admin/login/')
  const number = normaliseKenyanPhone(String(form.get('whatsappNumber') ?? '').slice(0, 20))
  if (!number) redirect('/admin/settings/?error=Please+enter+a+valid+Kenyan+mobile+number')
  await setSetting('whatsappNumber', number)
  revalidatePath('/shop')
  redirect('/admin/settings/?done=whatsapp')
}
