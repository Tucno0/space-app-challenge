import { AQICategory } from '@/types/air-quality';
import {
  getAQICategoryColor,
  getAQICategoryTextColor,
} from '@/lib/color-scales';
import { cn } from '@/lib/utils';

interface AQIBadgeProps {
  value: number;
  category: AQICategory;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function AQIBadge({
  value,
  category,
  size = 'md',
  showValue = true,
  className,
}: AQIBadgeProps) {
  const backgroundColor = getAQICategoryColor(category);
  const textColor = getAQICategoryTextColor(category);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor, color: textColor }}
    >
      {showValue ? value : category.toUpperCase()}
    </span>
  );
}
