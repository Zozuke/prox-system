import type { ColorTheme } from './types';

export const COLOR_MAP: Record<ColorTheme, { bg: string; border: string; text: string; solid: string }> = {
  slate:  { bg: 'bg-slate-50',  border: 'border-slate-200',  text: 'text-slate-700',  solid: 'bg-slate-600' },
  brand:  { bg: 'bg-brand-50',  border: 'border-brand-100',  text: 'text-brand-700',  solid: 'bg-brand-500' },
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    solid: 'bg-red-500' },
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  solid: 'bg-green-500' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', solid: 'bg-yellow-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', solid: 'bg-purple-500' },
};

export const COLOR_OPTIONS: ColorTheme[] = ['slate', 'brand', 'red', 'green', 'yellow', 'purple'];
