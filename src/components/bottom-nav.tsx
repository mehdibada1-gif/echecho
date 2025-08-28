
'use client';

import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { Home, CalendarDays, Trophy, BarChart3, User, LogIn, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const allLinks = user 
    ? [
        { href: '/events', label: 'Events', icon: CalendarDays },
        { href: '/chat', label: 'Chat', icon: MessageSquare },
        { href: '/', label: 'Home', icon: Home },
        { href: '/leaderboard', label: 'Leaders', icon: Trophy },
        { href: '/dashboard', label: 'Me', icon: User },
      ]
    : [
        { href: '/events', label: 'Events', icon: CalendarDays },
        { href: '/leaderboard', label: 'Leaders', icon: Trophy },
        { href: '/', label: 'Home', icon: Home },
        { href: '/impact', label: 'Impact', icon: BarChart3 },
        { href: '/login', label: 'Log In', icon: LogIn },
      ];


  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-t-lg">
      <div className="mx-auto max-w-md">
        <nav className="grid h-16 grid-cols-5 items-center">
          {allLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex flex-col items-center justify-center gap-1 text-xs">
                <Icon
                  className={cn(
                    'h-6 w-6 transition-colors',
                    pathname === href || (href.startsWith('/chat') && pathname.startsWith('/chat')) ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <span
                   className={cn(
                    'transition-colors',
                    pathname === href || (href.startsWith('/chat') && pathname.startsWith('/chat')) ? 'text-primary font-semibold' : 'text-muted-foreground'
                  )}
                >
                  {label}
                </span>
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
