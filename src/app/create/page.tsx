'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function CreatePostPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Oturum kontrolü
  if (!session) {
    router.push('/login');
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          category,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Bir hata oluştu');
      }

      router.push('/');
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Yeni Gönderi Oluştur</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Başlık
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Kategori
            </label>
            <select
              name="category"
              id="category"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Kategori seçin</option>
              <option value="yazılım">Yazılım</option>
              <option value="sanat">Sanat</option>
              <option value="teknoloji">Teknoloji</option>
              <option value="diğer">Diğer</option>
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              İçerik
            </label>
            <textarea
              name="content"
              id="content"
              rows={6}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Gönderiliyor...' : 'Gönderi Oluştur'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 