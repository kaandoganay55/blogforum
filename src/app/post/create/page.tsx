'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const CATEGORIES = ['Teknoloji', 'Bilim', 'Sanat', 'Spor', 'Diğer'] as const;

export default function CreatePostPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/posts', {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gönderi oluşturulurken bir hata oluştu');
      }

      // Success message
      alert('🎉 Gönderi başarıyla oluşturuldu!');
      
      // Redirect to profile page to see the new post
      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12">
        <div className="glass rounded-3xl card-shadow p-12 text-center max-w-md w-full mx-4">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Giriş Yapmanız Gerekiyor
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Gönderi oluşturmak için lütfen giriş yapın.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold cursor-pointer btn-hover"
          >
            🔑 Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-400/10 to-purple-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 fade-in">
            <div className="inline-block p-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl shadow-2xl mb-6">
              <span className="text-4xl">✍️</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Yeni Gönderi Oluştur
            </h1>
            <p className="text-xl text-gray-600">
              Fikirlerinizi toplulukla paylaşın ve tartışma başlatın! 🚀
            </p>
          </div>

          <div className="glass rounded-3xl card-shadow p-8 slide-up">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl mb-8 text-center font-medium">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-lg font-semibold text-gray-800 mb-3">
                  📝 Başlık
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="form-input w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-gray-800 placeholder-gray-400 text-lg"
                  placeholder="Gönderi başlığınızı yazın..."
                />
              </div>

              {/* Category Select */}
              <div>
                <label htmlFor="category" className="block text-lg font-semibold text-gray-800 mb-3">
                  🏷️ Kategori
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="form-input w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-gray-800 text-lg cursor-pointer"
                >
                  <option value="">Kategori seçin...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content Textarea */}
              <div>
                <label htmlFor="content" className="block text-lg font-semibold text-gray-800 mb-3">
                  📄 İçerik
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={12}
                  className="form-input w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-gray-800 placeholder-gray-400 text-lg resize-none"
                  placeholder="Gönderi içeriğinizi detaylı bir şekilde yazın..."
                />
                <div className="mt-2 text-sm text-gray-500">
                  💡 Karakter sayısı: {content.length}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold cursor-pointer"
                >
                  ❌ İptal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim() || !category}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 btn-hover cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      🚀 Gönderiyi Yayınla
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Tips Section */}
            <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                💡 İpuçları
              </h3>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Başlığınızı açık ve dikkat çekici yazın
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  İçeriğinizi detaylı ve anlaşılır bir şekilde açıklayın
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Doğru kategoriyi seçerek hedef kitleye ulaşın
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Saygılı ve yapıcı bir dil kullanın
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 