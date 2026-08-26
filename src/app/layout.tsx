import React from 'react'
import { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

import { AdminBar } from './_components/AdminBar'
import { Footer } from './_components/Footer'
import { Header } from './_components/Header'
import { Providers } from './_providers'
import { InitTheme } from './_providers/Theme/InitTheme'
import { mergeOpenGraph } from './_utilities/mergeOpenGraph'

import './_css/app.scss'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${playfairDisplay.variable} ${inter.variable}`}>
        <Providers>
          <AdminBar />
          {/* @ts-expect-error */}
          <Header />
          <main className="main">{children}</main>
          {/* @ts-expect-error */}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://aarkali.in'),
  title: {
    default: 'Aarkali Boutique — Premium Indian Fashion',
    template: '%s | Aarkali Boutique',
  },
  description:
    'Discover Aarkali Boutique — curated premium ethnic wear, designer sarees, kurtis, lehengas and more. Shop online with easy returns, COD, and fast delivery across India.',
  keywords: [
    'boutique india',
    'ethnic wear online',
    'designer sarees',
    'kurtis online',
    'lehenga',
    'indian fashion',
    'aarkali boutique',
  ],
  authors: [{ name: 'Aarkali Boutique' }],
  creator: 'Aarkali Boutique',
  openGraph: mergeOpenGraph({
    siteName: 'Aarkali Boutique',
  }),
  twitter: {
    card: 'summary_large_image',
    site: '@aarkali_boutique',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}
