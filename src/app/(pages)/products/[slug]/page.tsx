import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Product, Product as ProductType } from '../../../../payload/payload-types'
import { fetchDoc } from '../../../_api/fetchDoc'
import { fetchDocs } from '../../../_api/fetchDocs'
import { Blocks } from '../../../_components/Blocks'
import { PaywallBlocks } from '../../../_components/PaywallBlocks'
import { ProductHero } from '../../../_heros/Product'
import { generateMeta } from '../../../_utilities/generateMeta'
import { getProductBySlugOrId, CATALOG_PRODUCTS } from '../../../constants/catalog'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params: { slug } }: { params: { slug: string } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let product: Product | null = null
  let catalogItem = getProductBySlugOrId(slug)

  try {
    product = await fetchDoc<Product>({
      collection: 'products',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {
    console.error(error)
  }

  // Fallback to rich catalog product if CMS doc is not yet seeded
  if (!product && catalogItem) {
    product = {
      id: catalogItem.id,
      title: catalogItem.name,
      slug: catalogItem.slug,
      categories: [
        {
          id: catalogItem.category,
          title: catalogItem.categoryLabel,
          createdAt: '',
          updatedAt: '',
        } as any,
      ],
      meta: {
        title: `${catalogItem.name} | Aarkali Boutique`,
        description: catalogItem.shortDescription,
        image: catalogItem.image as any,
      },
      createdAt: '',
      updatedAt: '',
      _status: 'published',
    } as any
  }

  if (!product) {
    notFound()
  }

  const { relatedProducts } = product

  return (
    <>
      <ProductHero product={product} catalogData={catalogItem} />
      {product?.enablePaywall && <PaywallBlocks productSlug={slug as string} disableTopPadding />}
      {relatedProducts && relatedProducts.length > 0 && (
        <Blocks
          disableTopPadding
          blocks={[
            {
              blockType: 'relatedProducts',
              blockName: 'Related Product',
              relationTo: 'products',
              introContent: [
                {
                  type: 'h3',
                  children: [
                    {
                      text: 'Related Products',
                    },
                  ],
                },
              ],
              docs: relatedProducts,
            },
          ]}
        />
      )}
    </>
  )
}

export async function generateStaticParams() {
  try {
    const products = await fetchDocs<ProductType>('products')
    const cmsSlugs = products?.map(({ slug }) => slug) || []
    const catalogSlugs = CATALOG_PRODUCTS.map(p => p.slug)
    const catalogIds = CATALOG_PRODUCTS.map(p => p.id)
    return Array.from(new Set([...cmsSlugs, ...catalogSlugs, ...catalogIds]))
  } catch (error) {
    return CATALOG_PRODUCTS.map(p => p.slug)
  }
}

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let product: Product | null = null
  const catalogItem = getProductBySlugOrId(slug)

  try {
    product = await fetchDoc<Product>({
      collection: 'products',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {}

  if (!product && catalogItem) {
    return {
      title: `${catalogItem.name} — Handcrafted Ethnic Wear | Aarkali Boutique`,
      description: catalogItem.shortDescription,
      openGraph: {
        title: `${catalogItem.name} | Aarkali Boutique`,
        description: catalogItem.shortDescription,
        images: [{ url: catalogItem.image }],
      },
    }
  }

  return generateMeta({ doc: product })
}
