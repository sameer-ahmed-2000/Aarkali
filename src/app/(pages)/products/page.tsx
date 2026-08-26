import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'

import { Category } from '../../../payload/payload-types'
import { fetchDocs } from '../../_api/fetchDocs'
import { ProductsClientPage } from './_components/ProductsClientPage'

export const dynamic = 'force-dynamic'

const ProductsPage = async ({ searchParams }: { searchParams: Record<string, string | string[]> }) => {
  const { isEnabled: isDraftMode } = draftMode()
  let categories: Category[] | null = null

  try {
    categories = await fetchDocs<Category>('categories')
  } catch (error) {
    console.log(error)
  }

  return <ProductsClientPage categories={categories} searchParams={searchParams} />
}

export default ProductsPage

export const metadata: Metadata = {
  title: 'All Products | Aarkali Boutique',
  description:
    'Browse our complete collection of premium Indian ethnic wear — sarees, kurtis, lehengas, accessories and more. Filter by category, price, and style.',
}
