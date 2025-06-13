'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-900">
            ForumHub
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/post/create"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Yeni Gönderi
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Gönderilerim
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 