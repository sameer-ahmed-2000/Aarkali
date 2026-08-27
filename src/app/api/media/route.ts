import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { dbConnect } from '@/lib/mongoose';
import Media from '@/models/Media';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !(token.roles as string[])?.includes('admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = formData.get('alt') as string || file.name;
    const caption = formData.get('caption') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'aarkali_media' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    }) as any;

    await dbConnect();
    
    const media = await Media.create({
      url: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      alt,
      caption,
      width: uploadResult.width,
      height: uploadResult.height,
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const media = await Media.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Media.countDocuments();

    return NextResponse.json({
      docs: media,
      totalDocs: total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Media fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
