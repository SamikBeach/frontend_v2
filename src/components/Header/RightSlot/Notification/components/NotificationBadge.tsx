import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks';
import { NotificationBadgeProps } from '../types';

export function NotificationBadge({ count }: NotificationBadgeProps) {
  // 항상 읽지 않은 알림 수는 확인해야 함 (드롭다운 상태와 무관하게)
  const { unreadCount } = useNotifications();
  const badgeCount = count !== undefined ? count : unreadCount;

  return (
    <>
      <Bell className="h-5 w-5" />
      {badgeCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
    </>
  );
}
