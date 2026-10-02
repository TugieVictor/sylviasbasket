import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News & Publications',
  description: "News, articles and publications from Sylvia's Basket on organic farming and agroecology.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
