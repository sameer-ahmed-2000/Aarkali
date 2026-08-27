import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbConnect } from '@/lib/mongoose';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(text);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      await dbConnect();
      
      const order = await Order.findOne({ paymentGatewayOrderId: razorpayOrderId });
      if (order) {
        order.paymentStatus = 'paid';
        order.paymentGatewayPaymentId = payment.id;
        await order.save();
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
