'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Flame, 
  TrendingUp, 
  Clock, 
  Eye, 
  Heart, 
  MessageSquare, 
  Calendar,
  Filter,
  SortDesc,
  Star,
  Award,
  Zap,
  BarChart3,
  ArrowUp
} from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';
import { ModernLoader } from '@/components/ModernLoader';

interface TrendingPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: {
    _id: string;
    name: string;
    image?: string;
  };
  category: string;
  views: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  trendScore?: number;
}

const timeFilters = [
  { id: 'today', label: 'Bugün', value: 1 },
  { id: 'week', label: 'Bu Hafta', value: 7 },
  { id: 'month', label: 'Bu Ay', value: 30 },
  { id: 'all', label: 'Tüm Zamanlar', value: 0 }
];

export default function TrendingPage() {
  const [posts, setPosts] = useState<TrendingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('week');
  const [sortBy, setSortBy] = useState('trendScore');

  useEffect(() => {
    fetchTrendingPosts();
  }, [activeFilter, sortBy]);

  const fetchTrendingPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts/trending');
      
      if (!res.ok) {
        throw new Error(`API hatası: ${res.status}`);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Response is not JSON');
        setPosts([]);
        return;
      }

      const responseText = await res.text();
      if (!responseText || responseText.trim() === '') {
        console.warn('Empty response received');
        setPosts([]);
        return;
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        setPosts([]);
        return;
      }

      const postsArray = Array.isArray(data) ? data : data.posts || [];
      
      // Filter by time period
      const filtered = filterByTime(postsArray, activeFilter);
      
      // Sort posts
      const sorted = sortPosts(filtered, sortBy);
      
      setPosts(sorted);
    } catch (error) {
      console.error('Trend gönderiler yüklenirken hata oluştu:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByTime = (posts: any[], timeFilter: string) => {
    if (timeFilter === 'all') return posts;
    
    const filter = timeFilters.find(f => f.id === timeFilter);
    if (!filter) return posts;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - filter.value);
    
    return posts.filter(post => new Date(post.createdAt) >= cutoffDate);
  };

  const sortPosts = (posts: any[], sortType: string) => {
    return [...posts].sort((a, b) => {
      switch (sortType) {
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'likes':
          return (b.likesCount || 0) - (a.likesCount || 0);
        case 'comments':
          return (b.commentsCount || 0) - (a.commentsCount || 0);
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'trendScore':
        default:
          return (b.trendScore || 0) - (a.trendScore || 0);
      }
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Bilinmiyor';
      
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (minutes < 1) return 'Az önce';
      if (minutes < 60) return `${minutes} dakika önce`;
      if (hours < 24) return `${hours} saat önce`;
      if (days < 30) return `${days} gün önce`;
      
      return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Bilinmiyor';
    }
  };

  const getTrendIcon = (index: number) => {
    switch (index) {
      case 0: return <Award className="w-5 h-5 text-yellow-500" />;
      case 1: return <Star className="w-5 h-5 text-gray-400" />;
      case 2: return <Zap className="w-5 h-5 text-orange-500" />;
      default: return <TrendingUp className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-red-400/10 dark:from-orange-400/5 dark:to-red-400/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-gradient-to-tl from-red-400/10 to-pink-400/10 dark:from-red-400/5 dark:to-pink-400/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl shadow-2xl mb-6">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🔥 Trend İçerikler
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            En popüler ve gündemdeki içerikleri keşfedin
          </p>
        </div>

        {/* Filters */}
        <SpotlightCard className="mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Time Filters */}
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {timeFilters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={activeFilter === filter.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(filter.id)}
                      className={`${
                        activeFilter === filter.id 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                          : 'hover:bg-orange-50 dark:hover:bg-orange-900/20'
                      }`}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <SortDesc className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                >
                  <option value="trendScore">Trend Skoru</option>
                  <option value="views">Görüntülenme</option>
                  <option value="likes">Beğeni</option>
                  <option value="comments">Yorum</option>
                  <option value="recent">En Yeni</option>
                </select>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <ModernLoader />
          </div>
        ) : posts.length === 0 ? (
          <SpotlightCard className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Henüz trend içerik yok
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              İçerikler etkileşim aldıkça burada görünecek
            </p>
          </SpotlightCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {posts.map((post, index) => (
              <SpotlightCard
                key={post._id}
                className="group hover:scale-[1.02] transition-all duration-300"
                spotlightColor={`rgba(${255 - index * 10}, ${100 + index * 20}, ${50 + index * 30}, 0.1)`}
              >
                <div className="p-6">
                  {/* Rank Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full">
                        {getTrendIcon(index)}
                        <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                          #{index + 1}
                        </span>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                        #{post.category}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>

                  {/* Content */}
                  <Link href={`/post/${post.slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200 cursor-pointer">
                      {post.title}
                    </h2>
                  </Link>

                  {post.excerpt && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Author & Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 border border-gray-200 dark:border-gray-700">
                        <AvatarImage src={post.author.image} />
                        <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm">
                          {post.author.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {post.author.name}
                      </span>
                    </div>

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
                  </div>

                  {/* Trend Score */}
                  {post.trendScore && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Trend Skoru</span>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-orange-500" />
                          <span className="font-semibold text-orange-600 dark:text-orange-400">
                            {formatNumber(post.trendScore)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}

        {/* Load More */}
        {posts.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Daha Fazla Yükle
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 