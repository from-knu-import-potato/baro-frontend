export type NotificationCategory = 'stock' | 'expiry' | 'price' | 'system';

export interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
