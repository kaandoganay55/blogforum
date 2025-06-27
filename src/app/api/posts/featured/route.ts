import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET() {
  try {
    await connectDB();

    // Öne çıkan gönderileri al (beğeni + görüntülenme + yorum sayısına göre)
    const featuredPosts = await Post.aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ['$likes', []] } },
          commentsCount: { $size: { $ifNull: ['$comments', []] } },
          engagement: {
            $add: [
              { $multiply: [{ $size: { $ifNull: ['$likes', []] } }, 3] }, // Beğeniler 3x ağırlık
              { $multiply: [{ $ifNull: ['$views', 0] }, 1] }, // Görüntülemeler 1x ağırlık
              { $multiply: [{ $size: { $ifNull: ['$comments', []] } }, 5] } // Yorumlar 5x ağırlık
            ]
          }
        }
      },
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Son 30 gün
        }
      },
      {
        $sort: { engagement: -1 }
      },
      {
        $limit: 6
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
          engagement: 1,
          'author._id': 1,
          'author.name': 1,
          'author.email': 1,
          'author.image': 1
        }
      }
    ]);

    // İçerik özetini oluştur (ilk 150 karakter)
    const postsWithExcerpts = featuredPosts.map(post => ({
      ...post,
      excerpt: post.content.length > 150 
        ? post.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...'
        : post.content.replace(/<[^>]*>/g, '')
    }));

    return NextResponse.json(postsWithExcerpts);
  } catch (error) {
    console.error('Öne çıkan gönderiler listeleme hatası:', error);
    return NextResponse.json(
      { error: 'Öne çıkan gönderiler listelenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 