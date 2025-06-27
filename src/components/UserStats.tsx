'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Heart, MessageSquare, Star, Trophy, Users, Zap } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

interface UserStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  followers: number;
  following: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  rank: number;
  badges: string[];
}

export default function UserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const res = await fetch('/api/user/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Kullanıcı istatistikleri yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | string | undefined | null) => {
    const validNum = Number(num) || 0;
    return validNum.toLocaleString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          İstatistikler yüklenemedi
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Lütfen daha sonra tekrar deneyin
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* XP Progress */}
      <SpotlightCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Seviye {stats.level}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatNumber(stats.xp)} / {formatNumber(stats.nextLevelXp)} XP
                </p>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              #{stats.rank}. Sıra
            </Badge>
          </div>
          <Progress 
            value={(stats.xp / stats.nextLevelXp) * 100} 
            className="h-2 bg-purple-100 dark:bg-purple-900/30"
          />
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Seviye {stats.level}</span>
            <span>Seviye {stats.level + 1}</span>
          </div>
        </div>
      </SpotlightCard>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SpotlightCard>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                İçerik İstatistikleri
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatNumber(stats.totalPosts)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Gönderi
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatNumber(stats.totalViews)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Görüntülenme
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatNumber(stats.totalLikes)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Beğeni
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatNumber(stats.totalComments)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Yorum
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Takip İstatistikleri
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatNumber(stats.followers)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Takipçi
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatNumber(stats.following)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Takip Edilen
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Badges */}
      {(Array.isArray(stats.badges) ? stats.badges.length : 0) > 0 && (
        <SpotlightCard>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Rozetler
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(stats.badges || []).map((badge, index) => (
                <Badge
                  key={index}
                  className="bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-yellow-300"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </SpotlightCard>
      )}
    </div>
  );
} 