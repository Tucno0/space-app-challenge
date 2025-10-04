'use client';

import { Alert } from '@/types/alert';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  alert: Alert;
  onDismiss: () => void;
}

const severityStyles = {
  info: 'bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800',
  warning:
    'bg-yellow-100 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-800',
  danger:
    'bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-100 border-orange-200 dark:border-orange-800',
  critical:
    'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100 border-red-200 dark:border-red-800',
};

export function AlertBanner({ alert, onDismiss }: AlertBannerProps) {
  return (
    <div
      className={cn(
        'alert-slide-down fixed top-0 left-0 right-0 z-50 border-b p-4',
        severityStyles[alert.severity]
      )}
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-semibold">{alert.title}</p>
          <p className="text-sm opacity-90">{alert.message}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
