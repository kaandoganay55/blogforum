'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Edit3, 
  MessageSquare, 
  TrendingUp,
  Users,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { ModernTooltip } from './ModernTooltip';

interface FloatingActionButtonProps {
  icon?: ReactNode;
  onClick?: () => void;
  tooltip?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  mode?: 'simple' | 'menu';
}

export default function FloatingActionButton({
  icon,
  onClick,
  tooltip,
  position = 'bottom-right',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  mode = 'menu'
}: FloatingActionButtonProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsVisible(currentScrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const variantClasses = {
    default: 'bg-gray-600 hover:bg-gray-700 text-white',
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
  };

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (mode === 'simple') {
    const button = (
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`
          fixed z-50
          ${positionClasses[position]}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          rounded-full
          shadow-lg hover:shadow-xl
          transform hover:scale-110
          transition-all duration-300
          ${className}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className={iconSizeClasses[size]}>
          {icon}
        </div>
      </Button>
    );

    if (tooltip) {
      return (
        <ModernTooltip content={tooltip} position="left">
          {button}
        </ModernTooltip>
      );
    }

    return button;
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Quick Actions Menu */}
        {isOpen && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-300">
            <Button
              asChild
              size="sm"
              className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
            >
              <Link href="/post/create">
                <Edit3 className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
              </Link>
            </Button>
            
            <Button
              asChild
              size="sm"
              className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
            >
              <Link href="/posts">
                <MessageSquare className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
              </Link>
            </Button>
            
            <Button
              asChild
              size="sm"
              className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
            >
              <Link href="/profile">
                <Users className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        )}

        {/* Scroll to Top Button */}
        {isVisible && (
          <Button
            onClick={scrollToTop}
            size="sm"
            className="h-12 w-12 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group animate-in slide-in-from-bottom-2"
          >
            <ChevronUp className="h-5 w-5 text-white group-hover:scale-125 transition-transform duration-300" />
          </Button>
        )}

        {/* Main FAB */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className={`h-16 w-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-xl hover:shadow-2xl transition-all duration-300 group ${
            isOpen ? 'rotate-45 scale-110' : 'hover:scale-110'
          }`}
        >
          <Plus className={`h-8 w-8 text-white transition-transform duration-300 ${
            isOpen ? 'rotate-45' : 'group-hover:rotate-90'
          }`} />
        </Button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-40 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
} 