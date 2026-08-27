import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/mongoose';
import Coupon from '@/models/Coupon';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const coupon = await Coupon.findById(params.id);
    if (!coupon) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    
    return NextResponse.json(coupon);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    const coupon = await Coupon.findByIdAndUpdate(params.id, body, { new: true });
    if (!coupon) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    
    return NextResponse.json(coupon);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).roles?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const coupon = await Coupon.findByIdAndDelete(params.id);
    if (!coupon) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
