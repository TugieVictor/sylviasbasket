import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Markets',
  description: "How Sylvia's Basket connects small-scale organic farmers to reliable markets.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
