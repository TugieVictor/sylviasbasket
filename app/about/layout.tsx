import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: "How Sylvia's Basket started as a small kitchen garden and grew into a hub for organic farming, training and advocacy in Kenya.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
