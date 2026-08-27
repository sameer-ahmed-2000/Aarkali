import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { dbConnect } from '@/lib/mongoose';
import Media from '@/models/Media';
import { getToken } from 'next-auth/jwt';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !(token.roles as string[])?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await dbConnect();
    
    const media = await Media.findById(id);
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(media.cloudinaryId);

    // Delete from DB
    await Media.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Media delete error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await dbConnect();
    
    const media = await Media.findById(id);
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error('Media fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
