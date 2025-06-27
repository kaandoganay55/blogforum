'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModernLoader } from '@/components/ModernLoader';
import { Mail, Lock, User, UserPlus, Github, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';

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
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-purple-50/30 dark:from-green-950/20 dark:via-blue-950/10 dark:to-purple-950/20"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-md mx-auto space-y-6">
          {/* Logo or Brand */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50 border border-green-200/50 dark:border-green-800/50 text-green-700 dark:text-green-300 text-sm font-semibold backdrop-blur-sm transform hover:scale-105 transition-all duration-300 mb-4">
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              🎉 Yeni Üyelere Özel Ayrıcalıklar
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Topluluğumuza Katılın
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Hemen ücretsiz hesap oluşturun ve içerik paylaşmaya başlayın
            </p>
          </div>

          <SpotlightCard className="overflow-hidden">
            <div className="p-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ad Soyad
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="pl-10 bg-white dark:bg-gray-900"
                        placeholder="Adınız ve soyadınız"
                        autoComplete="name"
                      />
                    </div>
                  </div>

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
                        autoComplete="new-password"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      En az 8 karakter, 1 büyük harf ve 1 rakam içermelidir
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Kullanım koşullarını</span> ve <span className="font-medium">gizlilik politikasını</span> okudum ve kabul ediyorum.
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm font-medium animate-pulse">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Hesap oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Ücretsiz Üye Ol
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
                    Github ile Kayıt
                    <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      Yakında
                    </Badge>
                  </Button>
                </div>
              </form>
            </div>
          </SpotlightCard>

          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-400">Zaten hesabınız var mı?</span>
            <Button variant="link" asChild className="font-semibold text-green-600 dark:text-green-400 hover:text-green-500">
              <Link href="/login" className="inline-flex items-center">
                Giriş Yapın
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