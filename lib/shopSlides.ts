/**
 * Slides at the top of the shop. `image` is a path prefix: the files
 * <image>-800.webp, -1200.webp, -1920.webp and -1200.jpg must exist in /public.
 * A slide whose photo is missing is skipped automatically.
 */
export type ShopSlide = {
  image: string
  alt: string
  kicker: string
  title: string
  text: string
  button: { label: string; href: string }
  /** CSS object-position, to keep the subject in view */
  position?: string
}

export const shopSlides: ShopSlide[] = [
  {
    image: '/images/shop/honey-dipper',
    alt: 'Honey dripping from a wooden dipper into a jar',
    kicker: 'New in the shop',
    title: 'Pure honey, straight from the hive',
    text: 'Golden, natural honey with nothing added. Order online and we deliver in Nairobi and across Kenya.',
    button: { label: 'Shop honey', href: '/shop/?category=honey' },
    position: 'center',
  },
  {
    image: '/images/shop/bees-on-comb',
    alt: 'Honey bees working on a honeycomb',
    kicker: 'Good for the land',
    title: 'Healthy bees, healthy farms',
    text: "Bees pollinate the crops that feed us. Every purchase supports Sylvia's Basket and its work with farmers.",
    button: { label: 'Shop honey', href: '/shop/?category=honey' },
    position: 'center',
  },
  {
    image: '/images/shop/honey-jar',
    alt: 'A glass jar of golden honey on a wooden table',
    kicker: 'A taste of the farm',
    title: 'In your tea, on your bread',
    text: 'Pure honey in glass jars, packed with care.',
    button: { label: 'See all products', href: '/shop/#products' },
    position: 'center 60%',
  },
  {
    image: '/images/hero/hero-field-visit',
    alt: 'Farmers walking among crops and trees on the farm',
    kicker: 'From our farm',
    title: 'Fresh organic produce',
    text: 'Seasonal vegetables and fruit, grown the organic way and delivered in Nairobi.',
    button: { label: 'Shop fresh produce', href: '/shop/?category=fresh-produce' },
    position: 'center',
  },
]
