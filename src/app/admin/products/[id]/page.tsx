import React from 'react'
import { dbConnect } from '@/lib/mongoose'
import Product from '@/models/Product'
import { ProductForm } from '../_components/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  await dbConnect()
  const product = await Product.findById(params.id).lean()
  
  if (!product) notFound()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
      </div>
      <ProductForm initialData={JSON.parse(JSON.stringify(product))} />
    </div>
  )
}
