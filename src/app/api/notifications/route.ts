import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

// GET - Kullanıcının bildirimlerini getir
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Giriş yapmalısınız' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const skip = (page - 1) * limit;

    // Query oluştur
    const query: any = { recipient: session.user.id };
    if (unreadOnly) {
      query.isRead = false;
    }

    // Bildirimleri getir
    const notifications = await Notification.find(query)
      .populate('sender', 'name email image')
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Toplam sayı
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      recipient: session.user.id, 
      isRead: false 
    });

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });

  } catch (error) {
    console.error('Bildirimler getirilemedi:', error);
    return NextResponse.json(
      { message: 'Bildirimler getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Bildirim oluştur (internal use)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Giriş yapmalısınız' }, { status: 401 });
    }

    await connectDB();

    const { recipient, type, message, post, comment } = await request.json();

    // Kendi kendine bildirim göndermeyi engelle
    if (recipient === session.user.id) {
      return NextResponse.json({ message: 'Kendi kendinize bildirim gönderemezsiniz' }, { status: 400 });
    }

    const notification = new Notification({
      recipient,
      sender: session.user.id,
      type,
      message,
      post,
      comment,
    });

    await notification.save();

    // Populate edilmiş bildirim döndür
    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'name email image')
      .populate('post', 'title slug')
      .lean();

    return NextResponse.json(populatedNotification, { status: 201 });

  } catch (error) {
    console.error('Bildirim oluşturulamadı:', error);
    return NextResponse.json(
      { message: 'Bildirim oluşturulamadı' },
      { status: 500 }
    );
  }
} 