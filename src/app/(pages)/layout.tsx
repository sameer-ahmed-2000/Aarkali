import React from 'react'
import { Header } from '../_components/Header'
import { Footer } from '../_components/Footer'

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* @ts-expect-error */}
      <Header />
      <main className="main">{children}</main>
      {/* @ts-expect-error */}
      <Footer />
    </>
  )
}
