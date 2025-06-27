'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrendingUp, Flame, Star, ArrowRight, MessageSquare, Eye, Heart } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

interface TrendingPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
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
}

export default function TrendingWidget() {
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingPosts();
  }, []);

  const fetchTrendingPosts = async () => {
    try {
      const res = await fetch('/api/posts/trending');
      
      // Check if response is ok and has content
      if (!res.ok) {
        throw new Error(`API hatası: ${res.status} ${res.statusText}`);
      }

      // Check if response has content-type header indicating JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Response is not JSON:', contentType);
        setTrendingPosts([]);
        return;
      }

      // Get response text first to check if it's empty
      const responseText = await res.text();
      if (!responseText || responseText.trim() === '') {
        console.warn('Empty response received');
        setTrendingPosts([]);
        return;
      }

      // Parse JSON safely
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        setTrendingPosts([]);
        return;
      }
      
      // Ensure data is an array before calling slice
      const postsArray = Array.isArray(data) ? data : data.posts || [];
      
      // Map and ensure all required properties have default values
      const mappedPosts = postsArray.map((post: any) => ({
        _id: post._id || '',
        title: post.title || 'Başlıksız',
        slug: post.slug || '',
        content: post.content || '',
        author: {
          _id: post.author?._id || '',
          name: post.author?.name || 'Anonim',
          image: post.author?.image || undefined
        },
        category: post.category || 'Genel',
        views: post.views || 0,
        likesCount: post.likesCount || post.likes?.length || 0,
        commentsCount: post.commentsCount || post.comments?.length || 0,
        createdAt: post.createdAt || new Date().toISOString()
      }));
      
      setTrendingPosts(mappedPosts.slice(0, 5));
    } catch (error) {
      console.error('Trend gönderiler yüklenirken hata oluştu:', error);
      setTrendingPosts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | undefined | null) => {
    // Handle undefined, null, or invalid numbers
    const validNum = Number(num) || 0;
    
    if (validNum >= 1000000) {
      return `${(validNum / 1000000).toFixed(1)}M`;
    }
    if (validNum >= 1000) {
      return `${(validNum / 1000).toFixed(1)}K`;
    }
    return validNum.toString();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Bilinmiyor';
      }
      
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (minutes < 1) {
        return 'Az önce';
      } else if (minutes < 60) {
        return `${minutes} dakika önce`;
      } else if (hours < 24) {
        return `${hours} saat önce`;
      } else if (days < 30) {
        return `${days} gün önce`;
      } else {
        return date.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
    } catch (error) {
      return 'Bilinmiyor';
    }
  };

  return (
    <SpotlightCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Trend İçerikler
            </h2>
          </div>
          <Button variant="ghost" asChild className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 group">
            <Link href="/trending" className="flex items-center gap-2">
              Tümü
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : trendingPosts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Henüz trend içerik yok
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              İlk trend içeriği siz oluşturun
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {trendingPosts.map((post, index) => (
              <SpotlightCard
                key={post._id}
                className="group/post"
                spotlightColor={`rgba(${index * 40 + 100}, ${index * 30 + 120}, ${255 - index * 20}, 0.15)`}
              >
                <Link href={`/post/${post.slug}`} className="block p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
                        <AvatarImage src={post.author.image} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {post.author.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50">
                          #{post.category}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover/post:text-blue-600 dark:group-hover/post:text-blue-400 transition-colors duration-200">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Eye className="w-4 h-4" />
                          {formatNumber(post.views)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Heart className="w-4 h-4" />
                          {formatNumber(post.likesCount)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <MessageSquare className="w-4 h-4" />
                          {formatNumber(post.commentsCount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>
    </SpotlightCard>
  );
} 