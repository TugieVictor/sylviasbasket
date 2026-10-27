import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPolicy, policies } from '@/lib/policies'

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const policy = getPolicy(params.slug)
  return policy ? { title: policy.title, description: policy.summary } : {}
}

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const policy = getPolicy(params.slug)
  if (!policy) notFound()
  const showDraftNote = !policy.approved && process.env.NODE_ENV !== 'production'

  return (
    <>
      <section className="relative overflow-hidden bg-sage-900">
        <div aria-hidden="true" className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-accent-500/25 rounded-full blur-3xl"></div>
        <div className="container-custom relative z-10 pt-36 pb-16 text-center">
          <p className="text-kicker text-white/70">Policies</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-3">{policy.title}</h1>
          <p className="text-body-lg text-white/85 mt-4 max-w-2xl mx-auto">{policy.summary}</p>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-earth-50 via-white to-harvest-50">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-10 max-w-5xl">
          <nav aria-label="Policies" className="lg:sticky lg:top-28 self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">Policies</p>
            <ul className="flex lg:flex-col gap-2 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 pb-2 lg:pb-0">
              {policies.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/policies/${p.slug}/`}
                    aria-current={p.slug === policy.slug ? 'page' : undefined}
                    className={`block whitespace-nowrap rounded-full lg:rounded-xl px-4 py-2.5 text-sm font-semibold border ${
                      p.slug === policy.slug ? 'bg-accent-600 border-accent-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-accent-400'
                    }`}
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <article className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
            {showDraftNote && (
              <p className="mb-6 text-sm bg-harvest-50 border border-harvest-300 text-harvest-900 rounded-xl px-4 py-3">
                Draft wording, waiting for Sylvia&apos;s approval. This note only shows while developing.
              </p>
            )}
            <p className="text-sm text-gray-500">Last updated {policy.updated}</p>
            <div className="mt-6 space-y-8">
              {policy.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-xl font-display font-bold text-gray-900">{section.heading}</h2>
                  {section.paragraphs?.map((p) => (
                    <p key={p} className="text-gray-700 leading-relaxed mt-3">{p}</p>
                  ))}
                  {section.bullets && (
                    <ul className="mt-3 space-y-2 list-disc pl-5 text-gray-700 leading-relaxed">
                      {section.bullets.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
