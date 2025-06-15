import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Notification from '@/models/Notification';

// POST - Toggle like/unlike
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Giriş yapmalısınız' }, { status: 401 });
    }

    await connectDB();

    const post = await Post.findById(params.id).populate('author', 'name email');
    if (!post) {
      return NextResponse.json({ message: 'Post bulunamadı' }, { status: 404 });
    }

    const userId = session.user.id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike - beğeniyi kaldır
      post.likes = post.likes.filter((id: any) => id.toString() !== userId);
    } else {
      // Like - beğeni ekle
      post.likes.push(userId);
      
      // Bildirim gönder (kendi postunu beğenmiyorsa)
      if (post.author._id.toString() !== userId) {
        try {
          const notification = new Notification({
            recipient: post.author._id,
            sender: userId,
            type: 'like',
            message: 'gönderinizi beğendi',
            post: post._id,
          });
          await notification.save();
        } catch (error) {
          console.error('Bildirim gönderilemedi:', error);
        }
      }
    }

    await post.save();

    return NextResponse.json({
      isLiked: !isLiked,
      likesCount: post.likes.length,
      message: isLiked ? 'Beğeni kaldırıldı' : 'Beğenildi'
    });

  } catch (error) {
    console.error('Beğeni işlemi hatası:', error);
    return NextResponse.json(
      { message: 'Beğeni işlemi sırasında hata oluştu' },
      { status: 500 }
    );
  }
}

// GET - Get like status and count
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    await connectDB();

    const post = await Post.findById(params.id).select('likes');
    if (!post) {
      return NextResponse.json({ message: 'Post bulunamadı' }, { status: 404 });
    }

    const isLiked = session?.user?.id ? post.likes.includes(session.user.id) : false;

    return NextResponse.json({
      isLiked,
      likesCount: post.likes.length
    });

  } catch (error) {
    console.error('Beğeni durumu getirme hatası:', error);
    return NextResponse.json(
      { message: 'Beğeni durumu getirilemedi' },
      { status: 500 }
    );
  }
} 