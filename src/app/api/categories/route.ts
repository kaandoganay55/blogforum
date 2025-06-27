import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET() {
  try {
    await connectDB();

    // Kategorilere göre gönderi sayılarını hesapla
    const categoryStats = await Post.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          latestPost: { $max: '$createdAt' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Kategori bilgilerini zenginleştir
    const categoriesWithIcons = [
      { 
        name: 'Teknoloji', 
        color: 'from-blue-500 to-purple-500', 
        icon: 'Flame',
        description: 'Yazılım, AI, yenilikler'
      },
      { 
        name: 'Bilim', 
        color: 'from-green-500 to-blue-500', 
        icon: 'Star',
        description: 'Araştırma, keşifler, bilimsel gelişmeler'
      },
      { 
        name: 'Sanat', 
        color: 'from-pink-500 to-purple-500', 
        icon: 'FileText',
        description: 'Yaratıcılık, kültür, estetik'
      },
      { 
        name: 'Spor', 
        color: 'from-orange-500 to-red-500', 
        icon: 'TrendingUp',
        description: 'Spor haberleri, analiz, sağlık'
      },
      { 
        name: 'Diğer', 
        color: 'from-gray-500 to-gray-600', 
        icon: 'Users',
        description: 'Genel konular ve çeşitli içerikler'
      }
    ];

    // Kategori istatistikleriyle birleştir
    const enrichedCategories = categoriesWithIcons.map(category => {
      const stats = categoryStats.find(stat => stat._id === category.name);
      return {
        ...category,
        postCount: stats?.count || 0,
        latestPost: stats?.latestPost || null
      };
    }).filter(category => category.postCount > 0); // Sadece içeriği olan kategorileri göster

    return NextResponse.json(enrichedCategories);
  } catch (error) {
    console.error('Kategori listeleme hatası:', error);
    return NextResponse.json(
      { error: 'Kategoriler listelenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 