import React from 'react'
import { ProductForm } from '../_components/ProductForm'

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Product</h2>
      </div>
      <ProductForm />
    </div>
  )
}
