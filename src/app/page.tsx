import React from 'react'
import { Metadata } from 'next'

import { HomePage } from './_components/HomePage'

export const dynamic = 'force-dynamic'

export default function Home() {
  return <HomePage />
}

export const metadata: Metadata = {
  title: 'Aarkali Boutique — Premium Indian Fashion & Ethnic Wear',
  description:
    'Shop the finest ethnic wear at Aarkali Boutique. Discover designer sarees, kurtis, lehengas and accessories with free shipping above ₹999, easy returns, and Cash on Delivery across India.',
}
