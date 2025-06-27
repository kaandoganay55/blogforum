import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // Yazarları performanslarına göre sırala
    const topAuthors = await Post.aggregate([
      {
        $group: {
          _id: '$author',
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: { $size: { $ifNull: ['$likes', []] } } },
          totalViews: { $sum: { $ifNull: ['$views', 0] } },
          totalComments: { $sum: { $size: { $ifNull: ['$comments', []] } } },
          latestPost: { $max: '$createdAt' }
        }
      },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ['$totalPosts', 10] },
              { $multiply: ['$totalLikes', 5] },
              { $multiply: ['$totalViews', 1] },
              { $multiply: ['$totalComments', 8] }
            ]
          }
        }
      },
      {
        $match: {
          totalPosts: { $gte: 1 }, // En az 1 gönderi
          latestPost: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) } // Son 60 gün aktif
        }
      },
      {
        $sort: { score: -1 }
      },
      {
        $limit: 6
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: '$user._id',
          name: '$user.name',
          email: '$user.email',
          image: '$user.image',
          level: '$user.level',
          xp: '$user.xp',
          badges: '$user.badges',
          totalPosts: 1,
          totalLikes: 1,
          totalViews: 1,
          totalComments: 1,
          score: 1,
          latestPost: 1
        }
      }
    ]);

    // Yazar bilgilerini zenginleştir
    const enrichedAuthors = topAuthors.map(author => ({
      ...author,
      bio: `${author.totalPosts} içerik, ${author.totalLikes} beğeni`,
      rank: author.level >= 5 ? 'Pro' : author.level >= 3 ? 'Aktif' : 'Yeni',
      engagementRate: author.totalPosts > 0 
        ? Math.round((author.totalLikes + author.totalComments) / author.totalPosts * 10) / 10
        : 0
    }));

    return NextResponse.json(enrichedAuthors);
  } catch (error) {
    console.error('Önerilen yazarlar listeleme hatası:', error);
    return NextResponse.json(
      { error: 'Önerilen yazarlar listelenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 