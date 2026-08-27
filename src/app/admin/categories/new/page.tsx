import React from 'react'
import { CategoryForm } from '../_components/CategoryForm'

export default function NewCategoryPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Category</h2>
      </div>
      <CategoryForm />
    </div>
  )
}
