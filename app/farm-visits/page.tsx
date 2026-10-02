import type { Metadata } from 'next'
import ComingSoon from '@/components/ComingSoon'

export const metadata: Metadata = {
  title: 'Farm Visits',
  description: "Request a visit to Sylvia's Basket farm for individuals, groups and schools. Coming soon.",
}

export default function FarmVisitsPage() {
  return (
    <ComingSoon
      kicker="Learn & Visit"
      title="Farm visit requests are coming soon"
      description="Individuals, groups and schools will be able to request a visit to the farm here. Until then, get in touch and we will help you arrange a visit."
      primary={{ label: 'Arrange a visit', href: '/get-involved/#contact-section' }}
      secondary={{ label: 'Discover our story', href: '/about/' }}
    />
  )
}
