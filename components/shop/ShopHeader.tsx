import Link from 'next/link'
import CartButton from './CartButton'

/** Dark banner shared by the shop pages, so the white top menu stays readable. */
export default function ShopHeader({ kicker, title, intro, back }: { kicker: string; title: string; intro?: string; back?: { label: string; href: string } }) {
  return (
    <section className="relative overflow-hidden bg-sage-900">
      <div aria-hidden="true" className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-accent-500/25 rounded-full blur-3xl"></div>
      <div aria-hidden="true" className="absolute -bottom-24 -right-24 w-[26rem] h-[26rem] bg-harvest-500/20 rounded-full blur-3xl"></div>
      <div className="container-custom relative z-10 pt-32 pb-12 md:pt-36 md:pb-16">
        <div className="flex items-center justify-between gap-4">
          {back ? (
            <Link href={back.href} className="text-sm text-white/80 hover:text-white">&larr; {back.label}</Link>
          ) : (
            <span />
          )}
          <CartButton />
        </div>
        <div className="text-center mt-4">
          <p className="text-kicker text-white/70">{kicker}</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mt-3">{title}</h1>
          {intro && <p className="text-body-lg text-white/85 mt-4 max-w-2xl mx-auto">{intro}</p>}
        </div>
      </div>
    </section>
  )
}
