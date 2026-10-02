import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Work',
  description: "Farmer training, aggregation of organic produce and community programmes led by Sylvia's Basket.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
