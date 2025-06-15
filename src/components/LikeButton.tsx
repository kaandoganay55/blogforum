'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface LikeButtonProps {
  postId: string;
  initialLikesCount?: number;
  initialIsLiked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function LikeButton({ 
  postId, 
  initialLikesCount = 0, 
  initialIsLiked = false,
  size = 'md',
  showCount = true 
}: LikeButtonProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch initial like status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/like`);
        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.isLiked);
          setLikesCount(data.likesCount);
        }
      } catch (error) {
        console.error('Beğeni durumu getirilemedi:', error);
      }
    };

    if (postId) {
      fetchLikeStatus();
    }
  }, [postId]);

  const handleLike = async () => {
    if (!session) {
      alert('Beğenmek için giriş yapmalısınız!');
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      setIsAnimating(true);

      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
        
        // Animation timeout
        setTimeout(() => setIsAnimating(false), 600);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Beğeni işlemi başarısız');
      }
    } catch (error) {
      console.error('Beğeni hatası:', error);
      alert('Beğeni işlemi sırasında hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'w-8 h-8 text-sm',
      icon: 'text-sm',
      text: 'text-xs'
    },
    md: {
      button: 'w-10 h-10 text-base',
      icon: 'text-base',
      text: 'text-sm'
    },
    lg: {
      button: 'w-12 h-12 text-lg',
      icon: 'text-lg',
      text: 'text-base'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`
          ${config.button}
          relative overflow-hidden rounded-full
          flex items-center justify-center
          transition-all duration-300 ease-out
          ${isLiked 
            ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/25' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-pink-500'
          }
          ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-110'}
          ${isAnimating ? 'animate-bounce' : ''}
          group
        `}
      >
        {/* Heart Icon */}
        <div className={`
          ${config.icon}
          transition-all duration-300
          ${isAnimating ? 'scale-125' : 'scale-100'}
        `}>
          {isLiked ? '❤️' : '🤍'}
        </div>

        {/* Ripple Effect */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-full bg-pink-400 opacity-30 animate-ping"></div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </button>

      {/* Like Count */}
      {showCount && (
        <span className={`
          ${config.text}
          font-medium transition-all duration-300
          ${isLiked ? 'text-pink-600' : 'text-gray-600'}
        `}>
          {likesCount > 0 && (
            <span className="flex items-center gap-1">
              <span className={`transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
                {likesCount}
              </span>
              <span className="hidden sm:inline">
                {likesCount === 1 ? 'beğeni' : 'beğeni'}
              </span>
            </span>
          )}
        </span>
      )}
    </div>
  );
} 