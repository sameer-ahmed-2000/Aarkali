/* eslint-disable import/namespace */
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Category from '@/models/Category';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';

const categorySchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  media: z.string().optional(),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().default(0),
});

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const query: any = {};
    if (url.searchParams.has('slug')) query.slug = url.searchParams.get('slug');
    
    const categories = await Category.find(query).sort({ displayOrder: 1, title: 1 });
    return NextResponse.json({ docs: categories });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    console.log('--- DEBUG POST /api/categories ---');
    console.log('Secret exists?', !!process.env.NEXTAUTH_SECRET);
    console.log('Token:', token);
    
    if (!token || !(token.roles as string[])?.includes('admin')) {
      console.log('Unauthorized because:', !token ? 'No token' : 'No admin role');
      return NextResponse.json({ error: 'Unauthorized', token_exists: !!token }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    await dbConnect();
    
    const existing = await Category.findOne({ slug: validatedData.slug });
    if (existing) {
      return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 400 });
    }

    const category = await Category.create(validatedData);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
