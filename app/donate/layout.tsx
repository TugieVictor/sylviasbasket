import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Donate',
  description: "Support farmer training and organic agriculture across Kenya with a donation to Sylvia's Basket.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
