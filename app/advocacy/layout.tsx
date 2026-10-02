import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Advocacy',
  description: "Sylvia Kuria's advocacy for agroecology and sustainable food systems in Kenya and across Africa.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
