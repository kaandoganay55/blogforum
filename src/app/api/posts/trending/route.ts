import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET() {
  try {
    await connectDB();

    // Trend gönderileri al (son 7 gündeki aktiviteye göre)
    const trendingPosts = await Post.aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ['$likes', []] } },
          commentsCount: { $size: { $ifNull: ['$comments', []] } },
          // Trend skorunu hesapla: recent activity + engagement
          trendScore: {
            $add: [
              { $multiply: [{ $size: { $ifNull: ['$likes', []] } }, 5] }, // Beğeniler 5x ağırlık
              { $multiply: [{ $ifNull: ['$views', 0] }, 1] }, // Görüntülemeler 1x ağırlık
              { $multiply: [{ $size: { $ifNull: ['$comments', []] } }, 10] }, // Yorumlar 10x ağırlık
              // Son günlerdeki postlara bonus puan
              {
                $cond: {
                  if: { $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                  then: 50,
                  else: 0
                }
              }
            ]
          }
        }
      },
      {
        $match: {
          // Son 30 gün içindeki gönderiler
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $sort: { trendScore: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $unwind: '$author'
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          category: 1,
          slug: 1,
          createdAt: 1,
          updatedAt: 1,
          views: 1,
          likesCount: 1,
          commentsCount: 1,
          trendScore: 1,
          'author._id': 1,
          'author.name': 1,
          'author.email': 1,
          'author.image': 1
        }
      }
    ]);

    // İçerik özetini oluştur (ilk 200 karakter)
    const postsWithExcerpts = trendingPosts.map(post => ({
      ...post,
      excerpt: post.content.length > 200 
        ? post.content.substring(0, 200).replace(/<[^>]*>/g, '') + '...'
        : post.content.replace(/<[^>]*>/g, '')
    }));

    return NextResponse.json(postsWithExcerpts);
  } catch (error) {
    console.error('Trend gönderiler listeleme hatası:', error);
    return NextResponse.json(
      { error: 'Trend gönderiler listelenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 