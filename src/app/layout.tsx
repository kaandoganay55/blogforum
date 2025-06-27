import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BlogForum - Modern Blog & Forum Platform',
  description: 'Modern ve interaktif blog & forum platformu',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          'min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'
        )}
      >
        <Providers>
          {/* Background Pattern */}
          <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 -z-10 h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>
            <div className="absolute bottom-0 right-0 -z-10 h-[310px] w-[310px] rounded-full bg-orange-500 opacity-20 blur-[100px]"></div>
          </div>

          {/* Main Content */}
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl">
              <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      BlogForum
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Modern ve interaktif blog & forum platformu
                  </p>
                  <div className="flex items-center space-x-4">
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      Hakkımızda
                    </a>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      İletişim
                    </a>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      Gizlilik
                    </a>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      Kurallar
                    </a>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} BlogForum. Tüm hakları saklıdır.
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
