import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { message: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    await connectDB();

    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json(
        { message: 'Gönderi bulunamadı' },
        { status: 404 }
      );
    }

    // Sadece yazar veya admin silebilir
    if (
      post.author.toString() !== session.user.id &&
      session.user.role !== 'admin'
    ) {
      return NextResponse.json(
        { message: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    await post.deleteOne();

    return NextResponse.json(
      { message: 'Gönderi başarıyla silindi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Gönderi silme hatası:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 