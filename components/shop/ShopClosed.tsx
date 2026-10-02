import ComingSoon from '@/components/ComingSoon'

export default function ShopClosed() {
  return (
    <ComingSoon
      kicker="Shop"
      title="Our online shop is coming soon"
      description="Soon you will be able to buy fresh organic produce from the farm and Sylvia's Basket merchandise here, with delivery in Nairobi and across Kenya. Until then, get in touch to order."
      primary={{ label: 'Contact us to order', href: '/get-involved/#contact-section' }}
      secondary={{ label: 'See our markets', href: '/markets/' }}
    />
  )
}
