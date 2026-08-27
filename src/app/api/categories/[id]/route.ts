import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Category from '@/models/Category';
import { getToken } from 'next-auth/jwt';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const category = await Category.findById(params.id);
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
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

    const category = await Category.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    revalidatePath('/products');
    revalidateTag('categories');

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !(token.roles as string[])?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const category = await Category.findByIdAndDelete(params.id);
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    revalidatePath('/products');
    revalidateTag('categories');

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
