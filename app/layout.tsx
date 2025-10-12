import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import SessionProviders from '@/providers/SessionProvider'

export const metadata: Metadata = {
  title: 'Healthcare AI',
  description: 'Created ',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SessionProviders>
          {children}
        </SessionProviders>
        <Analytics />
      </body>
    </html>
  )
}
