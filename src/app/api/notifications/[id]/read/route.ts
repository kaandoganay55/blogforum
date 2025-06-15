import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

// PUT - Bildirimi okundu olarak işaretle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Giriş yapmalısınız' }, { status: 401 });
    }

    await connectDB();

    const notification = await Notification.findOneAndUpdate(
      { 
        _id: params.id, 
        recipient: session.user.id 
      },
      { isRead: true },
      { new: true }
    ).populate('sender', 'name email image')
     .populate('post', 'title slug');

    if (!notification) {
      return NextResponse.json({ message: 'Bildirim bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(notification);

  } catch (error) {
    console.error('Bildirim güncellenemedi:', error);
    return NextResponse.json(
      { message: 'Bildirim güncellenemedi' },
      { status: 500 }
    );
  }
}

// POST - Tüm bildirimleri okundu olarak işaretle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Giriş yapmalısınız' }, { status: 401 });
    }

    await connectDB();

    const result = await Notification.updateMany(
      { 
        recipient: session.user.id,
        isRead: false
      },
      { isRead: true }
    );

    return NextResponse.json({ 
      message: 'Tüm bildirimler okundu olarak işaretlendi',
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Bildirimler güncellenemedi:', error);
    return NextResponse.json(
      { message: 'Bildirimler güncellenemedi' },
      { status: 500 }
    );
  }
} 