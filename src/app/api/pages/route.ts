import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Page from '@/models/Page';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const query: any = {};
    if (url.searchParams.has('slug')) query.slug = url.searchParams.get('slug');
    if (url.searchParams.has('status')) query.status = url.searchParams.get('status');

    const pages = await Page.find(query);
    return NextResponse.json({ docs: pages });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}
