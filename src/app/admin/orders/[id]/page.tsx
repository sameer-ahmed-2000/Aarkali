import React from 'react'
import { dbConnect } from '@/lib/mongoose'
import Order from '@/models/Order'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderStatusForm } from '../_components/OrderStatusForm'

export const dynamic = 'force-dynamic'

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  await dbConnect()
  const order = await Order.findById(params.id).populate('orderedBy items.product')
  
  if (!order) notFound()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Order Details</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{item.product?.title || 'Unknown Product'}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="font-medium">
                      ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{(order.total || 0).toLocaleString('en-IN')}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-medium">Name: <span className="font-normal">{order.orderedBy?.name || 'N/A'}</span></p>
              <p className="text-sm font-medium">Email: <span className="font-normal">{order.orderedBy?.email || 'Guest'}</span></p>
            </CardContent>
          </Card>

          <OrderStatusForm 
            orderId={order._id.toString()} 
            currentStatus={order.status || 'pending'} 
          />
        </div>
      </div>
    </div>
  )
}
