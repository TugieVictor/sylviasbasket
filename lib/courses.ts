import { prisma } from '@/lib/prisma'

/** Course helpers shared by the Courses page and the admin. */

export const COURSE_REQUEST_LABELS = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  ENROLLED: 'Joined the course',
  DECLINED: 'Not going ahead',
} as const

export const courseRequestBadge = (status: string) => {
  const colours: Record<string, string> = {
    NEW: 'bg-harvest-100 text-harvest-800',
    CONTACTED: 'bg-sky-100 text-sky-800',
    ENROLLED: 'bg-accent-100 text-accent-800',
    DECLINED: 'bg-gray-100 text-gray-500',
  }
  return `inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${colours[status] || 'bg-gray-100'}`
}

const fmt = (date: Date, opts: Intl.DateTimeFormatOptions) => date.toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts })

/** "Sat 12 December 2026", "7 to 9 December 2026" or "30 November to 2 December 2026" */
export function describeSessionDates(start: Date, end?: Date | null) {
  if (!end || end.getTime() === start.getTime()) return fmt(start, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear()
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth()
  const from = sameMonth ? fmt(start, { day: 'numeric' }) : fmt(start, { day: 'numeric', month: 'long', ...(sameYear ? {} : { year: 'numeric' }) })
  return `${from} to ${fmt(end, { day: 'numeric', month: 'long', year: 'numeric' })}`
}

/** Active courses with their upcoming, open dates. */
export async function getPublicCourses() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return prisma.course.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    include: {
      sessions: {
        where: { status: 'OPEN', startDate: { gte: today } },
        orderBy: { startDate: 'asc' },
      },
    },
  })
}

/** Lines of text as a list (for "what you will learn"). */
export const toLines = (text?: string | null) =>
  (text || '')
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean)

/** One active course with its upcoming dates, for the course page. */
export async function getPublicCourse(slug: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return prisma.course.findFirst({
    where: { slug, active: true },
    include: { sessions: { where: { status: 'OPEN', startDate: { gte: today } }, orderBy: { startDate: 'asc' } } },
  })
}

/** Whether registration is open, and the line to show about it. */
export function registrationStatus(course: { registrationEnds: Date | null }, todayStart: Date) {
  const open = !course.registrationEnds || course.registrationEnds >= todayStart
  const closes = course.registrationEnds
    ? course.registrationEnds.toLocaleDateString('en-GB', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short' })
    : null
  return { open, label: !open ? 'Registration closed' : closes ? `Register by ${closes}` : null }
}
