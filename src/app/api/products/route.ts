/* eslint-disable import/namespace */
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Product from '@/models/Product';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';

const productSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().min(0),
  salePrice: z.number().min(0).optional(),
  stock: z.number().min(0).default(10),
  lowStockThreshold: z.number().min(0).default(3),
  categories: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('draft'),
  layout: z.any().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query: any = {};
    if (url.searchParams.has('status')) query.status = url.searchParams.get('status');
    if (url.searchParams.has('category')) query.categories = url.searchParams.get('category');
    if (url.searchParams.has('slug')) query.slug = url.searchParams.get('slug');
    if (url.searchParams.has('search')) {
      query.title = { $regex: url.searchParams.get('search'), $options: 'i' };
    }

    const products = await Product.find(query)
      .populate('categories')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Product.countDocuments(query);

    return NextResponse.json({
      docs: products,
      totalDocs: total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !(token.roles as string[])?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    await dbConnect();
    
    const existing = await Product.findOne({ $or: [{ slug: validatedData.slug }, { sku: validatedData.sku }] });
    if (existing) {
      return NextResponse.json({ error: 'Product with this slug or SKU already exists' }, { status: 400 });
    }

    const product = await Product.create(validatedData);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Product create error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
