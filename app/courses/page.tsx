import type { Metadata } from 'next'
import Link from 'next/link'
import { FiArrowRight, FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi'
import { describeSessionDates, getPublicCourses, toLines } from '@/lib/courses'
import { toDateOnly } from '@/lib/visits'
import CourseRequestForm from './CourseRequestForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Courses',
  description: "Hands-on courses in organic farming and agroecology at Sylvia's Basket farm in Limuru. Ask to join the next course.",
}

const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`

export default async function CoursesPage({ searchParams }: { searchParams: { course?: string } }) {
  const courses = await getPublicCourses()
  const preselected = courses.find((c) => c.slug === searchParams.course)?.id || ''

  return (
    <>
      <section className="relative overflow-hidden bg-sage-900">
        <div aria-hidden="true" className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-accent-500/25 rounded-full blur-3xl"></div>
        <div aria-hidden="true" className="absolute -bottom-24 -right-24 w-[26rem] h-[26rem] bg-harvest-500/20 rounded-full blur-3xl"></div>
        <div className="container-custom relative z-10 pt-36 pb-20 text-center">
          <p className="text-kicker text-white/70">Learn &amp; Visit</p>
          <h1 className="text-hero text-white mt-3">Courses on the farm</h1>
          <p className="text-body-lg text-white/85 mt-6 max-w-2xl mx-auto">
            Learn organic farming and agroecology hands-on, in the fields at Limuru. Choose a course below and ask to join.
            Sylvia will get back to you with the details.
          </p>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-earth-50 via-white to-harvest-50">
        <div className="container-custom max-w-6xl space-y-14">
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-900">Our courses</h2>
            {courses.length === 0 ? (
              <p className="text-gray-700 mt-4">New course dates are being planned. Send a request below and we will tell you about the next one.</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {courses.map((course) => {
                  const learnings = toLines(course.learnings)
                  return (
                    <article key={course.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 flex flex-col">
                      <h3 className="text-2xl font-display font-bold text-gray-900">{course.title}</h3>
                      {course.summary && <p className="text-gray-700 mt-2">{course.summary}</p>}
                      <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-gray-600">
                        {course.duration && <li className="flex items-center gap-1.5"><FiClock className="text-accent-600" /> {course.duration}</li>}
                        {course.audience && <li className="flex items-center gap-1.5"><FiUsers className="text-accent-600" /> {course.audience}</li>}
                      </ul>
                      {learnings.length > 0 && (
                        <div className="mt-5">
                          <p className="text-sm font-semibold text-gray-900">What you will learn</p>
                          <ul className="mt-2 space-y-1.5 text-sm text-gray-700 list-disc pl-5">
                            {learnings.map((l) => <li key={l}>{l}</li>)}
                          </ul>
                        </div>
                      )}
                      {course.description && <p className="text-sm text-gray-700 mt-4 whitespace-pre-line">{course.description}</p>}
                      <div className="mt-5 border-t border-gray-100 pt-4">
                        <p className="text-sm font-semibold text-gray-900">Upcoming dates</p>
                        {course.sessions.length === 0 ? (
                          <p className="text-sm text-gray-600 mt-1">No dates set yet. Ask to join and we will let you know.</p>
                        ) : (
                          <ul className="mt-2 space-y-2">
                            {course.sessions.map((s) => (
                              <li key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-700 bg-earth-50 rounded-xl px-3 py-2">
                                <span className="flex items-center gap-1.5 font-semibold"><FiCalendar className="text-accent-600" /> {describeSessionDates(s.startDate, s.endDate)}</span>
                                <span className="flex items-center gap-1.5"><FiMapPin className="text-accent-600" /> {s.location}</span>
                                {s.priceKes > 0 && <span className="font-semibold text-accent-800">{kes(s.priceKes)}</span>}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <Link
                        href={`/courses/?course=${course.slug}#request`}
                        scroll={false}
                        className="mt-6 self-start inline-flex items-center gap-2 bg-gradient-to-r from-accent-600 to-sage-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
                      >
                        Ask to join <FiArrowRight />
                      </Link>
                    </article>
                  )
                })}
              </div>
            )}
          </div>

          <div id="request" className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-5">
              <h2 className="text-3xl font-display font-bold text-gray-900">Ask to join a course</h2>
              <p className="text-gray-700">
                Send your request and Sylvia will contact you to confirm your place, the fee and what to bring. There is no payment now.
              </p>
              <p className="text-gray-700">Groups, schools and organisations are welcome. Tell us how many people would come.</p>
              <div className="rounded-3xl bg-sage-900 text-white p-6 shadow-xl">
                <p className="text-kicker text-white/70">Prefer a shorter visit?</p>
                <p className="text-xl font-display font-bold mt-2">Visit the farm for a day</p>
                <p className="text-white/80 text-sm mt-2">Individuals, groups and schools can book a guided farm visit.</p>
                <Link href="/farm-visits/" className="inline-flex items-center gap-2 mt-4 bg-white text-accent-800 px-5 py-2.5 rounded-full font-semibold text-sm">
                  Farm visits <FiArrowRight />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-3">
              <CourseRequestForm
                key={preselected}
                initialCourseId={preselected}
                courses={courses.map((c) => ({
                  id: c.id,
                  title: c.title,
                  sessions: c.sessions.map((s) => ({ id: s.id, label: `${describeSessionDates(s.startDate, s.endDate)}, ${s.location}` })),
                }))}
                minDate={toDateOnly(new Date())}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
