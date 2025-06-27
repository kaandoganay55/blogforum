import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TrendingWidget from '@/components/TrendingWidget';
import Squares from '@/components/Squares';
import SpotlightCard from '@/components/SpotlightCard';
import { 
  Plus, 
  Users, 
  FileText, 
  Eye, 
  TrendingUp, 
  Star,
  Calendar,
  Heart,
  ArrowRight,
  Sparkles,
  Clock,
  ExternalLink,
  MessageSquare,
  Zap
} from 'lucide-react';

interface PostData {
  _id: string;
  title: string;
  content: string;
  category: string;
  slug: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  views: number;
  likesCount: number;
}

const features = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'İçerik Paylaşımı',
    description: 'Düşüncelerinizi, deneyimlerinizi ve bilgilerinizi paylaşın.',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Etkileşim',
    description: 'Tartışmalara katılın, yorum yapın ve geri bildirim alın.',
    color: 'from-purple-600 to-pink-600',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Topluluk',
    description: 'Benzer ilgi alanlarına sahip kişilerle bağlantı kurun.',
    color: 'from-orange-600 to-red-600',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Seviye Sistemi',
    description: 'Katkılarınızla seviye atlayın ve rozetler kazanın.',
    color: 'from-green-600 to-emerald-600',
  },
];

export default async function HomePage() {
  await connectDB();

  // Son gönderileri getir
  const posts = await Post.find()
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  // İstatistikleri getir
  const [totalPosts, totalUsers] = await Promise.all([
    Post.countDocuments(),
    User.countDocuments()
  ]);

  // Kategorileri ve post sayılarını getir
  const categoryStats = await Post.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  const categories = categoryStats.map(stat => ({
    name: stat._id,
    count: stat.count
  }));

  // Convert ObjectId to string
  const serializedPosts: PostData[] = posts.map((post: any) => ({
    _id: post._id.toString(),
    title: post.title,
    content: post.content,
    category: post.category,
    slug: post.slug,
    author: {
      _id: post.author._id.toString(),
      name: post.author.name,
      email: post.author.email,
    },
    createdAt: post.createdAt?.toISOString() || new Date().toISOString(),
    views: post.views || 0,
    likesCount: post.likes?.length || 0,
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-48 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -top-48 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-48 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute -bottom-48 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-8 px-4 py-2 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
            ✨ Modern Blog & Forum Platformu
          </Badge>
          <h1 className="mb-8 text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            Düşüncelerinizi Paylaşın, Toplulukla Büyüyün
          </h1>
          <p className="mb-12 text-lg sm:text-xl text-gray-600 dark:text-gray-400">
            BlogForum, modern ve interaktif bir platform sunarak fikirlerinizi paylaşmanızı, 
            tartışmalara katılmanızı ve toplulukla etkileşime geçmenizi sağlar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/register" className="gap-2">
                Hemen Başla
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/explore">Keşfet</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Platform Özellikleri
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            BlogForum'un sunduğu özelliklerle düşüncelerinizi paylaşın ve toplulukla etkileşime geçin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <SpotlightCard key={index}>
              <div className="p-6">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Kategoriler
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            İlgi alanlarınıza göre içerikleri keşfedin.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category, index) => (
            <Link key={index} href={`/category/${encodeURIComponent(category.name)}`}>
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200 flex items-center gap-2"
              >
                {category.name}
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Son İçerikler
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Topluluğun en yeni paylaşımları.
          </p>
        </div>

        {serializedPosts.length === 0 ? (
          <SpotlightCard className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Henüz içerik yok
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              İlk içeriği siz oluşturun ve topluluğa katkıda bulunun!
            </p>
          </SpotlightCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serializedPosts.map((post, index) => (
              <SpotlightCard key={post._id} className="group/post h-full">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {post.category}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  
                  <Link href={`/post/${post.slug}`} className="block flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover/post:text-blue-600 dark:group-hover/post:text-blue-400 mb-3 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                  </Link>
                  
                  <div className="space-y-4 mt-auto">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.likesCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {calculateReadingTime(post.content)} dk
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                            {post.author.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {post.author.name}
                        </span>
                      </div>
                      
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/post/${post.slug}`}>
                          Oku
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="group">
            <Link href="/explore" className="flex items-center gap-2">
              Tüm İçerikleri Keşfet
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Trending Widget */}
      <section className="py-16">
        <TrendingWidget />
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <SpotlightCard>
          <div className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Topluluğa Katılın
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Siz de BlogForum ailesine katılın, düşüncelerinizi paylaşın ve toplulukla etkileşime geçin.
              Hemen ücretsiz hesap oluşturun ve içerik paylaşmaya başlayın.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Üye Ol</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Giriş Yap</Link>
              </Button>
            </div>
          </div>
        </SpotlightCard>
      </section>
    </div>
  );
}
