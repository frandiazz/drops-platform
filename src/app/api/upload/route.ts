import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request: Request) {
  try {
    configureCloudinary();
    const body = await request.json();
    const { image } = body;

    const result = await cloudinary.uploader.upload(image, {
      folder: 'drops/content',
      resource_type: 'auto',
    });

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    configureCloudinary();
    const body = await request.json();
    const { publicId } = body;

    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
