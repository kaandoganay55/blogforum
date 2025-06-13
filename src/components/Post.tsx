'use client';

import { Session } from 'next-auth';
import { PostType } from '@/types/post';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
        >
          ← Ana Sayfaya Dön
        </Link>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-between text-gray-500 mb-8">
          <div className="flex items-center">
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{post.category}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="prose max-w-none mb-8">
        {post.content}
      </div>

      {(isAuthor || isAdmin) && (
        <div className="flex gap-4">
          {isAuthor && (
            <Link
              href={`/post/${post.slug}/edit`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Düzenle
            </Link>
          )}
          {(isAuthor || isAdmin) && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Siliniyor...' : 'Sil'}
            </button>
          )}
        </div>
      )}
    </div>
  );
} 