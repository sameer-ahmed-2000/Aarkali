import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { dbConnect } from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ user: null });
    }

    await dbConnect();
    const user = await User.findById(token.id);
    
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
