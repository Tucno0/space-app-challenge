'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, Bell, Map, Database, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';

interface NavigationProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Navigation({ mobile = false, onNavigate }: NavigationProps) {
  const pathname = usePathname();
  const { locale, dictionary: dict } = useLanguage();

  const navItems = [
    { href: '', label: dict.navigation.dashboard, icon: Home },
    { href: '/forecast', label: dict.navigation.forecast, icon: TrendingUp },
    { href: '/alerts', label: dict.navigation.alerts, icon: Bell },
    { href: '/map', label: dict.navigation.map, icon: Map },
    { href: '/sources', label: dict.navigation.dataSources, icon: Database },
    { href: '/settings', label: dict.navigation.settings, icon: Settings },
  ];

  if (mobile) {
    return (
      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const fullPath = `/${locale}${item.href}`;
          const isActive = pathname === fullPath;
          return (
            <Link
              key={item.href}
              href={fullPath}
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
        const fullPath = `/${locale}${item.href}`;
        const isActive = pathname === fullPath;
        return (
          <Link
            key={item.href}
            href={fullPath}
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
