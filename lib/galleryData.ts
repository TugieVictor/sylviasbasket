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
    slug: 'life-on-the-farm',
    title: 'Life on the Farm',
    description: "Animals, soil and landscape at Sylvia's farm",
    icon: GiFarmer,
    images: [
      {
        id: 'farm-1',
        src: '/images/farm/farm-view.jpg',
        alt: "Looking down over the farm, its trees and the gate at Sylvia's Basket farm",
        title: 'View over the farm',
        description: 'Looking down over the farm, its trees and the gate'
      },
      {
        id: 'farm-2',
        src: '/images/farm/farm-valley-view.jpg',
        alt: "Green hills and woodland around the farm at Sylvia's Basket farm",
        title: 'The valley',
        description: 'Green hills and woodland around the farm'
      },
      {
        id: 'farm-3',
        src: '/images/farm/farm-pond.jpg',
        alt: "The lined water pan that stores rain for the dry months at Sylvia's Basket farm",
        title: 'Water pan',
        description: 'The lined water pan that stores rain for the dry months'
      },
      {
        id: 'farm-4',
        src: '/images/farm/cosmos-flowers.jpg',
        alt: "Flowers that bring bees and other helpful insects to the crops at Sylvia's Basket farm",
        title: 'Cosmos in bloom',
        description: 'Flowers that bring bees and other helpful insects to the crops'
      },
      {
        id: 'farm-5',
        src: '/images/farm/acacia-tree.jpg',
        alt: "Indigenous trees kept on the farm for shade and soil health at Sylvia's Basket farm",
        title: 'Acacia',
        description: 'Indigenous trees kept on the farm for shade and soil health'
      },
      {
        id: 'farm-6',
        src: '/images/farm/cold-compost.jpg',
        alt: "Crop leftovers piled to break down slowly into rich compost at Sylvia's Basket farm",
        title: 'Cold compost',
        description: 'Crop leftovers piled to break down slowly into rich compost'
      },
      {
        id: 'farm-7',
        src: '/images/farm/compost-earthworm.jpg',
        alt: "Earthworms at work in the compost at Sylvia's Basket farm",
        title: 'Living soil',
        description: 'Earthworms at work in the compost'
      },
      {
        id: 'farm-8',
        src: '/images/farm/worm-tea.jpg',
        alt: "A worm bin that makes liquid fertiliser for the crops at Sylvia's Basket farm",
        title: 'Worm tea',
        description: 'A worm bin that makes liquid fertiliser for the crops'
      },
      {
        id: 'farm-9',
        src: '/images/farm/cattle-in-yard.jpg',
        alt: "Part of the farm's herd at Sylvia's Basket farm",
        title: 'Cattle',
        description: "Part of the farm's herd"
      },
      {
        id: 'farm-10',
        src: '/images/farm/cattle-at-feeding-pen.jpg',
        alt: "Cattle at the feeding pen at Sylvia's Basket farm",
        title: 'Feeding time',
        description: 'Cattle at the feeding pen'
      },
      {
        id: 'farm-11',
        src: '/images/farm/two-calves.jpg',
        alt: "Two young calves exploring the farm at Sylvia's Basket farm",
        title: 'Calves',
        description: 'Two young calves exploring the farm'
      },
      {
        id: 'farm-12',
        src: '/images/farm/calf-eating-napier.jpg',
        alt: "A calf eating napier grass grown on the farm at Sylvia's Basket farm",
        title: 'Fresh fodder',
        description: 'A calf eating napier grass grown on the farm'
      },
      {
        id: 'farm-13',
        src: '/images/farm/young-calf-grazing.jpg',
        alt: "A calf grazing among the grass at Sylvia's Basket farm",
        title: 'Young calf',
        description: 'A calf grazing among the grass'
      },
      {
        id: 'farm-14',
        src: '/images/farm/free-range-chickens.jpg',
        alt: "Hens roaming freely in the poultry yard at Sylvia's Basket farm",
        title: 'Free range chickens',
        description: 'Hens roaming freely in the poultry yard'
      },
      {
        id: 'farm-15',
        src: '/images/farm/hens-feeding.jpg',
        alt: "Hens feeding together at Sylvia's Basket farm",
        title: 'Hens',
        description: 'Hens feeding together'
      },
      {
        id: 'farm-16',
        src: '/images/farm/rooster.jpg',
        alt: "Keeping watch over the flock at Sylvia's Basket farm",
        title: 'The rooster',
        description: 'Keeping watch over the flock'
      },
      {
        id: 'farm-17',
        src: '/images/farm/sheep-flock.jpg',
        alt: "The flock grazing on maize stalks after harvest at Sylvia's Basket farm",
        title: 'Sheep',
        description: 'The flock grazing on maize stalks after harvest'
      },
      {
        id: 'farm-18',
        src: '/images/farm/sheep-grazing.jpg',
        alt: "Sheep grazing near the drip lines at Sylvia's Basket farm",
        title: 'Grazing',
        description: 'Sheep grazing near the drip lines'
      },
      {
        id: 'farm-19',
        src: '/images/farm/lambs-grazing.jpg',
        alt: "Two lambs grazing side by side at Sylvia's Basket farm",
        title: 'Lambs',
        description: 'Two lambs grazing side by side'
      },
      {
        id: 'farm-20',
        src: '/images/farm/ewe-and-lamb.jpg',
        alt: "A young lamb following its mother at Sylvia's Basket farm",
        title: 'Ewe and lamb',
        description: 'A young lamb following its mother'
      },
      {
        id: 'farm-21',
        src: '/images/farm/sheep-on-slope.jpg',
        alt: "A sheep among the shrubs on the slope at Sylvia's Basket farm",
        title: 'On the hillside',
        description: 'A sheep among the shrubs on the slope'
      },
      {
        id: 'farm-22',
        src: '/images/farm/sheep-on-hillside.jpg',
        alt: "Sheep grazing below the fruit trees at Sylvia's Basket farm",
        title: 'Grazing the slope',
        description: 'Sheep grazing below the fruit trees'
      },
      {
        id: 'farm-23',
        src: '/images/farm/white-rabbit.jpg',
        alt: "One of the farm's rabbits at Sylvia's Basket farm",
        title: 'Rabbit',
        description: "One of the farm's rabbits"
      },
      {
        id: 'farm-24',
        src: '/images/farm/rabbit-at-hutch-door.jpg',
        alt: "A rabbit at the door of its hutch at Sylvia's Basket farm",
        title: 'Rabbit hutch',
        description: 'A rabbit at the door of its hutch'
      },
      {
        id: 'farm-25',
        src: '/images/farm/rabbits-in-hutch.jpg',
        alt: "Rabbits resting in their hutch at Sylvia's Basket farm",
        title: 'Rabbits',
        description: 'Rabbits resting in their hutch'
      },
    ]
  },
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
