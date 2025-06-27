'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LikeButton from './LikeButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Eye, 
  MessageCircle, 
  Heart, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Calendar,
  User,
  Loader2
} from 'lucide-react';

interface Post {
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
  updatedAt: string;
}

interface ProfileClientProps {
  posts: Post[];
}

export default function ProfileClient({ posts: initialPosts }: ProfileClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (postId: string, postTitle: string) => {
    if (!confirm(`"${postTitle}" adlı gönderiyi silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      setDeletingId(postId);
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gönderi silinirken bir hata oluştu');
      }

      setPosts(posts.filter(post => post._id !== postId));
      alert('Gönderi başarıyla silindi! ✅');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Gönderi silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const truncateContent = (content: string, maxLength: number = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
      {posts.map((post, index) => (
        <Card 
          key={post._id} 
          className="group glass card-shadow border-gray-200 hover:shadow-md transition-all duration-300 fade-in bg-white/95" 
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <CardContent className="p-3 space-y-2">
            {/* Kompakt Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold">
                    {post.author.name?.charAt(0)?.toUpperCase() || <User className="w-2 h-2" />}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium truncate">{post.author.name}</span>
                    <span>•</span>
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span className="flex-shrink-0">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0 px-2 py-0.5 flex-shrink-0">
                {post.category}
              </Badge>
            </div>

            {/* Title - Clickable */}
            <Link href={`/post/${post.slug}`} className="block">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 cursor-pointer mb-1">
                {post.title}
              </h3>
            </Link>

            {/* Kompakt Content Preview */}
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {truncateContent(post.content)}
            </p>

            {/* Kompakt Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>0</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>0</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>0</span>
                </div>
              </div>
              <span className="text-gray-400 hidden sm:inline text-xs">
                {Math.ceil(post.content.length / 100)} dk
              </span>
            </div>

            {/* Kompakt Like Section */}
            <div className="flex justify-center py-1">
              <LikeButton 
                postId={post._id} 
                size="sm"
                showCount={true}
              />
            </div>

            {/* Kompakt Action Buttons */}
            <div className="flex items-center gap-1">
              <Button 
                asChild 
                variant="outline" 
                size="sm" 
                className="flex-1 gap-1 text-xs h-7 btn-hover border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Link href={`/post/${post.slug}`}>
                  <ExternalLink className="w-3 h-3" />
                  <span className="hidden xs:inline">Görüntüle</span>
                  <span className="xs:hidden">Gör</span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="sm" 
                className="gap-1 text-xs h-7 btn-hover border-green-200 text-green-700 hover:bg-green-50"
              >
                <Link href={`/post/${post.slug}/edit`}>
                  <Edit3 className="w-3 h-3" />
                  <span className="hidden xs:inline">Düzenle</span>
                  <span className="xs:hidden">Düz</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(post._id, post.title)}
                disabled={deletingId === post._id}
                className="gap-1 text-xs h-7 btn-hover border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
              >
                {deletingId === post._id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
                <span className="sr-only">Sil</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 