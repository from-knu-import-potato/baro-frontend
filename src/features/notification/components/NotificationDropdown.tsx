import { Bell } from 'lucide-react';

import NotificationItem from './NotificationItem';
import { MOCK_NOTIFICATIONS } from '../data/notification.mock';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem } from '@/shadcn/ui/sidebar';

const NotificationDropdown = () => {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger render={<SidebarMenuButton tooltip="알림" className="relative" />}>
          <div className="relative">
            <Bell />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-baro-red" />
            )}
          </div>
          <span>알림</span>
          {unreadCount > 0 && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-baro-red text-[11px] font-semibold text-white group-data-[collapsible=icon]:hidden">
              {unreadCount}
            </span>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" align="end" sideOffset={18} className="w-80 p-0">
          <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-sm font-semibold">알림</span>
            <button className="text-xs text-baro-blue hover:underline">모두 읽음</button>
          </div>
          <DropdownMenuSeparator />
          <div className="flex max-h-100 flex-col gap-1 overflow-y-auto p-1.5">
            {MOCK_NOTIFICATIONS.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">새 알림이 없습니다.</p>
            ) : (
              MOCK_NOTIFICATIONS.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export default NotificationDropdown;
