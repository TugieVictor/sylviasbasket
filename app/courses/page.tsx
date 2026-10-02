import type { Metadata } from 'next'
import ComingSoon from '@/components/ComingSoon'

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Hands-on courses in organic farming and agroecology on the farm. Coming soon.',
}

export default function CoursesPage() {
  return (
    <ComingSoon
      kicker="Learn & Visit"
      title="Courses on the farm are coming soon"
      description="Hands-on courses in organic farming and agroecology, with a certificate on completion. Course dates, fees and registration will be listed here. Until then, get in touch to ask about the next course."
      primary={{ label: 'Ask about courses', href: '/get-involved/#contact-section' }}
      secondary={{ label: 'See our training work', href: '/our-work/' }}
    />
  )
}
