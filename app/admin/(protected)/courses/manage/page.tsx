import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { toDateOnly } from '@/lib/visits'
import { saveCourse, saveSession } from '../actions'

export const dynamic = 'force-dynamic'

const input = 'w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-accent-600 outline-none'
const label = 'block text-sm font-semibold text-gray-700 mb-1'

type Course = { id: string; title: string; summary: string | null; description: string | null; learnings: string | null; audience: string | null; duration: string | null; active: boolean; sortOrder: number }
type Session = { id: string; startDate: Date; endDate: Date | null; location: string; priceKes: number; capacity: number; status: string }

function CourseForm({ course }: { course?: Course }) {
  return (
    <form action={saveCourse} className="space-y-4">
      <input type="hidden" name="id" value={course?.id || ''} />
      <div><label className={label}>Course title</label><input name="title" required defaultValue={course?.title} className={input} /></div>
      <div><label className={label}>Short summary</label><input name="summary" defaultValue={course?.summary || ''} className={input} /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className={label}>How long</label><input name="duration" defaultValue={course?.duration || ''} className={input} placeholder="e.g. 3 days" /></div>
        <div><label className={label}>Who it is for</label><input name="audience" defaultValue={course?.audience || ''} className={input} placeholder="e.g. Smallholder farmers" /></div>
      </div>
      <div><label className={label}>What people will learn (one per line)</label><textarea name="learnings" rows={4} defaultValue={course?.learnings || ''} className={input} /></div>
      <div><label className={label}>More details (optional)</label><textarea name="description" rows={3} defaultValue={course?.description || ''} className={input} /></div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={course ? course.active : true} /> Shown on the Courses page</label>
          <label className="flex items-center gap-2">Position <input name="sortOrder" type="number" defaultValue={course?.sortOrder ?? 0} className="w-16 px-2 py-1 rounded-lg border border-gray-300" /></label>
        </div>
        <button className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-accent-600 text-white">{course ? 'Save course' : 'Add course'}</button>
      </div>
    </form>
  )
}

function SessionForm({ courseId, session }: { courseId: string; session?: Session }) {
  return (
    <form action={saveSession} className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1.4fr_0.8fr_0.7fr_0.9fr_auto] gap-2 items-end border-t border-gray-100 pt-3">
      <input type="hidden" name="id" value={session?.id || ''} />
      <input type="hidden" name="courseId" value={courseId} />
      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Starts</label><input name="startDate" type="date" required defaultValue={session ? toDateOnly(session.startDate) : ''} className={input} /></div>
      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Ends (optional)</label><input name="endDate" type="date" defaultValue={session?.endDate ? toDateOnly(session.endDate) : ''} className={input} /></div>
      <div className="col-span-2 sm:col-span-1"><label className="block text-xs font-semibold text-gray-600 mb-1">Place</label><input name="location" required defaultValue={session?.location || 'Limuru, Kiambu County'} className={input} /></div>
      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Fee (KES)</label><input name="priceKes" type="number" min={0} defaultValue={session?.priceKes ?? 0} className={input} /></div>
      <div><label className="block text-xs font-semibold text-gray-600 mb-1">Places</label><input name="capacity" type="number" min={1} defaultValue={session?.capacity ?? 20} className={input} /></div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
        <select name="status" defaultValue={session?.status || 'OPEN'} className={input}>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Full or closed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      <button className="px-3 py-2.5 rounded-xl font-semibold text-sm bg-accent-600 text-white">{session ? 'Save' : 'Add date'}</button>
    </form>
  )
}

export default async function ManageCoursesPage({ searchParams }: { searchParams: { done?: string; error?: string } }) {
  const courses = await prisma.course.findMany({ orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }], include: { sessions: { orderBy: { startDate: 'desc' }, take: 12 } } })
  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/admin/courses/" className="text-sm text-accent-700 underline">← Course requests</Link>
      <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">Courses and dates</h1>
      <p className="text-gray-600">What you enter here shows on the Courses page. Only open dates in the future are shown to visitors.</p>
      {searchParams.done && <p role="status" className="bg-accent-50 border border-accent-200 text-accent-800 rounded-xl px-4 py-3 text-sm">Saved.</p>}
      {searchParams.error && <p role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">{searchParams.error}</p>}

      {courses.map((c) => (
        <section key={c.id} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5">
          <CourseForm course={c} />
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900">Dates for this course</h3>
            {c.sessions.map((s) => <SessionForm key={s.id} courseId={c.id} session={s} />)}
            <p className="text-sm font-semibold text-gray-700 pt-2">Add a date</p>
            <SessionForm courseId={c.id} />
          </div>
        </section>
      ))}

      <section className="bg-white rounded-2xl border border-dashed border-gray-300 p-5 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Add a new course</h2>
        <CourseForm />
      </section>
    </div>
  )
}
