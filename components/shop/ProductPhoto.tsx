import { GiBasket, GiFruitBowl } from 'react-icons/gi'

/** Product photo, or a soft placeholder until Sylvia adds one. */
export default function ProductPhoto({
  image,
  category,
  className = '',
  sizes = 'small',
}: {
  image: { url: string; alt?: string } | null
  category: 'PRODUCE' | 'MERCHANDISE'
  className?: string
  sizes?: 'small' | 'large'
}) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image.url} alt={image.alt || ''} loading="lazy" className={`w-full h-full object-cover ${className}`} />
  }
  const Icon = category === 'PRODUCE' ? GiFruitBowl : GiBasket
  return (
    <div
      aria-hidden="true"
      className={`w-full h-full flex items-center justify-center ${
        category === 'PRODUCE' ? 'bg-gradient-to-br from-accent-50 to-sage-100 text-accent-600' : 'bg-gradient-to-br from-harvest-50 to-clay-100 text-harvest-600'
      } ${className}`}
    >
      <Icon className={sizes === 'large' ? 'w-24 h-24 opacity-60' : 'w-14 h-14 opacity-60'} />
    </div>
  )
}
