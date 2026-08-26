import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Page, Settings } from '../../../payload/payload-types'
import { staticCart } from '../../../payload/seed/cart-static'
import { fetchDoc } from '../../_api/fetchDoc'
import { fetchSettings } from '../../_api/fetchGlobals'
import { Blocks } from '../../_components/Blocks'
import { Gutter } from '../../_components/Gutter'
import { generateMeta } from '../../_utilities/generateMeta'
import { CartPage } from './CartPage'

import classes from './index.module.scss'

export const dynamic = 'force-dynamic'

export default async function Cart() {
  let page: Page | null = null

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug: 'cart',
    })
  } catch (error) {}

  if (!page) {
    page = staticCart
  }

  if (!page) {
    return notFound()
  }

  let settings: Settings | null = null

  try {
    settings = await fetchSettings()
  } catch (error) {}

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.hero}>
        <h1 className={classes.heroTitle}>Shopping Bag</h1>
        <p className={classes.heroSubtitle}>Review your selected boutique pieces and apply offers</p>
      </div>

      <Gutter className={classes.container}>
        <CartPage settings={settings} page={page} />
      </Gutter>
      <Blocks blocks={page?.layout} disableBottomPadding />
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Shopping Bag | Aarkali Boutique',
  description:
    'Review your shopping cart at Aarkali Boutique. Enjoy free express shipping on orders above ₹999, coupon discounts, and secure checkout.',
}
