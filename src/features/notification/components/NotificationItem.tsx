import { CATEGORY_CONFIG } from '../constants/notification.constants';
import type { Notification } from '../types/notification.types';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { dotColor } = CATEGORY_CONFIG[notification.category];

  return (
    <div
      className={`flex w-full cursor-pointer gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent ${
        !notification.isRead ? 'bg-accent/50' : ''
      }`}
    >
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium">{notification.title}</span>
          <span className="shrink-0 text-xs text-muted-foreground">{notification.timestamp}</span>
        </div>
        <span className="text-xs leading-snug text-muted-foreground">{notification.message}</span>
      </div>
    </div>
  );
};

export default NotificationItem;
