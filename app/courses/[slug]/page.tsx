import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FiArrowRight, FiCalendar, FiClock, FiExternalLink, FiMapPin, FiUsers } from 'react-icons/fi'
import { GiPlantSeed } from 'react-icons/gi'
import { describeSessionDates, getPublicCourse, registrationStatus, toLines } from '@/lib/courses'
import { nairobiToday, parseDateOnly } from '@/lib/visits'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = await getPublicCourse(params.slug)
  return course ? { title: course.title, description: course.summary || undefined } : { title: 'Courses' }
}

const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const course = await getPublicCourse(params.slug)
  if (!course) notFound()

  const status = registrationStatus(course, parseDateOnly(nairobiToday())!)
  const learnings = toLines(course.learnings)
  const places = course.sessions[0]?.capacity
  const deadline = course.registrationEnds?.toLocaleDateString('en-GB', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <>
      <section className="relative overflow-hidden bg-sage-900">
        <div aria-hidden="true" className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-accent-500/25 rounded-full blur-3xl"></div>
        <div aria-hidden="true" className="absolute -bottom-24 -right-24 w-[26rem] h-[26rem] bg-harvest-500/20 rounded-full blur-3xl"></div>
        <div className="container-custom relative z-10 pt-32 md:pt-36 pb-12 md:pb-16">
          <Link href="/courses/" className="text-sm text-white/80 hover:text-white">&larr; All courses</Link>
          <p className="text-kicker text-white/70 mt-6">Course{course.duration ? ` · ${course.duration}` : ''}</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-3 max-w-3xl">{course.title}</h1>
          {course.summary && <p className="text-body-lg text-white/85 mt-4 max-w-2xl">{course.summary}</p>}
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-earth-50 via-white to-harvest-50">
        <div className="container-custom max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-10 items-start">
          <div className="space-y-8 order-2 lg:order-1">
            {course.image ? (
              <a href={course.image} target="_blank" rel="noreferrer" className="block rounded-3xl overflow-hidden shadow-xl bg-white" aria-label="Open the poster full size">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={course.image} alt={`Poster: ${course.title}`} className="w-full h-auto" />
              </a>
            ) : (
              <div className="aspect-[16/9] rounded-3xl bg-gradient-to-br from-accent-50 to-sage-100 flex items-center justify-center text-accent-600">
                <GiPlantSeed className="w-20 h-20 opacity-60" />
              </div>
            )}
            {learnings.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-display font-bold text-gray-900">What you will learn</h2>
                <ul className="mt-3 space-y-2 list-disc pl-5 text-gray-700">{learnings.map((l) => <li key={l}>{l}</li>)}</ul>
              </div>
            )}
            {course.description && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-display font-bold text-gray-900">About this course</h2>
                <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-line">{course.description}</p>
              </div>
            )}
          </div>

          <aside className="order-1 lg:order-2 lg:sticky lg:top-28 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-5">
            <ul className="space-y-3 text-sm text-gray-700">
              {course.sessions.length > 0 ? (
                course.sessions.map((s) => (
                  <li key={s.id} className="space-y-1">
                    <p className="flex items-center gap-2 font-semibold text-gray-900"><FiCalendar className="text-accent-600" /> {describeSessionDates(s.startDate, s.endDate)}</p>
                    <p className="flex items-center gap-2"><FiMapPin className="text-accent-600" /> {s.location}</p>
                    {s.priceKes > 0 && <p className="font-semibold text-accent-800 pl-6">{kes(s.priceKes)} per person</p>}
                  </li>
                ))
              ) : (
                <li className="text-gray-600">No dates set yet. Ask to join and we will tell you about the next one.</li>
              )}
              {course.duration && <li className="flex items-center gap-2"><FiClock className="text-accent-600" /> {course.duration}</li>}
              {places && <li className="flex items-center gap-2"><FiUsers className="text-accent-600" /> {places} places</li>}
              {course.audience && <li className="flex items-center gap-2"><FiUsers className="text-accent-600" /> For {course.audience.charAt(0).toLowerCase() + course.audience.slice(1)}</li>}
            </ul>

            {deadline && (
              <p className={`text-sm font-semibold ${status.open ? 'text-clay-700' : 'text-gray-500'}`}>
                {status.open ? `Register before ${deadline}` : 'Registration for this course has closed'}
              </p>
            )}

            {course.registrationUrl && status.open ? (
              <a href={course.registrationUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-accent-600 to-sage-600 hover:from-accent-700 hover:to-sage-700 text-white py-3.5 rounded-full font-semibold shadow-lg">
                Register your place <FiExternalLink />
              </a>
            ) : (
              <Link href={`/courses/?course=${course.slug}#request`} className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-accent-600 to-sage-600 hover:from-accent-700 hover:to-sage-700 text-white py-3.5 rounded-full font-semibold shadow-lg">
                {status.open ? 'Ask to join' : 'Ask about the next one'} <FiArrowRight />
              </Link>
            )}
            <p className="text-xs text-gray-500 text-center">
              Questions? <Link href="/get-involved/#contact-section" className="underline">Contact us</Link>
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}
