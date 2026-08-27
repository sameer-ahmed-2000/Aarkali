import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongoose'
import Order from '@/models/Order'
import User from '@/models/User'
import mongoose from 'mongoose'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      items,
      total,
      paymentMethod = 'cod',
      paymentStatus = 'pending',
      deliveryAddress,
      deliverySchedule = 'standard',
      couponApplied,
      discountAmount = 0,
      userId,
    } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart items are required to create an order.' },
        { status: 400 },
      )
    }

    const trackingId = `TRK${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`

    const orderData = {
      orderedBy: userId || null,
      total: Math.round(total),
      items: items.map((item: any) => ({
        product: typeof item.product === 'object' ? item.product.id || item.product._id : item.product,
        price: item.price || 0,
        quantity: item.quantity || 1,
      })),
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : paymentStatus,
      status: 'placed',
      trackingId,
      courier: 'Blue Dart / Delhivery Express',
      courierTrackingUrl: `https://www.bluedart.com/tracking?track=${trackingId}`,
      deliverySchedule,
      deliveryAddress: deliveryAddress || null,
      couponApplied: couponApplied || null,
      discountAmount: Number(discountAmount) || 0,
    }

    await dbConnect()

    let createdOrder;

    if (userId) {
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const orderArr = await Order.create([orderData], { session });
          createdOrder = orderArr[0];

          const productIds = orderData.items.map((item: any) => item.product);

          await User.findByIdAndUpdate(userId, {
            $addToSet: { purchases: { $each: productIds } },
            $set: { 'cart.items': [] },
            $inc: { ordersCount: 1, totalSpent: orderData.total }
          }, { session });
        });
      } finally {
        session.endSession();
      }
    } else {
      createdOrder = await Order.create(orderData);
    }

    return NextResponse.json(
      {
        success: true,
        orderId: createdOrder._id,
        trackingId,
        message: 'Order created successfully!',
      },
      { status: 201 },
    )
  } catch (err) {
    console.error('[orders/create]', err)
    return NextResponse.json(
      { success: false, message: 'Server error while creating order.' },
      { status: 500 },
    )
  }
}
