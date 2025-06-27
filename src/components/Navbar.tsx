'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';
import SpotlightCard from './SpotlightCard';
import { 
  Menu, 
  X,
  Home,
  FileText,
  User,
  LogOut,
  Plus,
  Search,
  Compass,
  TrendingUp,
  Settings,
  Star,
  Heart,
  BookOpen,
  MessageSquare,
  Bell,
  ChevronRight,
  ArrowRight,
  UserPlus
} from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    {
      name: 'Ana Sayfa',
      href: '/',
      icon: Home,
      current: false
    },
    {
      name: 'Keşfet',
      href: '/explore',
      icon: Compass,
      current: false
    },
    {
      name: 'Trend',
      href: '/trending',
      icon: TrendingUp,
      current: false
    }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                ForumHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  asChild
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center max-w-md flex-1 mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Ara..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Create Button */}
            {session && (
              <Button asChild className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl group">
                <Link href="/post/create">
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                  Oluştur
                </Link>
              </Button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            {session && <NotificationBell />}

            {session ? (
              /* User Menu */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9 border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors duration-200">
                      <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium">
                        {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end" forceMount>
                  <div className="p-2">
                    <SpotlightCard className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar className="h-12 w-12 border-2 border-gray-200 dark:border-gray-700">
                            <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-medium">
                              {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              {session.user.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {session.user.email}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {[
                            { label: 'İçerik', value: '12', icon: FileText },
                            { label: 'Beğeni', value: '48', icon: Heart },
                            { label: 'Yorum', value: '24', icon: MessageSquare },
                            { label: 'Puan', value: '156', icon: Star }
                          ].map((stat) => (
                            <div key={stat.label} className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center gap-2">
                              <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md">
                                <stat.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{stat.value}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <Button variant="ghost" asChild className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 group">
                            <Link href="/profile" className="flex items-center">
                              <User className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                              Profil
                              <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                          </Button>
                          <Button variant="ghost" asChild className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 group">
                            <Link href="/posts" className="flex items-center">
                              <FileText className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                              İçeriklerim
                              <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                          </Button>
                          <Button variant="ghost" asChild className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 group">
                            <Link href="/settings" className="flex items-center">
                              <Settings className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                              Ayarlar
                              <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                          </Button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 group"
                            onClick={() => signOut()}
                          >
                            <LogOut className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                            Çıkış Yap
                          </Button>
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white group">
                  <Link href="/login" className="flex items-center gap-2">
                    Giriş
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl">
                  <Link href="/register">Kayıt Ol</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menüyü aç</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <SpotlightCard className="h-full rounded-none">
                  <div className="flex flex-col h-full p-6">
                    {/* Mobile Search */}
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Ara..."
                        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex flex-col gap-2">
                      {navigation.map((item) => (
                        <Button
                          key={item.name}
                          variant="ghost"
                          asChild
                          className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 group"
                        >
                          <Link href={item.href} className="flex items-center">
                            <item.icon className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                            {item.name}
                            <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                          </Link>
                        </Button>
                      ))}
                    </div>

                    {session ? (
                      <>
                        <div className="my-6 border-t border-gray-200 dark:border-gray-700" />
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="ghost"
                            asChild
                            className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 group"
                          >
                            <Link href="/profile" className="flex items-center">
                              <User className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                              Profil
                              <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            asChild
                            className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 group"
                          >
                            <Link href="/posts" className="flex items-center">
                              <FileText className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                              İçeriklerim
                              <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            asChild
                            className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800 group"
                          >
                            <Link href="/settings" className="flex items-center">
                              <Settings className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                              Ayarlar
                              <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                          </Button>
                        </div>
                        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 group"
                            onClick={() => signOut()}
                          >
                            <LogOut className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                            Çıkış Yap
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                        <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl">
                          <Link href="/register">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Kayıt Ol
                          </Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/login">
                            <User className="w-4 h-4 mr-2" />
                            Giriş Yap
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
} 