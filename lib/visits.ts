/**
 * Shared rules for farm visit requests (version_2_plan.md, Stage 7).
 * Dates are calendar days in Kenya time, stored as midnight UTC.
 */

export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** Today's date in Nairobi as YYYY-MM-DD */
export function nairobiToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Nairobi' }).format(new Date())
}

/** Parse a YYYY-MM-DD string into a Date at midnight UTC, or null */
export function parseDateOnly(value: unknown): Date | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date
}

export const toDateOnly = (date: Date) => date.toISOString().slice(0, 10)

export const addDays = (yyyyMmDd: string, days: number) => {
  const date = new Date(`${yyyyMmDd}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return toDateOnly(date)
}

export const parseWeekdays = (value: string) =>
  value
    .split(',')
    .map((d) => Number(d.trim()))
    .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6)

export function describeWeekdays(value: string) {
  const days = parseWeekdays(value)
  if (days.length === 7) return 'Any day'
  if (days.join(',') === '1,2,3,4,5') return 'Monday to Friday'
  if (days.join(',') === '1,2,3,4,5,6') return 'Monday to Saturday'
  return days.map((d) => WEEKDAY_NAMES[d]).join(', ')
}

type VisitRules = { weekdays: string; minNoticeDays: number }

/** First date (YYYY-MM-DD) that has enough notice and falls on an allowed weekday */
export function earliestVisitDate(rules: VisitRules) {
  const allowed = parseWeekdays(rules.weekdays)
  let day = addDays(nairobiToday(), rules.minNoticeDays)
  for (let i = 0; i < 7 && allowed.length > 0; i++) {
    if (allowed.includes(new Date(`${day}T00:00:00Z`).getUTCDay())) return day
    day = addDays(day, 1)
  }
  return day
}

/** Returns an error message, or null when the date is allowed */
export function checkVisitDate(date: Date, rules: VisitRules) {
  const day = toDateOnly(date)
  const earliest = earliestVisitDate(rules)
  if (day < earliest) {
    return `Please choose a date from ${formatDate(parseDateOnly(earliest)!)}. We need ${rules.minNoticeDays} days' notice.`
  }
  if (!parseWeekdays(rules.weekdays).includes(date.getUTCDay())) {
    return `Visits are possible on: ${describeWeekdays(rules.weekdays)}.`
  }
  return null
}

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)

export const VISIT_STATUS_LABELS: Record<string, string> = {
  REQUESTED: 'New request',
  CONFIRMED: 'Confirmed',
  DECLINED: 'Declined',
  PAID: 'Paid',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

/** Tailwind classes for a visit status badge in the admin */
export const statusBadge = (status: string) => {
  const colours: Record<string, string> = {
    REQUESTED: 'bg-harvest-100 text-harvest-800',
    CONFIRMED: 'bg-sky-100 text-sky-800',
    PAID: 'bg-accent-100 text-accent-800',
    COMPLETED: 'bg-gray-100 text-gray-700',
    DECLINED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-500',
  }
  return `inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${colours[status] || 'bg-gray-100'}`
}
