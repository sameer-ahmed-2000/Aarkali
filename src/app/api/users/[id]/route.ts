import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { dbConnect } from '@/lib/mongoose';
import User from '@/models/User';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (token.id !== params.id && !(token.roles as string[])?.includes('admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    await dbConnect();
    
    // Only allow updating cart or specific fields
    const updateData: any = {};
    if (body.cart) {
      updateData.cart = body.cart;
    }

    const user = await User.findByIdAndUpdate(params.id, updateData, { new: true });
    
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
