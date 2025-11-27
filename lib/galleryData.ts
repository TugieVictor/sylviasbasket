import { FiBook, FiUsers, FiTarget } from 'react-icons/fi'
import { GiFarmer, GiPlantSeed, GiTomato } from 'react-icons/gi'

export interface GalleryImage {
  id: string
  src: string
  alt: string
  title?: string
  description?: string
}

export interface GalleryCategory {
  slug: string
  title: string
  description: string
  icon: any
  images: GalleryImage[]
}

// Gallery data for each category
export const galleryCategories: GalleryCategory[] = [
  {
    slug: 'training-sessions',
    title: 'Training Sessions',
    description: 'Hands-on farmer education in the field',
    icon: FiBook,
    images: [
      // Placeholder images - replace with actual images
      {
        id: 'training-1',
        src: '/images/gallery/training-sessions/training-1.jpg',
        alt: 'Farmers learning organic farming techniques',
        title: 'Organic Farming Workshop',
        description: 'Farmers participating in hands-on training session'
      },
      {
        id: 'training-2',
        src: '/images/gallery/training-sessions/training-2.jpg',
        alt: 'Field training session',
        title: 'Field Training',
        description: 'Practical demonstrations in the field'
      },
      {
        id: 'training-3',
        src: '/images/gallery/training-sessions/training-3.jpg',
        alt: 'Group learning session',
        title: 'Community Learning',
        description: 'Group discussions and knowledge sharing'
      },
      // Add more images as needed
    ]
  },
  {
    slug: 'organic-harvest',
    title: 'Organic Harvest',
    description: 'Fresh produce from our partner farms',
    icon: GiTomato,
    images: [
      {
        id: 'harvest-1',
        src: '/images/gallery/organic-harvest/harvest-1.jpg',
        alt: 'Fresh organic vegetables',
        title: 'Fresh Harvest',
        description: 'Organic vegetables ready for market'
      },
      {
        id: 'harvest-2',
        src: '/images/gallery/organic-harvest/harvest-2.jpg',
        alt: 'Farmers with harvested crops',
        title: 'Abundant Produce',
        description: 'Successful harvest from organic farming'
      },
      {
        id: 'harvest-3',
        src: '/images/gallery/organic-harvest/harvest-3.jpg',
        alt: 'Variety of organic crops',
        title: 'Diverse Crops',
        description: '10-15 seasonal crops grown organically'
      },
    ]
  },
  {
    slug: 'community-events',
    title: 'Community Events',
    description: 'Bringing farmers together',
    icon: FiUsers,
    images: [
      {
        id: 'event-1',
        src: '/images/gallery/community-events/event-1.jpg',
        alt: 'Farmers gathering',
        title: 'Community Gathering',
        description: 'Farmers coming together to share experiences'
      },
      {
        id: 'event-2',
        src: '/images/gallery/community-events/event-2.jpg',
        alt: 'Community celebration',
        title: 'Celebration Event',
        description: 'Celebrating successful harvests and milestones'
      },
      {
        id: 'event-3',
        src: '/images/gallery/community-events/event-3.jpg',
        alt: 'Farmers meeting',
        title: 'Farmers Meeting',
        description: 'Regular meetups for knowledge exchange'
      },
    ]
  },
  {
    slug: 'indigenous-trees',
    title: 'Indigenous Trees',
    description: 'Planting for the future',
    icon: GiPlantSeed,
    images: [
      {
        id: 'trees-1',
        src: '/images/gallery/indigenous-trees/trees-1.jpg',
        alt: 'Tree planting activity',
        title: 'Tree Planting',
        description: 'Planting indigenous trees for sustainability'
      },
      {
        id: 'trees-2',
        src: '/images/gallery/indigenous-trees/trees-2.jpg',
        alt: 'Young indigenous trees',
        title: 'Growing Trees',
        description: 'Indigenous tree nursery and growth'
      },
      {
        id: 'trees-3',
        src: '/images/gallery/indigenous-trees/trees-3.jpg',
        alt: 'Mature indigenous trees',
        title: 'Mature Trees',
        description: 'Established indigenous trees on farmland'
      },
    ]
  },
  {
    slug: 'women-farmers',
    title: 'Women Farmers',
    description: 'Empowering women in agriculture',
    icon: GiFarmer,
    images: [
      {
        id: 'women-1',
        src: '/images/gallery/women-farmers/women-1.jpg',
        alt: 'Women farmers at work',
        title: 'Women in Agriculture',
        description: 'Women leading sustainable farming initiatives'
      },
      {
        id: 'women-2',
        src: '/images/gallery/women-farmers/women-2.jpg',
        alt: 'Women farmers training',
        title: 'Empowerment Training',
        description: 'Women-focused training and mentorship'
      },
      {
        id: 'women-3',
        src: '/images/gallery/women-farmers/women-3.jpg',
        alt: 'Women farmers success',
        title: 'Success Stories',
        description: 'Women farmers celebrating achievements'
      },
    ]
  },
  {
    slug: 'youth-training',
    title: 'Youth Training',
    description: 'Next generation of farmers',
    icon: FiTarget,
    images: [
      {
        id: 'youth-1',
        src: '/images/gallery/youth-training/youth-1.jpg',
        alt: 'Young farmers learning',
        title: 'Youth Engagement',
        description: 'Training the next generation of farmers'
      },
      {
        id: 'youth-2',
        src: '/images/gallery/youth-training/youth-2.jpg',
        alt: 'Youth in agriculture',
        title: 'Youth Innovation',
        description: 'Young people embracing modern organic farming'
      },
      {
        id: 'youth-3',
        src: '/images/gallery/youth-training/youth-3.jpg',
        alt: 'Youth farmers at work',
        title: 'Future Farmers',
        description: 'Youth actively participating in agriculture'
      },
    ]
  },
]

// Helper function to get gallery by slug
export function getGalleryBySlug(slug: string): GalleryCategory | undefined {
  return galleryCategories.find(cat => cat.slug === slug)
}

// Helper function to get all gallery slugs (for static generation)
export function getAllGallerySlugs(): string[] {
  return galleryCategories.map(cat => cat.slug)
}
