import { NextRequest, NextResponse } from 'next/server';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { dbConnect } from '@/lib/mongoose';
import Order from '@/models/Order';

Cashfree.XClientId = process.env.CASHFREE_APP_ID!;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY!;
Cashfree.XEnvironment = process.env.NODE_ENV === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    await dbConnect();
    const order = await Order.findById(orderId).populate('orderedBy');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const customerDetails = {
      customer_id: order.orderedBy ? (order.orderedBy as any)._id.toString() : 'guest',
      customer_phone: order.orderedBy ? (order.orderedBy as any).phone || '9999999999' : '9999999999',
      customer_email: order.orderedBy ? (order.orderedBy as any).email : 'guest@example.com',
    };

    const requestObj = {
      order_amount: order.total,
      order_currency: 'INR',
      order_id: order._id.toString(),
      customer_details: customerDetails,
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${order._id}`,
      },
    };

    const response = await Cashfree.PGCreateOrder('2023-08-01', requestObj);

    order.paymentGatewayOrderId = response.data?.order_id || order._id.toString();
    await order.save();

    return NextResponse.json({
      payment_session_id: response.data?.payment_session_id,
    });
  } catch (error) {
    console.error('Cashfree checkout error:', error);
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
  }
}
