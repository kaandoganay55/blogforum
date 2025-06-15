'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  message: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  post?: {
    _id: string;
    title: string;
    slug: string;
  };
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Bildirimleri getir
  const fetchNotifications = async () => {
    if (!session) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/notifications?limit=10');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Bildirimler getirilemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    if (session) {
      fetchNotifications();
      
      // Her 30 saniyede bir güncelle
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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

  // Bildirimi okundu olarak işaretle
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Bildirim güncellenemedi:', error);
    }
  };

  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read', {
        method: 'POST',
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Bildirimler güncellenemedi:', error);
    }
  };

  // Bildirim tipine göre emoji
  const getNotificationEmoji = (type: string) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👥';
      case 'mention': return '📢';
      default: return '🔔';
    }
  };

  // Bildirim tipine göre renk
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like': return 'text-pink-600 bg-pink-50';
      case 'comment': return 'text-blue-600 bg-blue-50';
      case 'follow': return 'text-green-600 bg-green-50';
      case 'mention': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Zaman formatı
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Şimdi';
    if (minutes < 60) return `${minutes}dk önce`;
    if (hours < 24) return `${hours}sa önce`;
    if (days < 7) return `${days}g önce`;
    return date.toLocaleDateString('tr-TR');
  };

  if (!session) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
      >
        <div className="w-6 h-6 relative">
          🔔
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 glass rounded-2xl card-shadow border border-white/20 py-4 slide-up z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              🔔 Bildirimler
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Tümünü okundu işaretle
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔕</div>
                <p className="text-gray-600">Henüz bildirim yok</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`
                      px-6 py-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer
                      ${!notification.isRead ? 'bg-blue-50/50' : ''}
                    `}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification._id);
                      }
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {notification.sender.image ? (
                          <img
                            src={notification.sender.image}
                            alt={notification.sender.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {notification.sender.name?.charAt(0)?.toUpperCase() || '👤'}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-sm
                            ${getNotificationColor(notification.type)}
                          `}>
                            {getNotificationEmoji(notification.type)}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-800 leading-relaxed">
                          <span className="font-semibold">{notification.sender.name}</span>
                          {' '}
                          {notification.message}
                        </p>
                        
                        {notification.post && (
                          <Link
                            href={`/post/${notification.post.slug}`}
                            className="text-xs text-blue-600 hover:text-blue-700 mt-1 block truncate"
                            onClick={(e) => e.stopPropagation()}
                          >
                            📄 {notification.post.title}
                          </Link>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-6 pt-4 border-t border-gray-100">
              <Link
                href="/notifications"
                className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Tüm bildirimleri görüntüle
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 