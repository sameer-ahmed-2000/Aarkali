/* eslint-disable import/namespace */
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import mongoose from 'mongoose';

const orderSchema = z.object({
  paymentMethod: z.enum(['cod', 'razorpay', 'cashfree']),
  deliveryType: z.enum(['standard', 'same_day', 'scheduled']).default('standard'),
  deliveryAddress: z.any().optional(),
  items: z.array(z.object({
    product: z.string(),
    price: z.number(),
    quantity: z.number()
  })),
  total: z.number().min(0)
});

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    
    const query: any = {};
    if (!(token.roles as string[])?.includes('admin')) {
      query.orderedBy = token.id;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const orderedBy = token?.id || null;

    const body = await request.json();
    const validatedData = orderSchema.parse(body);

    await dbConnect();
    
    let order;
    
    // Use transaction if user is logged in to clear cart and update purchases
    if (orderedBy) {
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          order = await Order.create([{ ...validatedData, orderedBy }], { session });
          order = order[0];

          const productIds = validatedData.items.map(item => item.product);

          await User.findByIdAndUpdate(orderedBy, {
            $addToSet: { purchases: { $each: productIds } },
            $set: { 'cart.items': [] },
            $inc: { ordersCount: 1, totalSpent: validatedData.total }
          }, { session });
        });
      } finally {
        session.endSession();
      }
    } else {
      order = await Order.create(validatedData);
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
