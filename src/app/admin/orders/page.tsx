import React from 'react'
import Link from 'next/link'
import { Eye, Trash2 } from 'lucide-react'
import { dbConnect } from '@/lib/mongoose'
import Order from '@/models/Order'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  await dbConnect()
  const orders = await Order.find().sort({ createdAt: -1 }).populate('orderedBy')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id.toString()}>
                  <TableCell className="font-medium">{order.trackingId || order._id.toString().substring(0, 8)}</TableCell>
                  <TableCell>
                    {order.orderedBy ? (order.orderedBy as any).email : 'Guest'}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    ₹{(order.total || 0).toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/orders/${order._id}`}>
                        <Button variant="outline" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
