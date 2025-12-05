import { FiBook, FiUsers, FiTarget, FiGlobe, FiHeart } from 'react-icons/fi'
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
      {
        id: 'training-1',
        src: '/images/gallery/training-sessions/Training.jpg',
        alt: 'Farmers learning organic farming techniques',
        title: 'Organic Farming Workshop',
        description: 'Farmers participating in hands-on training session'
      },
      {
        id: 'training-2',
        src: '/images/gallery/training-sessions/Training 2.jpg',
        alt: 'Field training session',
        title: 'Field Training',
        description: 'Practical demonstrations in the field'
      },
      {
        id: 'training-3',
        src: '/images/gallery/training-sessions/Training 3.jpg',
        alt: 'Group learning session',
        title: 'Community Learning',
        description: 'Group discussions and knowledge sharing'
      },
      {
        id: 'training-4',
        src: '/images/gallery/training-sessions/Training 4.jpg',
        alt: 'Advanced training techniques',
        title: 'Advanced Training',
        description: 'In-depth training on sustainable practices'
      },
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
        src: '/images/gallery/organic-harvest/Organic 1.jpg',
        alt: 'Fresh organic vegetables',
        title: 'Fresh Harvest',
        description: 'Organic vegetables ready for market'
      },
      {
        id: 'harvest-2',
        src: '/images/gallery/organic-harvest/Organic2.jpg',
        alt: 'Farmers with harvested crops',
        title: 'Abundant Produce',
        description: 'Successful harvest from organic farming'
      },
      {
        id: 'harvest-3',
        src: '/images/gallery/organic-harvest/veg_harvesting.jpg',
        alt: 'Harvesting vegetables',
        title: 'Vegetable Harvesting',
        description: 'Fresh vegetables being harvested'
      },
      {
        id: 'harvest-4',
        src: '/images/gallery/organic-harvest/Sorting tomatoes.jpg',
        alt: 'Sorting tomatoes',
        title: 'Sorting Tomatoes',
        description: 'Preparing tomatoes for market'
      },
      {
        id: 'harvest-5',
        src: '/images/gallery/organic-harvest/Transporting_veggies.jpg',
        alt: 'Transporting vegetables',
        title: 'Transporting Produce',
        description: 'Moving fresh produce to market'
      },
      {
        id: 'harvest-6',
        src: '/images/gallery/organic-harvest/Broccoli.jpg',
        alt: 'Fresh broccoli',
        title: 'Organic Broccoli',
        description: 'Fresh organic broccoli harvest'
      },
      {
        id: 'harvest-7',
        src: '/images/gallery/organic-harvest/Bell peppers.jpg',
        alt: 'Bell peppers',
        title: 'Colorful Bell Peppers',
        description: 'Organic bell peppers'
      },
      {
        id: 'harvest-8',
        src: '/images/gallery/organic-harvest/Beets.jpg',
        alt: 'Fresh beets',
        title: 'Organic Beets',
        description: 'Freshly harvested beets'
      },
      {
        id: 'harvest-9',
        src: '/images/gallery/organic-harvest/Salad.jpg',
        alt: 'Fresh salad greens',
        title: 'Salad Greens',
        description: 'Fresh organic salad vegetables'
      },
      {
        id: 'harvest-10',
        src: '/images/gallery/organic-harvest/Maize.jpg',
        alt: 'Maize harvest',
        title: 'Organic Maize',
        description: 'Fresh maize from the farm'
      },
      {
        id: 'harvest-11',
        src: '/images/gallery/organic-harvest/Banana.jpg',
        alt: 'Banana plantation',
        title: 'Organic Bananas',
        description: 'Banana plants on the farm'
      },
      {
        id: 'harvest-12',
        src: '/images/gallery/organic-harvest/ROOT TUBERS.jpg',
        alt: 'Root tubers',
        title: 'Root Tubers',
        description: 'Fresh root vegetables'
      },
      {
        id: 'harvest-13',
        src: '/images/gallery/organic-harvest/Honey.jpg',
        alt: 'Organic honey',
        title: 'Farm Honey',
        description: 'Natural honey from the farm'
      },
      {
        id: 'harvest-14',
        src: '/images/gallery/organic-harvest/Flowers.jpg',
        alt: 'Farm flowers',
        title: 'Farm Flowers',
        description: 'Beautiful flowers from the farm'
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
        src: '/images/gallery/community-events/Community.jpg',
        alt: 'Farmers gathering',
        title: 'Community Gathering',
        description: 'Farmers coming together to share experiences'
      },
      {
        id: 'event-2',
        src: '/images/gallery/community-events/Community 2.jpg',
        alt: 'Community celebration',
        title: 'Celebration Event',
        description: 'Celebrating successful harvests and milestones'
      },
    ]
  },
  {
    slug: 'indigenous-trees',
    title: 'Indigenous Trees',
    description: 'Agroforestry for sustainability',
    icon: GiPlantSeed,
    images: [
      {
        id: 'trees-1',
        src: '/images/gallery/indigenous-trees/Agroforestry.jpg',
        alt: 'Agroforestry practices',
        title: 'Agroforestry System',
        description: 'Integrating trees with farming for sustainability'
      },
      {
        id: 'trees-2',
        src: '/images/gallery/indigenous-trees/Agroforestry 2.jpg',
        alt: 'Trees on farmland',
        title: 'Farm with Trees',
        description: 'Trees providing shade and enriching soil'
      },
      {
        id: 'trees-3',
        src: '/images/gallery/indigenous-trees/Agroforestry 3.jpg',
        alt: 'Agroforestry implementation',
        title: 'Agroforestry in Action',
        description: 'Trees integrated with crop production'
      },
      {
        id: 'trees-4',
        src: '/images/gallery/indigenous-trees/Agroforestry 4.jpg',
        alt: 'Indigenous tree planting',
        title: 'Indigenous Trees',
        description: 'Planting native trees for biodiversity'
      },
      {
        id: 'trees-5',
        src: '/images/gallery/indigenous-trees/Windbreak trees.jpg',
        alt: 'Windbreak trees',
        title: 'Windbreak Protection',
        description: 'Trees protecting crops from strong winds'
      },
      {
        id: 'trees-6',
        src: '/images/gallery/indigenous-trees/Papaya.jpg',
        alt: 'Papaya trees',
        title: 'Fruit Trees',
        description: 'Productive fruit trees on the farm'
      },
    ]
  },
  {
    slug: 'voice-of-africa',
    title: 'The Voice of Africa',
    description: 'Representing African farmers globally',
    icon: FiGlobe,
    images: [
      {
        id: 'voice-1',
        src: '/images/gallery/voice-of-Africa/Voice.jpg',
        alt: 'Sylvia representing African farmers',
        title: 'Voice of African Farmers',
        description: 'Representing African farmers on global platforms'
      },
      {
        id: 'voice-2',
        src: '/images/gallery/voice-of-Africa/Voice of africa 2.jpg',
        alt: 'International representation',
        title: 'Global Advocacy',
        description: 'Speaking for African agriculture at international forums'
      },
      {
        id: 'voice-3',
        src: '/images/gallery/voice-of-Africa/Features.JPG',
        alt: 'Featured voice of Africa',
        title: 'Featured Speaker',
        description: 'Sharing African farming perspectives worldwide'
      },
    ]
  },
  {
    slug: 'advocacy',
    title: 'Advocacy',
    description: 'Policy change for sustainable food systems',
    icon: FiTarget,
    images: [
      {
        id: 'advocacy-1',
        src: '/images/gallery/advocacy/Advocacy 1.jpg',
        alt: 'Policy advocacy work',
        title: 'Policy Engagement',
        description: 'Working to change policies for sustainable agriculture'
      },
      {
        id: 'advocacy-2',
        src: '/images/gallery/advocacy/Advocacy3.jpg',
        alt: 'Advocacy campaigns',
        title: 'Advocacy Campaigns',
        description: 'Campaigns for agroecology and food systems change'
      },
      {
        id: 'advocacy-3',
        src: '/images/gallery/advocacy/Advocacy 4.jpg',
        alt: 'Community advocacy',
        title: 'Community Advocacy',
        description: 'Grassroots advocacy for sustainable food systems'
      },
    ]
  },
  {
    slug: 'informal-settlements',
    title: 'Informal Settlements Initiative',
    description: 'Making organic food accessible to underserved communities',
    icon: FiHeart,
    images: [
      {
        id: 'informal-1',
        src: '/images/gallery/informal_settlements/IMG_20251013_104847.jpg',
        alt: 'St. Barrack Learning Centre, Mukuru kwa njenga',
        title: 'St. Barrack Learning Centre',
        description: 'Pilot program at St. Barrack Learning Centre in Mukuru kwa njenga, Nairobi'
      },
      {
        id: 'informal-2',
        src: '/images/gallery/informal_settlements/IMG_20251013_105506.jpg',
        alt: 'Community engagement in Mukuru',
        title: 'Community Outreach',
        description: 'Building relationships with the Mukuru community'
      },
      {
        id: 'informal-3',
        src: '/images/gallery/informal_settlements/IMG_20251013_114735.jpg',
        alt: 'School children at St. Barrack',
        title: 'Reaching Children',
        description: 'Bringing nutritious organic food to school children'
      },
      {
        id: 'informal-4',
        src: '/images/gallery/informal_settlements/IMG_20251013_114747.jpg',
        alt: 'Organic food distribution',
        title: 'Food Distribution',
        description: 'Distributing fresh organic produce to the community'
      },
      {
        id: 'informal-5',
        src: '/images/gallery/informal_settlements/IMG_20251013_114822.jpg',
        alt: 'Initiative in action',
        title: 'Initiative Launch',
        description: 'Early stages of the informal settlements program'
      },
      {
        id: 'informal-6',
        src: '/images/gallery/informal_settlements/IMG-20251021-WA0066.jpg',
        alt: 'Community interaction',
        title: 'Community Engagement',
        description: 'Working together to improve food access'
      },
      {
        id: 'informal-7',
        src: '/images/gallery/informal_settlements/IMG-20251021-WA0067.jpg',
        alt: 'Program development',
        title: 'Building the Program',
        description: 'Developing sustainable food access for informal settlements'
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
