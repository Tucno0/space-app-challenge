'use client';

import { AQICategory } from '@/types/air-quality';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

interface AQIBadgeProps {
  value: number;
  category: AQICategory;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
  lg: 'text-sm px-3 py-1.5',
};

const categoryColorClasses: Record<AQICategory, string> = {
  good: 'bg-aqi-good text-aqi-good-foreground border-aqi-good',
  moderate: 'bg-aqi-moderate text-aqi-moderate-foreground border-aqi-moderate',
  'unhealthy-sensitive':
    'bg-aqi-unhealthy-sensitive text-aqi-unhealthy-sensitive-foreground border-aqi-unhealthy-sensitive',
  unhealthy:
    'bg-aqi-unhealthy text-aqi-unhealthy-foreground border-aqi-unhealthy',
  'very-unhealthy':
    'bg-aqi-very-unhealthy text-aqi-very-unhealthy-foreground border-aqi-very-unhealthy',
  hazardous:
    'bg-aqi-hazardous text-aqi-hazardous-foreground border-aqi-hazardous',
};

const categoryLabels: Record<
  AQICategory,
  keyof typeof import('@/../locales/en.json')['aqi']['categories']
> = {
  good: 'good',
  moderate: 'moderate',
  'unhealthy-sensitive': 'unhealthySensitive',
  unhealthy: 'unhealthy',
  'very-unhealthy': 'veryUnhealthy',
  hazardous: 'hazardous',
};

export function AQIBadge({
  value,
  category,
  size = 'md',
  showValue = true,
  className,
}: AQIBadgeProps) {
  const { dictionary: dict } = useTranslation();
  const label = dict.aqi.categories[categoryLabels[category]];

  return (
    <Badge
      variant="outline"
      className={cn(
        sizeClasses[size],
        categoryColorClasses[category],
        'font-semibold',
        className
      )}
    >
      {showValue ? `${value} - ${label}` : label}
    </Badge>
  );
}
