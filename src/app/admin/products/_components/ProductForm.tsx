'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const payload = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      status: formData.get('status'),
      price: Number(formData.get('price')),
    }

    try {
      const url = initialData ? `/api/products/${initialData._id}` : '/api/products'
      const method = initialData ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save product')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Product' : 'New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={initialData?.title} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={initialData?.slug} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input id="price" name="price" type="number" defaultValue={initialData?.price || 0} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select 
              id="status" 
              name="status" 
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              defaultValue={initialData?.status || 'draft'}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/products')} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
