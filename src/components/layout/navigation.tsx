'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Bell, Map, Database, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/forecast', label: 'Forecast', icon: TrendingUp },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/sources', label: 'Data Sources', icon: Database },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navigation({ mobile = false, onNavigate }: NavigationProps) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden lg:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
