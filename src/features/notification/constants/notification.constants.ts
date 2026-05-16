import type { NotificationCategory } from '../types/notification.types';

export const CATEGORY_CONFIG: Record<NotificationCategory, { dotColor: string }> = {
  stock: { dotColor: 'bg-baro-red' },
  expiry: { dotColor: 'bg-amber-500' },
  price: { dotColor: 'bg-baro-blue' },
  system: { dotColor: 'bg-gray-400' },
};
