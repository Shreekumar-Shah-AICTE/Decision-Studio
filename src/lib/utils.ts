import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(ts: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(ts));
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export const CARD_CATEGORY_COLORS: Record<string, string> = {
  root: '#6366F1',
  option: '#0EA5E9',
  outcome: '#10B981',
  factor: '#F59E0B',
};

export const CONNECTION_TYPE_COLORS: Record<string, string> = {
  'supports': '#10B981',
  'blocks': '#F43F5E',
  'depends': '#F59E0B',
  'leads-to': '#6366F1',
};

export const CONNECTION_TYPE_LABELS: Record<string, string> = {
  'supports': 'Supports',
  'blocks': 'Blocks',
  'depends': 'Depends on',
  'leads-to': 'Leads to',
};
