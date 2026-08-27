import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/mongoose';
import Coupon from '@/models/Coupon';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    // Create new coupon
    const newCoupon = new Coupon(body);
    await newCoupon.save();
    
    return NextResponse.json(newCoupon, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
