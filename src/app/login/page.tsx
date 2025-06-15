'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/20 to-pink-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center fade-in">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mb-8">
            <span className="text-white font-bold text-3xl">F</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Tekrar Hoş Geldiniz! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            ForumHub hesabınıza giriş yapın
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 slide-up" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                📧 Email Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 placeholder-gray-400 text-lg"
                placeholder="ornek@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                🔒 Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-800 placeholder-gray-400 text-lg"
                placeholder="Şifrenizi girin"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl text-center font-medium">
              ⚠️ {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 btn-hover"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Giriş yapılıyor...
                </>
              ) : (
                <>
                  🚀 Giriş Yap
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-6 bg-white text-gray-500 font-medium">veya</span>
            </div>
          </div>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Henüz hesabınız yok mu?
            </p>
            <Link 
              href="/register" 
              className="inline-flex items-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-2xl hover:bg-gray-50 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-lg"
            >
              🎯 Ücretsiz Kayıt Ol
            </Link>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>© 2024 ForumHub. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </div>
  );
} 