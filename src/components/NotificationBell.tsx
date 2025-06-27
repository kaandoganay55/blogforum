'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Bell, Check, Clock, Heart, MessageSquare, Star, User, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SpotlightCard from './SpotlightCard';

interface Notification {
  _id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  sender: {
    _id: string;
    name: string;
    image?: string;
  };
  post?: {
    _id: string;
    slug: string;
    title: string;
  };
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      const notificationsArray = Array.isArray(data) ? data : data.notifications || [];
      const mappedNotifications = notificationsArray.map((notification: any) => ({
        _id: notification._id || '',
        userId: notification.userId || '',
        type: notification.type || 'general',
        message: notification.message || 'Yeni bildirim',
        read: Boolean(notification.read ?? notification.isRead),
        createdAt: notification.createdAt || new Date().toISOString(),
        sender: {
          _id: notification.sender?._id || '',
          name: notification.sender?.name || 'Anonim',
          image: notification.sender?.image || undefined
        },
        post: notification.post ? {
          _id: notification.post._id || '',
          slug: notification.post.slug || '',
          title: notification.post.title || ''
        } : undefined
      }));
      setNotifications(mappedNotifications);
    } catch (error) {
      console.error('Bildirimler yüklenirken hata oluştu:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    setMarkingId(id);
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Bildirim okundu olarak işaretlenirken hata oluştu:', error);
    } finally {
      setMarkingId(null);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification._id);
    setIsOpen(false);
    if (notification.post && notification.post.slug) {
      router.push(`/post/${notification.post.slug}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <User className="w-4 h-4 text-purple-500" />;
      case 'mention':
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Bilinmiyor';
      }
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      if (minutes < 1) {
        return 'Az önce';
      } else if (minutes < 60) {
        return `${minutes} dakika önce`;
      } else if (hours < 24) {
        return `${hours} saat önce`;
      } else if (days < 30) {
        return `${days} gün önce`;
      } else {
        return date.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
    } catch (error) {
      return 'Bilinmiyor';
    }
  };

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500 text-white text-xs items-center justify-center">
                {unreadCount}
              </span>
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SpotlightCard className="h-full rounded-none">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
              <SheetTitle className="text-2xl font-bold">Bildirimler</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Henüz bildiriminiz yok
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Yeni bildirimleriniz burada görünecek
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`group transition-all duration-200 ${notification.read ? 'opacity-75' : 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10'} ${markingId === notification._id ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <SpotlightCard>
                        <div className="p-4 flex items-start gap-4">
                          <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
                            <AvatarImage src={notification.sender.image} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              {notification.sender.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {notification.sender.name}
                                </span>
                                <div className="flex items-center">
                                  {getNotificationIcon(notification.type)}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                  {formatDate(notification.createdAt)}
                                </span>
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    onClick={e => { e.stopPropagation(); markAsRead(notification._id); }}
                                    disabled={markingId === notification._id}
                                  >
                                    {markingId === notification._id ? (
                                      <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin block" />
                                    ) : (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                              {notification.message}
                              {notification.post && notification.post.title && (
                                <span className="ml-1 text-blue-600 dark:text-blue-400 font-medium">"{notification.post.title}"</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </SpotlightCard>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <Button
                  variant="outline"
                  className="w-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    if (Array.isArray(notifications)) {
                      notifications.forEach(n => !n.read && markAsRead(n._id));
                    }
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Tümünü Okundu İşaretle
                </Button>
              </div>
            )}
          </div>
        </SpotlightCard>
      </SheetContent>
    </Sheet>
  );
} 