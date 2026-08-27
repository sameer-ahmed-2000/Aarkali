import React from 'react'
import { dbConnect } from '@/lib/mongoose'
import Category from '@/models/Category'
import { CategoryForm } from '../_components/CategoryForm'
import { notFound } from 'next/navigation'

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  await dbConnect()
  const category = await Category.findById(params.id)
  
  if (!category) notFound()

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
      </div>
      <CategoryForm initialData={JSON.parse(JSON.stringify(category))} />
    </div>
  )
}
