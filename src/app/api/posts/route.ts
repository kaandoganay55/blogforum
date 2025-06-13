import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import slugify from 'slugify';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Bu işlem için giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { title, content, category } = await req.json();

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Başlık, içerik ve kategori alanları zorunludur' },
        { status: 400 }
      );
    }

    const validCategories = ['Teknoloji', 'Bilim', 'Sanat', 'Spor', 'Diğer'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Geçersiz kategori seçimi' },
        { status: 400 }
      );
    }

    await connectDB();

    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: 'tr',
    });

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: 'Bu başlıkta bir gönderi zaten var' },
        { status: 400 }
      );
    }

    const post = await Post.create({
      title,
      content,
      category,
      slug,
      author: session.user.id,
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name email');

    return NextResponse.json(populatedPost, { status: 201 });
  } catch (error) {
    console.error('Gönderi oluşturma hatası:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Gönderi oluşturulurken doğrulama hatası oluştu' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Gönderi oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Gönderi listeleme hatası:', error);
    return NextResponse.json(
      { error: 'Gönderiler listelenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 