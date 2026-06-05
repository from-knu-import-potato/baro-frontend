import type { BadgeColor } from '@/shared/types/ui.types';

export const colorMap: Record<BadgeColor, { bg: string; text: string }> = {
  blue: {
    bg: 'bg-baro-blue/10',
    text: 'text-baro-blue',
  },
  green: {
    bg: 'bg-baro-green/10',
    text: 'text-baro-green',
  },
};
