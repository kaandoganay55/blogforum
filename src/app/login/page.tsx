'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModernLoader } from '@/components/ModernLoader';
import { Mail, Lock, LogIn, UserPlus, Github, Loader2, ArrowRight } from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';

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
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-md mx-auto space-y-6">
          {/* Logo or Brand */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ForumHub'a Hoş Geldiniz 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Topluluğumuza katılmak için giriş yapın
            </p>
          </div>

          <SpotlightCard className="overflow-hidden">
            <div className="p-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Adresi
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="pl-10 bg-white dark:bg-gray-900"
                        placeholder="ornek@email.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Şifre
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="pl-10 bg-white dark:bg-gray-900"
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Beni hatırla
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                      Şifremi unuttum
                    </Link>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm font-medium animate-pulse">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Giriş yapılıyor...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Giriş Yap
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                      veya
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-2 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    disabled
                  >
                    <Github className="w-5 h-5 mr-2" />
                    Github ile Giriş
                    <Badge className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      Yakında
                    </Badge>
                  </Button>
                </div>
              </form>
            </div>
          </SpotlightCard>

          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-400">Hesabınız yok mu?</span>
            <Button variant="link" asChild className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500">
              <Link href="/register" className="inline-flex items-center">
                Hemen Üye Olun
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            © 2024 ForumHub. Tüm hakları saklıdır.
          </div>
        </div>
      </div>
    </div>
  );
} 