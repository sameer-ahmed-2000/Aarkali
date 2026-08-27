import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Product from '@/models/Product';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id).populate('categories relatedProducts');
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !(token.roles as string[])?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    const product = await Product.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    revalidatePath(`/products/${product.slug}`);
    revalidateTag('products');

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !(token.roles as string[])?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const product = await Product.findByIdAndDelete(params.id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await User.updateMany(
      { 'cart.items.product': params.id },
      { $pull: { 'cart.items': { product: params.id } } }
    );

    revalidatePath(`/products`);
    revalidateTag('products');

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
