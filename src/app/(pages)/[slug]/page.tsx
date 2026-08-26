import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Category, Page } from '../../../payload/payload-types'
import { staticHome } from '../../../payload/seed/home-static'
import { fetchDoc } from '../../_api/fetchDoc'
import { fetchDocs } from '../../_api/fetchDocs'
import { Blocks } from '../../_components/Blocks'
import { Gutter } from '../../_components/Gutter'
import { Hero } from '../../_components/Hero'
import { generateMeta } from '../../_utilities/generateMeta'
import { StaticContentPage } from './StaticContentPage'
import Categories from '../../_components/Categories'
import Promotion from '../../_components/Promotion'

import classes from './index.module.scss'

export const dynamic = 'force-dynamic'

const KNOWN_STATIC_SLUGS = [
  'about',
  'contact',
  'faq',
  'returns',
  'return-policy',
  'size-guide',
  'shipping-policy',
  'privacy-policy',
  'terms',
  'sustainability',
  'artisans',
  'blog',
]

export default async function Page({ params: { slug = 'home' } }: { params: { slug: string } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null
  let categories: Category[] | null = null

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug,
      draft: isDraftMode,
    })

    categories = await fetchDocs<Category>('categories')
  } catch (error) {}

  if (!page && slug === 'home') {
    page = staticHome
  }

  // If page not found in CMS, check if it is one of our luxury customer brand/support pages
  if (!page && KNOWN_STATIC_SLUGS.includes(slug)) {
    return <StaticContentPage slug={slug} />
  }

  if (!page) {
    return notFound()
  }

  const { hero, layout } = page

  return (
    <React.Fragment>
      {slug === 'home' ? (
        <section>
          <Hero {...hero} />

          <Gutter className={classes.home}>
            <Categories categories={categories} />
            <Promotion />
          </Gutter>
        </section>
      ) : (
        <>
          <Hero {...hero} />
          <Blocks
            blocks={layout}
            disableTopPadding={!hero || hero?.type === 'none' || hero?.type === 'lowImpact'}
          />
        </>
      )}
    </React.Fragment>
  )
}

export async function generateStaticParams() {
  try {
    const pages = await fetchDocs<Page>('pages')
    const cmsSlugs = pages?.map(({ slug }) => slug) || []
    return Array.from(new Set([...cmsSlugs, ...KNOWN_STATIC_SLUGS]))
  } catch (error) {
    return KNOWN_STATIC_SLUGS
  }
}

export async function generateMetadata({ params: { slug = 'home' } }: { params: { slug: string } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {}

  if (!page && slug === 'home') {
    page = staticHome
  }

  if (!page && KNOWN_STATIC_SLUGS.includes(slug)) {
    const titles: Record<string, string> = {
      about: 'Our Story & Artisan Heritage | Aarkali Boutique',
      contact: 'Contact Atelier & Concierge | Aarkali Boutique',
      faq: 'Frequently Asked Questions | Aarkali Boutique',
      returns: '7-Day Return & Exchange Policy | Aarkali Boutique',
      'return-policy': 'Returns & Exchanges | Aarkali Boutique',
      'size-guide': 'Ethnic Wear Size Guide & Chart | Aarkali Boutique',
      'shipping-policy': 'Express Delivery & Shipping Policy | Aarkali Boutique',
      'privacy-policy': 'Privacy Policy | Aarkali Boutique',
      terms: 'Terms of Service | Aarkali Boutique',
      sustainability: 'Sustainability & Ethical Handloom | Aarkali Boutique',
      artisans: 'Artisan Partners & Weavers | Aarkali Boutique',
    }

    return {
      title: titles[slug] || 'Aarkali Boutique',
      description: 'Aarkali Boutique customer assistance, policies, and brand heritage.',
    }
  }

  return generateMeta({ doc: page })
}
