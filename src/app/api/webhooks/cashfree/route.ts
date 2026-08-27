import { NextRequest, NextResponse } from 'next/server';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { dbConnect } from '@/lib/mongoose';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-webhook-signature');
    const timestamp = request.headers.get('x-webhook-timestamp');

    if (!signature || !timestamp) {
      return NextResponse.json({ error: 'Missing headers' }, { status: 400 });
    }

    Cashfree.XClientId = process.env.CASHFREE_APP_ID!;
    Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY!;
    Cashfree.XEnvironment = process.env.NODE_ENV === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;

    try {
      Cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const orderId = event.data.order.order_id;
      const paymentId = event.data.payment.cf_payment_id;

      await dbConnect();
      
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.paymentGatewayPaymentId = paymentId.toString();
        await order.save();
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Cashfree webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
