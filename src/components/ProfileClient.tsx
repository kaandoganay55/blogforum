'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LikeButton from './LikeButton';

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

      // Remove the post from the state
      setPosts(posts.filter(post => post._id !== postId));
      
      // Show success message
      alert('Gönderi başarıyla silindi! ✅');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Gönderi silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {posts.map((post, index) => (
        <article
          key={post._id}
          className="group glass rounded-3xl card-shadow p-6 hover:scale-105 transition-all duration-300 fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Post Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {post.author.name?.charAt(0)?.toUpperCase() || '👤'}
              </div>
              <div>
                <span className="font-medium text-gray-800 text-sm">
                  {post.author.name}
                </span>
                <div className="text-xs text-gray-500">
                  📅 {new Date(post.createdAt).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs rounded-full font-medium">
              🏷️ {post.category}
            </span>
          </div>

          {/* Post Content */}
          <Link href={`/post/${post.slug}`} className="block cursor-pointer">
            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
              {post.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 line-clamp-3 mb-4 text-sm leading-relaxed">
            {post.content}
          </p>

          {/* Post Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                📊 {post.content.length} karakter
              </span>
              <span className="flex items-center gap-1">
                👁️ 0 görüntülenme
              </span>
              <span className="flex items-center gap-1">
                💬 0 yorum
              </span>
            </div>
            <span className="flex items-center gap-1">
              ❤️ 0 beğeni
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            {/* Like Button */}
            <div className="flex justify-center">
              <LikeButton 
                postId={post._id} 
                size="sm"
                showCount={true}
              />
            </div>
            
            {/* Management Buttons */}
            <div className="flex items-center justify-between gap-3">
              <Link
                href={`/post/${post.slug}`}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 cursor-pointer"
              >
                📖 Görüntüle
              </Link>
              
              <div className="flex items-center gap-2">
                <Link
                  href={`/post/${post.slug}/edit`}
                  className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer"
                >
                  ✏️ Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(post._id, post.title)}
                  disabled={deletingId === post._id}
                  className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === post._id ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-700"></div>
                      Siliniyor...
                    </>
                  ) : (
                    <>
                      🗑️ Sil
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
} 