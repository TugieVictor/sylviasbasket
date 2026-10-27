import Link from 'next/link'
import { GiPlantSeed } from 'react-icons/gi'

export type CourseCardData = {
  slug: string
  title: string
  image: string | null
  label: string // e.g. "Course · 3 months, 3 farm visits"
  meta: string | null // e.g. "4 Nov 2026 to 20 Jan 2027 · Mai Mahiu"
  badge: { text: string; closed: boolean } | null
}

/** Compact, clickable course card: picture, provider, title, short label. Opens the course page. */
export default function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <Link
      href={`/courses/${course.slug}/`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-accent-400 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-3"
    >
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-br from-accent-50 to-sage-100">
        {course.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.image} alt="" loading="lazy" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-accent-600">
            <GiPlantSeed className="w-14 h-14 opacity-60" />
          </div>
        )}
        {course.badge && (
          <span className={`absolute top-2 left-2 text-xs font-semibold px-2.5 py-1 rounded-full shadow ${course.badge.closed ? 'bg-white/95 text-gray-600' : 'bg-harvest-400 text-gray-900'}`}>
            {course.badge.text}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 mt-3 px-1">
        <span className="w-8 h-8 rounded-md border border-gray-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/sylvias-logo.png" alt="" className="w-7 h-auto" />
        </span>
        <span className="text-sm text-gray-700">Sylvia&apos;s Basket</span>
      </div>
      <h3 className="font-display font-bold text-gray-900 mt-2 px-1 leading-snug line-clamp-2 group-hover:text-accent-700 transition-colors">{course.title}</h3>
      <p className="text-xs text-gray-500 mt-auto pt-3 px-1">{course.label}</p>
      {course.meta && <p className="text-xs text-gray-500 mt-0.5 px-1 pb-1">{course.meta}</p>}
    </Link>
  )
}
