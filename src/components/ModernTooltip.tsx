'use client';

import { ReactNode, useState } from 'react';

interface ModernTooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function ModernTooltip({
  content,
  children,
  position = 'top',
  delay = 0,
  className = ''
}: ModernTooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 translate-y-2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 -translate-x-2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 translate-x-2 ml-2'
  };

  const arrowClasses = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-gray-700 dark:border-t-gray-200 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-b-gray-700 dark:border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-[-6px] top-1/2 -translate-y-1/2 border-l-gray-700 dark:border-l-gray-200 border-t-transparent border-b-transparent border-r-transparent',
    right: 'left-[-6px] top-1/2 -translate-y-1/2 border-r-gray-700 dark:border-r-gray-200 border-t-transparent border-b-transparent border-l-transparent'
  };

  return (
    <div className={`group relative inline-block ${className}`}>
      {children}
      <div
        className={`
          invisible opacity-0 group-hover:visible group-hover:opacity-100
          absolute z-50 px-3 py-2 text-sm
          bg-gray-700 dark:bg-gray-200
          text-white dark:text-gray-900
          rounded-lg shadow-lg
          transition-all duration-200
          whitespace-nowrap
          ${positionClasses[position]}
          ${delay ? `delay-${delay}` : ''}
        `}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {content}
        <span
          className={`
            absolute w-0 h-0
            border-4
            ${arrowClasses[position]}
          `}
        />
      </div>
    </div>
  );
}

// Özel tooltip hook'u
export function useTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState<string | ReactNode>('');
  const [position, setPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');

  const showTooltip = (
    newContent: string | ReactNode,
    newPosition: 'top' | 'bottom' | 'left' | 'right' = 'top'
  ) => {
    setContent(newContent);
    setPosition(newPosition);
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    content,
    position,
    showTooltip,
    hideTooltip
  };
} 