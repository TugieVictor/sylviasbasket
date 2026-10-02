import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Farmers Stories',
  description: 'Real stories from farmers across Kenya and Africa who have changed their lives through organic farming.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
