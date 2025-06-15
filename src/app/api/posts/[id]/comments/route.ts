import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Notification from '@/models/Notification';

// GET - Yorumları getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const post = await Post.findById(params.id).populate('comments.author', 'name email');

    if (!post) {
      return NextResponse.json({ message: 'Post bulunamadı' }, { status: 404 });
    }

    // Comments'ları tarihe göre sırala (en yeni önce)
    const sortedComments = post.comments.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return NextResponse.json({ comments: sortedComments });
  } catch (error) {
    console.error('Yorumlar getirilemedi:', error);
    return NextResponse.json(
      { message: 'Yorumlar getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yorum ekle
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

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ message: 'Yorum içeriği gerekli' }, { status: 400 });
    }

    if (content.length > 1000) {
      return NextResponse.json({ message: 'Yorum en fazla 1000 karakter olabilir' }, { status: 400 });
    }

    // Post'u kontrol et
    const post = await Post.findById(params.id).populate('author', 'name email');
    if (!post) {
      return NextResponse.json({ message: 'Post bulunamadı' }, { status: 404 });
    }

    // Yeni yorum objesi oluştur
    const newComment = {
      content: content.trim(),
      author: session.user.id,
      createdAt: new Date(),
    };

    // Post'a yorumu ekle
    post.comments.push(newComment);
    await post.save();

    // Bildirim gönder (kendi postuna yorum yapmıyorsa)
    if (post.author._id.toString() !== session.user.id) {
      try {
        const notification = new Notification({
          recipient: post.author._id,
          sender: session.user.id,
          type: 'comment',
          message: 'gönderinize yorum yaptı',
          post: post._id,
        });
        await notification.save();
      } catch (error) {
        console.error('Bildirim gönderilemedi:', error);
      }
    }

    // Güncellenmiş post ile yorumları getir
    const updatedPost = await Post.findById(params.id).populate('comments.author', 'name email');

    if (!updatedPost) {
      return NextResponse.json({ message: 'Güncellenmiş post bulunamadı' }, { status: 500 });
    }

    // Comments'ları tarihe göre sırala (en yeni önce)
    const sortedComments = updatedPost.comments.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // En son eklenen yorumu bul
    const addedComment = sortedComments.find((comment: any) => 
      comment.content === newComment.content && 
      comment.author._id.toString() === session.user.id
    );

    return NextResponse.json({
      comment: addedComment,
      comments: sortedComments
    }, { status: 201 });

  } catch (error) {
    console.error('Yorum eklenirken hata oluştu:', error);
    return NextResponse.json(
      { message: 'Yorum eklenirken hata oluştu' },
      { status: 500 }
    );
  }
} 