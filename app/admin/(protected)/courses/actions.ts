'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth/session'
import { slugify } from '@/lib/slug'
import { parseDateOnly } from '@/lib/visits'

async function requireAdmin() {
  if (!(await getCurrentAdmin())) redirect('/admin/login/')
}

const str = (form: FormData, key: string, max = 2000) => String(form.get(key) ?? '').trim().slice(0, max)
const whole = (form: FormData, key: string, min = 0) => Math.max(min, Math.round(Number(str(form, key, 12)) || 0))

export async function setCourseRequestStatus(form: FormData) {
  await requireAdmin()
  const id = str(form, 'id', 40)
  const status = str(form, 'status', 20)
  if (!['NEW', 'CONTACTED', 'ENROLLED', 'DECLINED'].includes(status)) redirect(`/admin/courses/requests/${id}/`)
  await prisma.courseRequest.update({ where: { id }, data: { status: status as 'NEW' | 'CONTACTED' | 'ENROLLED' | 'DECLINED' } })
  revalidatePath('/admin/courses')
  redirect(`/admin/courses/requests/${id}/?done=updated`)
}

export async function saveCourseRequestNotes(form: FormData) {
  await requireAdmin()
  const id = str(form, 'id', 40)
  await prisma.courseRequest.update({ where: { id }, data: { adminNotes: str(form, 'adminNotes', 5000) || null } })
  redirect(`/admin/courses/requests/${id}/?done=notes`)
}

export async function saveCourse(form: FormData) {
  await requireAdmin()
  const id = str(form, 'id', 40)
  const title = str(form, 'title', 120)
  if (!title) redirect('/admin/courses/manage/?error=Please+enter+a+course+title')
  const data = {
    title,
    summary: str(form, 'summary', 300) || null,
    description: str(form, 'description', 5000) || null,
    learnings: str(form, 'learnings', 3000) || null,
    audience: str(form, 'audience', 150) || null,
    duration: str(form, 'duration', 60) || null,
    image: (() => { const v = str(form, 'image', 300); return /^\/(api\/images|images)\//.test(v) ? v : null })(),
    registrationUrl: (() => { const v = str(form, 'registrationUrl', 500); return /^https:\/\//.test(v) ? v : null })(),
    registrationEnds: parseDateOnly(str(form, 'registrationEnds', 10)),
    active: form.get('active') === 'on',
    sortOrder: Math.round(Number(str(form, 'sortOrder', 5)) || 0),
  }
  if (id) await prisma.course.update({ where: { id }, data })
  else {
    let slug = slugify(title)
    if (await prisma.course.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36).slice(-4)}`
    await prisma.course.create({ data: { ...data, slug } })
  }
  revalidatePath('/courses')
  redirect('/admin/courses/manage/?done=course')
}

export async function saveSession(form: FormData) {
  await requireAdmin()
  const id = str(form, 'id', 40)
  const courseId = str(form, 'courseId', 40)
  const startDate = parseDateOnly(str(form, 'startDate', 10))
  const endDate = str(form, 'endDate', 10) ? parseDateOnly(str(form, 'endDate', 10)) : null
  const location = str(form, 'location', 150)
  if (!startDate || !location) redirect('/admin/courses/manage/?error=Please+enter+a+start+date+and+a+place')
  if (endDate && endDate < startDate) redirect('/admin/courses/manage/?error=The+end+date+is+before+the+start+date')
  const status = ['OPEN', 'CLOSED', 'CANCELLED'].includes(str(form, 'status', 10)) ? (str(form, 'status', 10) as 'OPEN' | 'CLOSED' | 'CANCELLED') : 'OPEN'
  const data = { startDate, endDate, location, priceKes: whole(form, 'priceKes'), capacity: whole(form, 'capacity', 1), status }
  if (id) await prisma.courseSession.update({ where: { id }, data })
  else await prisma.courseSession.create({ data: { ...data, courseId } })
  revalidatePath('/courses')
  redirect('/admin/courses/manage/?done=date')
}
