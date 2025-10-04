import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function MetricDisplay({
  label,
  value,
  unit,
  icon: Icon,
  iconColor = 'text-muted-foreground',
  className,
}: MetricDisplayProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {Icon && (
        <div className={cn('flex-shrink-0', iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground truncate">{label}</div>
        <div className="text-sm font-semibold">
          {value}
          {unit && (
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              {unit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
