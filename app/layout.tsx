import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sam Chow Portfolio',
  description: 'Multimedia Designer Work Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}