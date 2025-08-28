
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Alegreya, Belleza } from 'next/font/google';
import { cn } from '@/lib/utils';
import { AuthContextProvider } from '@/context/auth-context';
import BottomNav from '@/components/bottom-nav';
import Header from '@/components/header';

export const metadata: Metadata = {
  title: 'EcoEcho',
  description: 'A Community Sustainability Platform',
};

const alegreya = Alegreya({
  subsets: ['latin'],
  variable: '--font-alegreya',
  display: 'swap',
});

const belleza = Belleza({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-belleza',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          'font-body antialiased bg-muted/40',
          alegreya.variable,
          belleza.variable
        )}
      >
        <AuthContextProvider>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1 pb-20">
              <div className="mx-auto max-w-md bg-background shadow-2xl flex flex-col flex-1 min-h-screen">
                <Header />
                <div className="flex-1">
                  {children}
                </div>
              </div>
            </main>
            <BottomNav />
            <Toaster />
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}
