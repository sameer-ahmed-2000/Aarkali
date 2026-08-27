import React from 'react'
import { Metadata } from 'next'

import { dbConnect } from '@/lib/mongoose'
import Category from '@/models/Category'
import Product from '@/models/Product'
import { ProductsClientPage } from './_components/ProductsClientPage'

export const dynamic = 'force-dynamic'

const ProductsPage = async ({ searchParams }: { searchParams: Record<string, string | string[]> }) => {
  let categories = []
  let products = []

  try {
    await dbConnect()
    categories = await Category.find().lean()
    
    // Convert ObjectId to string for client component
    categories = JSON.parse(JSON.stringify(categories))

    // Fetch all published products
    products = await Product.find({ status: 'published' }).populate('categories').lean()
    
    // Parse to simple JSON for client
    products = JSON.parse(JSON.stringify(products))
  } catch (error) {
    console.error('Failed to fetch data for products page', error)
  }

  return <ProductsClientPage categories={categories} products={products} searchParams={searchParams} />
}

export default ProductsPage

export const metadata: Metadata = {
  title: 'All Products | Aarkali Boutique',
  description:
    'Browse our complete collection of premium Indian ethnic wear — sarees, kurtis, lehengas, accessories and more. Filter by category, price, and style.',
}
