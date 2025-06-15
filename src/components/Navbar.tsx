'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // Add a small delay before closing
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300); // 300ms delay
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleMenuItemClick = () => {
    setIsDropdownOpen(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <nav className="glass border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ForumHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {session ? (
              <>
                {/* Notification Bell */}
                <NotificationBell />
                
                {/* Profile Dropdown */}
                <div 
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Profile Trigger */}
                  <div className="flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {session.user?.name?.charAt(0)?.toUpperCase() || '👤'}
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-sm font-medium text-gray-800">
                        {session.user?.name || 'Kullanıcı'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.user?.email}
                      </div>
                    </div>
                    <div className="text-gray-400 transition-transform duration-200">
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-64 glass rounded-2xl card-shadow border border-white/20 py-2 slide-up"
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {session.user?.name?.charAt(0)?.toUpperCase() || '👤'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {session.user?.name || 'Kullanıcı'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {session.user?.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          href="/post/create"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                          onClick={handleMenuItemClick}
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600">✍️</span>
                          </div>
                          <div>
                            <div className="font-medium">Yeni Gönderi</div>
                            <div className="text-xs text-gray-500">Fikirlerinizi paylaşın</div>
                          </div>
                        </Link>
                        
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                          onClick={handleMenuItemClick}
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600">👤</span>
                          </div>
                          <div>
                            <div className="font-medium">Gönderilerim</div>
                            <div className="text-xs text-gray-500">Yazılarınızı yönetin</div>
                          </div>
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={() => {
                            handleSignOut();
                            handleMenuItemClick();
                          }}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer w-full text-left"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-red-600">🚪</span>
                          </div>
                          <div>
                            <div className="font-medium">Çıkış Yap</div>
                            <div className="text-xs text-gray-500">Hesabınızdan çıkın</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300 font-semibold cursor-pointer"
                >
                  🔑 Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold btn-hover cursor-pointer"
                >
                  🎯 Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
          >
            <div className="flex flex-col space-y-1">
              <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4 slide-up">
            <div className="space-y-3">
              {session ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {session.user?.name?.charAt(0)?.toUpperCase() || '👤'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {session.user?.name || 'Kullanıcı'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.user?.email}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/post/create"
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 font-semibold cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ✍️ Yeni Gönderi
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👤 Gönderilerim
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 font-medium w-full text-left cursor-pointer"
                  >
                    🚪 Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-300 font-semibold cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🔑 Giriş Yap
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🎯 Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 