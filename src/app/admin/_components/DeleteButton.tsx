'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DeleteButton({ id, endpoint }: { id: string, endpoint: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/${endpoint}/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete')
      }

      router.refresh()
    } catch (error) {
      alert('Error deleting item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="destructive" 
      size="icon" 
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
