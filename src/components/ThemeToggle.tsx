'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Laptop } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="opacity-0">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          {/* Light Mode Icon */}
          <Sun className={`
            h-5 w-5 absolute 
            transition-all duration-500 
            ${theme === 'light' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}
          `} />
          
          {/* Dark Mode Icon */}
          <Moon className={`
            h-5 w-5 absolute 
            transition-all duration-500 
            ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'}
          `} />
          
          {/* System Mode Icon */}
          <Laptop className={`
            h-5 w-5 absolute 
            transition-all duration-500 
            ${theme === 'system' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'}
          `} />
          
          {/* Hover Effect */}
          <span className="absolute inset-0 rounded-md bg-blue-500/10 dark:bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <Sun className="h-4 w-4 group-hover:text-amber-500 transition-colors duration-200" />
          <span className="group-hover:text-amber-500 transition-colors duration-200">Aydınlık</span>
          {theme === 'light' && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <Moon className="h-4 w-4 group-hover:text-blue-500 transition-colors duration-200" />
          <span className="group-hover:text-blue-500 transition-colors duration-200">Karanlık</span>
          {theme === 'dark' && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <Laptop className="h-4 w-4 group-hover:text-purple-500 transition-colors duration-200" />
          <span className="group-hover:text-purple-500 transition-colors duration-200">Sistem</span>
          {theme === 'system' && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-500" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 