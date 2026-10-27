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
    image: '/images/hero/hero-training',
    alt: 'Sylvia Kuria leads a training for farmers seated under trees',
    kicker: 'New course',
    title: 'Grow your own food. Safely.',
    text: 'A 3-month hands-on kitchen garden course. Seedlings, a guidebook and a certificate included. Only 10 places.',
    button: { label: 'See the course', href: '/courses/' },
    position: '30% center',
  },
  {
    image: '/images/hero/hero-field-visit',
    alt: 'Farmers walking among crops and trees on the farm',
    kicker: 'Farm tours',
    title: 'Visit the farm',
    text: 'See organic farming and agroecology in practice. Individuals, groups and schools welcome.',
    button: { label: 'Request a visit', href: '/farm-visits/' },
    position: 'center',
  },
]
