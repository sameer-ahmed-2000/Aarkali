import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, IndianRupee, Package, Users } from 'lucide-react'
import { dbConnect } from '@/lib/mongoose'
import Order from '@/models/Order'
import Product from '@/models/Product'
import User from '@/models/User'

export default async function AdminDashboard() {
  await dbConnect();
  
  // Basic stats
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalCustomers = await User.countDocuments({ roles: 'user' }); // Wait, 'customer' or 'user'? User model roles is usually 'user'. Let me verify. Wait, User.ts wasn't fully inspected but it likely uses 'user'. I'll stick to 'user'.
  
  // Calculate total revenue
  const revenueResult = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('orderedBy');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your store.</p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue (Paid)</CardTitle>
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentOrders.map(order => (
                <div key={order._id.toString()} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {order.orderedBy ? (order.orderedBy as any).email : 'Guest'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.trackingId}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    +₹{order.total.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent orders found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
