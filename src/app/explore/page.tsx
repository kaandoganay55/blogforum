'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Flame, 
  Star, 
  TrendingUp, 
  FileText, 
  ArrowRight, 
  User,
  Eye,
  Heart,
  MessageSquare,
  Clock,
  Crown,
  Award
} from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';
import { ModernLoader } from '@/components/ModernLoader';

interface Category {
  name: string;
  color: string;
  icon: string;
  description: string;
  postCount: number;
  latestPost: string | null;
}

interface FeaturedPost {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  author: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
  views: number;
  likesCount: number;
  commentsCount: number;
  engagement: number;
}

interface FeaturedAuthor {
  _id: string;
  name: string;
  email: string;
  image?: string;
  bio: string;
  rank: string;
  level: number;
  totalPosts: number;
  totalLikes: number;
  totalViews: number;
  engagementRate: number;
  badges: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
}

const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: any } = {
    Flame,
    Star,
    TrendingUp,
    FileText,
    Users
  };
  return icons[iconName] || Users;
};

export default function ExplorePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<FeaturedPost[]>([]);
  const [featuredAuthors, setFeaturedAuthors] = useState<FeaturedAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, postsRes, authorsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/posts/featured'),
          fetch('/api/users/featured')
        ]);

        let [categoriesData, postsData, authorsData] = await Promise.all([
          categoriesRes.json(),
          postsRes.json(),
          authorsRes.json()
        ]);

        // Fallback for undefined/null/NaN numeric fields
        categoriesData = (categoriesData || []).map((cat: any) => ({
          ...cat,
          postCount: cat.postCount ?? 0
        }));
        postsData = (postsData || []).map((post: any) => ({
          ...post,
          views: post.views ?? 0,
          likesCount: post.likesCount ?? 0,
          commentsCount: post.commentsCount ?? 0
        }));
        authorsData = (authorsData || []).map((author: any) => ({
          ...author,
          totalPosts: author.totalPosts ?? 0,
          totalLikes: author.totalLikes ?? 0,
          totalViews: author.totalViews ?? 0,
          engagementRate: author.engagementRate ?? 0
        }));

        setCategories(categoriesData);
        setFeaturedPosts(postsData);
        setFeaturedAuthors(authorsData);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Bugün';
    if (days === 1) return 'Dün';
    if (days < 7) return `${days} gün önce`;
    if (days < 30) return `${Math.floor(days / 7)} hafta önce`;
    return `${Math.floor(days / 30)} ay önce`;
  };

  const formatNumber = (num: number | string | undefined | null) => {
    const validNum = Number(num) || 0;
    if (validNum >= 1000000) return `${(validNum / 1000000).toFixed(1)}M`;
    if (validNum >= 1000) return `${(validNum / 1000).toFixed(1)}K`;
    return validNum.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container-modern py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <ModernLoader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        {/* Başlık */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Keşfet
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Popüler kategoriler, öne çıkan içerikler ve topluluğun en iyi yazarları burada. 
            İlham al, yeni konular keşfet ve topluluğa katıl!
          </p>
        </div>

        {/* Kategoriler */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Popüler Kategoriler</h2>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2">
              {categories.length} Aktif Kategori
            </Badge>
          </div>
          
          {categories.length === 0 ? (
            <SpotlightCard className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Henüz kategori yok
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                İlk içeriği oluşturun ve kategoriler burada görünsün
              </p>
            </SpotlightCard>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <SpotlightCard 
                    key={category.name} 
                    className="group/category"
                    spotlightColor="rgba(99, 102, 241, 0.15)"
                  >
                    <Link href={`/category/${encodeURIComponent(category.name)}`}>
                      <div className={`p-6 bg-gradient-to-br ${category.color} text-white rounded-lg h-full`}>
                        <div className="flex flex-col items-center gap-3 text-center">
                          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-2 group-hover/category:scale-110 group-hover/category:rotate-6 transition-all duration-300">
                            <IconComponent className="w-7 h-7" />
                          </div>
                          <div className="space-y-2">
                            <div className="text-lg font-bold">{category.name}</div>
                            <div className="text-sm opacity-90">{category.description}</div>
                            <Badge className="bg-white/20 text-white hover:bg-white/30">
                              {category.postCount} içerik
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SpotlightCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Öne Çıkan İçerikler */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Öne Çıkan İçerikler</h2>
            <Button asChild variant="outline" className="group">
              <Link href="/posts" className="flex items-center gap-2">
                Tümünü Gör
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>
          </div>

          {featuredPosts.length === 0 ? (
            <SpotlightCard className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Henüz öne çıkan içerik yok
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                İçerikler beğeni ve etkileşim aldıkça burada görünecek
              </p>
            </SpotlightCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <SpotlightCard 
                  key={post._id} 
                  className="group/post h-full"
                  spotlightColor={`rgba(${index * 40 + 100}, ${index * 30 + 120}, ${255 - index * 20}, 0.15)`}
                >
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
                        {post.excerpt}
                      </p>
                    </Link>
                    
                    <div className="space-y-4 mt-auto">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatNumber(post.views)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {formatNumber(post.likesCount)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {formatNumber(post.commentsCount)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={post.author.image} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                              {post.author.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {post.author.name}
                          </span>
                        </div>
                        
                        <Button asChild size="sm" variant="outline" className="group-hover/post:border-blue-400 dark:group-hover/post:border-blue-500">
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
        </div>

        {/* Önerilen Yazarlar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Önerilen Yazarlar</h2>
            <Button asChild variant="outline" className="group">
              <Link href="/authors" className="flex items-center gap-2">
                Tüm Yazarlar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>
          </div>

          {featuredAuthors.length === 0 ? (
            <SpotlightCard className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Henüz aktif yazar yok
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Yazarlar içerik oluşturdukça burada görünecek
              </p>
            </SpotlightCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAuthors.map((author, index) => (
                <SpotlightCard 
                  key={author._id} 
                  className="group/author"
                  spotlightColor={`rgba(${index * 50 + 120}, ${index * 40 + 100}, ${255 - index * 30}, 0.15)`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="w-16 h-16 border-2 border-gray-200 dark:border-gray-700">
                          <AvatarImage src={author.image} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold">
                            {author.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        {author.rank === 'Pro' && (
                          <div className="absolute -top-2 -right-2 p-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                            {author.name}
                          </h3>
                          <Badge 
                            className={`text-xs ${
                              author.rank === 'Pro' 
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                                : author.rank === 'Aktif'
                                ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                          >
                            {author.rank}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {author.bio}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <div>Level {author.level}</div>
                          <div>⚡ {author.engagementRate}</div>
                          <div>👁️ {formatNumber(author.totalViews)}</div>
                          <div>🏆 {author.badges?.length || 0} rozet</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 