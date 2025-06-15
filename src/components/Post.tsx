'use client';

import { Session } from 'next-auth';
import { PostType } from '@/types/post';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Comments from './Comments';
import LikeButton from './LikeButton';

interface Props {
  post: PostType;
  session: Session | null;
}

export default function Post({ post, session }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const isAuthor = session?.user?.id === post.author._id;
  const isAdmin = session?.user?.role === 'admin';

  const handleDelete = async () => {
    if (!confirm('Bu gönderiyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gönderi silinirken bir hata oluştu');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/10 to-pink-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors cursor-pointer"
          >
            ← Ana Sayfaya Dön
          </Link>

          {/* Post Container */}
          <div className="glass rounded-3xl card-shadow p-8 mb-8 fade-in">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {post.author.name?.charAt(0)?.toUpperCase() || '👤'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{post.author.name}</h3>
                  <p className="text-sm text-gray-500">
                    📅 {new Date(post.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm rounded-full font-medium">
                🏷️ {post.category}
              </span>
            </div>

            {/* Post Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none mb-8 text-gray-700 leading-relaxed">
              <div className="whitespace-pre-wrap">
                {post.content}
              </div>
            </div>

            {/* Post Stats & Actions */}
            <div className="space-y-4 py-6 border-t border-gray-200">
              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
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

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <LikeButton 
                  postId={post._id} 
                  size="lg"
                  showCount={true}
                />
                
                {(isAuthor || isAdmin) && (
                  <div className="flex gap-3">
                    {isAuthor && (
                      <Link
                        href={`/post/${post.slug}/edit`}
                        className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
                      >
                        ✏️ Düzenle
                      </Link>
                    )}
                    {(isAuthor || isAdmin) && (
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting ? (
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
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="glass rounded-3xl card-shadow p-8 slide-up">
            <Comments postId={post._id} />
          </div>
        </div>
      </div>
    </div>
  );
} 