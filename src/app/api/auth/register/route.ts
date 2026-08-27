import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  passwordConfirm: z.string().min(6),
}).refine(data => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = registerSchema.parse(body);

    await dbConnect();
    
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const count = await User.countDocuments();
    const roles = count === 0 ? ['admin', 'customer'] : ['customer'];

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      roles,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
