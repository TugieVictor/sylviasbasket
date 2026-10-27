import type { Metadata } from 'next'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import CourseCard from '@/components/courses/CourseCard'
import { describeSessionDates, getPublicCourses, registrationStatus } from '@/lib/courses'
import { nairobiToday, parseDateOnly, toDateOnly } from '@/lib/visits'
import CourseRequestForm from './CourseRequestForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Courses',
  description: "Hands-on courses in organic farming and agroecology at Sylvia's Basket farm in Limuru. Ask to join the next course.",
}

export default async function CoursesPage({ searchParams }: { searchParams: { course?: string } }) {
  const courses = await getPublicCourses()
  const preselected = courses.find((c) => c.slug === searchParams.course)?.id || ''
  const today = parseDateOnly(nairobiToday())!

  return (
    <>
      <section className="relative overflow-hidden bg-sage-900">
        <div aria-hidden="true" className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-accent-500/25 rounded-full blur-3xl"></div>
        <div aria-hidden="true" className="absolute -bottom-24 -right-24 w-[26rem] h-[26rem] bg-harvest-500/20 rounded-full blur-3xl"></div>
        <div className="container-custom relative z-10 pt-36 pb-20 text-center">
          <p className="text-kicker text-white/70">Learn &amp; Visit</p>
          <h1 className="text-hero text-white mt-3">Courses on the farm</h1>
          <p className="text-body-lg text-white/85 mt-6 max-w-2xl mx-auto">
            Learn organic farming and agroecology hands-on, on the farm. Choose a course to see the details and register your place.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
                {courses.map((course) => {
                  const status = registrationStatus(course, today)
                  const next = course.sessions[0]
                  return (
                    <CourseCard
                      key={course.id}
                      course={{
                        slug: course.slug,
                        title: course.title,
                        image: course.image,
                        label: ['Course', course.duration].filter(Boolean).join(' · '),
                        meta: next ? `${describeSessionDates(next.startDate, next.endDate)} · ${next.location}` : null,
                        badge: status.label ? { text: status.label, closed: !status.open } : null,
                      }}
                    />
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
