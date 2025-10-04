import {
  format,
  formatDistance,
  formatRelative,
  isToday,
  isTomorrow,
  isYesterday,
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export function formatDateTime(date: Date, timeZone?: string): string {
  if (timeZone) {
    return formatInTimeZone(date, timeZone, 'MMM d, yyyy h:mm a zzz');
  }
  return format(date, 'MMM d, yyyy h:mm a');
}

export function formatTime(date: Date, timeZone?: string): string {
  if (timeZone) {
    return formatInTimeZone(date, timeZone, 'h:mm a');
  }
  return format(date, 'h:mm a');
}

export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

export function formatShortDate(date: Date): string {
  return format(date, 'MMM d');
}

export function formatDayOfWeek(date: Date): string {
  return format(date, 'EEEE');
}

export function formatRelativeTime(date: Date): string {
  return formatDistance(date, new Date(), { addSuffix: true });
}

export function formatSmartDate(date: Date): string {
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  }
  if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, 'h:mm a')}`;
  }
  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }
  return formatRelative(date, new Date());
}

export function formatHourOnly(date: Date): string {
  return format(date, 'ha');
}

export function formatLastUpdated(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return format(date, 'MMM d, h:mm a');
}
