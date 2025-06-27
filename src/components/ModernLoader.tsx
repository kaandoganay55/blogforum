'use client';

import { useEffect, useState } from 'react';

interface ModernLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  className?: string;
}

export function ModernLoader() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
        
        {/* Spinning Ring */}
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        
        {/* Inner Pulse */}
        <div className="absolute inset-2 rounded-full bg-blue-500/20 animate-pulse"></div>
        
        {/* Center Dot */}
        <div className="absolute inset-[30%] rounded-full bg-blue-500 animate-ping"></div>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'gradient';
  animated?: boolean;
}

export function ProgressBar({ 
  progress, 
  className = '', 
  showPercentage = false, 
  color = 'blue',
  animated = true 
}: ProgressBarProps) {
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ease-out ${colorClasses[color]} ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        >
          {animated && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></div>
          )}
        </div>
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ isLoading, message = 'Yükleniyor...', className = '' }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center space-y-4">
          <ModernLoader />
          <p className="text-gray-700 dark:text-gray-300 text-center font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Shimmer keyframe for CSS
export const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`; 