"use client";

import { useRef, useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(120, 119, 198, 0.1)'
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!divRef.current) return;

      const div = divRef.current;
      const rect = div.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (
        x >= 0 &&
        x <= rect.width &&
        y >= 0 &&
        y <= rect.height
      ) {
        setPosition({ x, y });
        setOpacity(0.15);
      } else {
        setOpacity(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMounted]);

  return (
    <div
      ref={divRef}
      className={cn(
        'relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all duration-300',
        className
      )}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`
        }}
      />

      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
} 