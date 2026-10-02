import Link from 'next/link'

type Action = { label: string; href: string }

/**
 * Placeholder for sections that are planned but not built yet
 * (Shop, Courses, Farm Visits). Replaced as each one is built.
 */
export default function ComingSoon({
  kicker,
  title,
  description,
  primary,
  secondary,
}: {
  kicker: string
  title: string
  description: string
  primary: Action
  secondary?: Action
}) {
  return (
    <section className="relative overflow-hidden bg-sage-900 min-h-[80svh] flex items-center">
      <div aria-hidden="true" className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-accent-500/25 rounded-full blur-3xl"></div>
      <div aria-hidden="true" className="absolute -bottom-24 -right-24 w-[26rem] h-[26rem] bg-harvest-500/20 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10 pt-36 pb-24 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-harvest-300">
          <span className="w-2 h-2 rounded-full bg-harvest-300 animate-pulse" aria-hidden="true"></span>
          Coming soon
        </span>
        <p className="mt-6 text-kicker text-white/70">{kicker}</p>
        <h1 className="text-hero text-white mt-3 max-w-3xl mx-auto">{title}</h1>
        <p className="text-body-lg text-white/85 mt-6 max-w-2xl mx-auto">{description}</p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primary.href}
            className="bg-gradient-to-r from-accent-600 to-sage-600 hover:from-accent-700 hover:to-sage-700 text-white px-8 py-4 rounded-full font-semibold shadow-2xl transition-all"
          >
            {primary.label}
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className="bg-white/95 hover:bg-white text-gray-900 px-8 py-4 rounded-full font-semibold shadow-xl transition-all"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
