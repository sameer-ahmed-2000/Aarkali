import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import { SiteSettings, SiteHeader, SiteFooter } from '@/models/Site';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await dbConnect();
    let doc;
    if (params.slug === 'settings') {
      doc = await SiteSettings.findOne();
    } else if (params.slug === 'header') {
      doc = await SiteHeader.findOne();
    } else if (params.slug === 'footer') {
      doc = await SiteFooter.findOne();
    }
    
    if (!doc) {
      return NextResponse.json({ error: 'Global not found' }, { status: 404 });
    }
    
    return NextResponse.json(doc);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch global' }, { status: 500 });
  }
}
