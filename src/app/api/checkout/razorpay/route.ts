import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { dbConnect } from '@/lib/mongoose';
import Order from '@/models/Order';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    await dbConnect();
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Razorpay amounts are in paise
    const amountInPaise = Math.round(order.total * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: order._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    order.paymentGatewayOrderId = razorpayOrder.id;
    await order.save();

    return NextResponse.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error('Razorpay checkout error:', error);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
