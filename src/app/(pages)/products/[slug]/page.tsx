import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { dbConnect } from '@/lib/mongoose'
import Product from '@/models/Product'
import { Blocks } from '../../../_components/Blocks'
import { PaywallBlocks } from '../../../_components/PaywallBlocks'
import { ProductHero } from '../../../_heros/Product'
import { generateMeta } from '../../../_utilities/generateMeta'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params: { slug } }: { params: { slug: string } }) {
  await dbConnect()

  // Try finding by slug first, then by ID (fallback for old catalog IDs)
  let mongooseProduct = await Product.findOne({ slug }).populate('categories').lean()
  if (!mongooseProduct) {
    // Try by _id if it's a valid object ID, else try finding where sku == slug
    try {
      mongooseProduct = await Product.findById(slug).populate('categories').lean()
    } catch (e) {
      mongooseProduct = await Product.findOne({ sku: slug }).populate('categories').lean()
    }
  }

  if (!mongooseProduct) {
    notFound()
  }

  // Convert to plain JSON and map Mongoose fields to the expected Product interface for ProductHero
  // ProductHero expects Payload-style product (title, meta.image, etc.)
  const product = JSON.parse(JSON.stringify({
    ...mongooseProduct,
    id: mongooseProduct._id,
    title: mongooseProduct.title,
    meta: {
      title: `${mongooseProduct.title} | Aarkali`,
      description: mongooseProduct.layout?.[1]?.shortDescription || '',
      image: mongooseProduct.layout?.[0]?.url || '',
    }
  }))

  const { relatedProducts } = product

  return (
    <>
      <ProductHero product={product} catalogData={null} />
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
  return [] // We are using force-dynamic, no need to statically generate
}

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }): Promise<Metadata> {
  await dbConnect()
  let mongooseProduct = await Product.findOne({ slug }).lean()
  if (!mongooseProduct) {
    try {
      mongooseProduct = await Product.findById(slug).lean()
    } catch (e) {
      mongooseProduct = await Product.findOne({ sku: slug }).lean()
    }
  }

  if (!mongooseProduct) {
    return {
      title: 'Product Not Found | Aarkali',
    }
  }

  return {
    title: `${mongooseProduct.title} | Aarkali Boutique`,
    description: mongooseProduct.layout?.[1]?.shortDescription || '',
    openGraph: {
      title: `${mongooseProduct.title} | Aarkali Boutique`,
      description: mongooseProduct.layout?.[1]?.shortDescription || '',
      images: [{ url: mongooseProduct.layout?.[0]?.url || '' }],
    },
  }
}
