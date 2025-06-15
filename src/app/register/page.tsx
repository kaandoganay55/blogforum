'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Bir hata oluştu');
      }

      router.push('/login');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-400/20 to-purple-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center fade-in">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl mb-8">
            <span className="text-white font-bold text-3xl">🎯</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Topluluğa Katılın! 🚀
          </h2>
          <p className="text-gray-600 text-lg">
            ForumHub'da yeni hesabınızı oluşturun
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 slide-up" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                👤 Ad Soyad
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="form-input w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-gray-800 placeholder-gray-400 text-lg"
                placeholder="Adınız ve soyadınız"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                📧 Email Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-gray-800 placeholder-gray-400 text-lg"
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
                className="form-input w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-gray-800 placeholder-gray-400 text-lg"
                placeholder="Güçlü bir şifre oluşturun"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl text-center font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Terms */}
          <div className="flex items-start space-x-3">
            <input
              id="terms"
              type="checkbox"
              required
              className="mt-1 w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              <span className="font-medium">Kullanım koşullarını</span> ve <span className="font-medium">gizlilik politikasını</span> okudum ve kabul ediyorum.
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 btn-hover"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Hesap oluşturuluyor...
                </>
              ) : (
                <>
                  🎯 Hesap Oluştur
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

          {/* Sign in link */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Zaten hesabınız var mı?
            </p>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-2xl hover:bg-gray-50 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-lg"
            >
              🔑 Giriş Yap
            </Link>
          </div>
        </form>

        {/* Features */}
        <div className="mt-8 p-6 glass rounded-3xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            🌟 Neden ForumHub?
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-gray-600">Tamamen ücretsiz kullanım</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">✓</span>
              </div>
              <span className="text-gray-600">Aktif ve dostane topluluk</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">✓</span>
              </div>
              <span className="text-gray-600">Modern ve kullanıcı dostu arayüz</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>© 2024 ForumHub. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </div>
  );
} 