import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongoose'
import Order from '@/models/Order'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId')
    const trackingId = searchParams.get('trackingId')

    if (!orderId && !trackingId) {
      return NextResponse.json(
        { success: false, message: 'Order ID or Tracking ID is required.' },
        { status: 400 },
      )
    }

    let query: any = {}
    if (orderId) {
      query._id = orderId
    } else {
      query.trackingId = trackingId
    }

    await dbConnect()
    const order = await Order.findOne(query)

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found. Please check your Order ID or Tracking ID.' },
        { status: 404 },
      )
    }

    const statusTimeline = buildStatusTimeline(order)

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order._id,
          orderedOn: order.createdAt,
          status: order.status || 'pending',
          trackingId: order.trackingId || null,
          courier: order.courier || null,
          courierTrackingUrl: order.courierTrackingUrl || null,
          estimatedDelivery: order.estimatedDelivery || null,
          paymentMethod: order.paymentMethod || 'online',
          paymentStatus: order.paymentStatus || 'pending',
          itemCount: order.items?.length || 0,
          timeline: statusTimeline,
        },
      },
      { status: 200 },
    )
  } catch (err) {
    console.error('[track-order]', err)
    return NextResponse.json({ success: false, message: 'Server error. Please try again.' }, { status: 500 })
  }
}

function buildStatusTimeline(order: any) {
  const allSteps = [
    { key: 'placed', label: 'Order Placed', description: 'Your order has been placed successfully.' },
    { key: 'confirmed', label: 'Order Confirmed', description: 'Your order has been confirmed by our boutique atelier.' },
    { key: 'packed', label: 'Order Packed', description: 'Your order has been carefully inspected and packaged.' },
    { key: 'shipped', label: 'Order Shipped', description: 'Your order is in transit with our logistics partner.' },
    { key: 'out_for_delivery', label: 'Out for Delivery', description: 'Your package is out for delivery today.' },
    { key: 'delivered', label: 'Delivered', description: 'Your order has been safely delivered.' },
  ]

  const statusOrder = ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered']
  const currentIndex = statusOrder.indexOf(order.status || 'placed')

  return allSteps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex,
    active: index === currentIndex,
    timestamp: index <= currentIndex ? (order.statusTimestamps?.[step.key] || null) : null,
  }))
}
