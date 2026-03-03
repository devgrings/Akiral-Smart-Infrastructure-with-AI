import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'AKIRAL — Lead Intelligence Platform',
  description: 'Enterprise-grade SaaS B2B Lead Intelligence, AI-powered Acquisition & Performance Analytics',
  keywords: ['lead management', 'AI receptionist', 'lead intelligence', 'B2B SaaS', 'LGPD', 'GDPR'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#080a0e] text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
