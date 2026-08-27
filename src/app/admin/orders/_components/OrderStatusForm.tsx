'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function OrderStatusForm({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const [error, setError] = useState('')

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!res.ok) {
        throw new Error('Failed to update status')
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-md">{error}</div>}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Fulfillment Status</Label>
            <select 
              id="status" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <Button type="submit" disabled={loading || status === currentStatus} className="w-full">
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
