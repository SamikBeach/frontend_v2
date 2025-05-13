import { Button } from '@/components/ui/button';
import { ResponsiveDropdownMenuItem } from '@/components/ui/responsive-dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNotifications } from '../hooks';
import { Notification, NotificationContentProps } from '../types';
import { renderNotificationContent, renderNotificationIcon } from '../utils';
import { ScrollLoader } from './LoadingStates';
import { NotificationTypeBadge } from './NotificationTypeBadge';
import { PostTypeBadge } from './PostTypeBadge';

export function NotificationContent({
  onClose,
  isOpen,
}: NotificationContentProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    markAsRead,
    markAllAsReadMutation,
    deleteAllNotifications,
    formatNotificationTime,
    getNotificationLink,
    error,
    queryError,
  } = useNotifications(10, isOpen); // 드롭다운 상태 전달

  // 오류가 있는 경우 오류 메시지 표시
  if (error || queryError) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="rounded-full bg-red-50 p-4">
          <Bell className="h-8 w-8 text-red-400" />
        </div>
        <p className="mt-3 text-sm text-red-500">
          알림을 불러오는 중 오류가 발생했습니다
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 rounded-full border-red-200 px-3 text-xs text-red-600 hover:bg-red-50"
          onClick={() => window.location.reload()}
        >
          새로고침
        </Button>
      </div>
    );
  }

  // UI에 필요한 추가 정보 설정
  const enhancedNotifications = notifications.map(notification => ({
    ...notification,
    timestamp: formatNotificationTime(notification.createdAt),
    user: notification.actor
      ? {
          name: notification.actor.username,
          avatar: notification.actor.profileImage,
        }
      : undefined,
  }));

  // 알림 클릭 핸들러
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    onClose();
    setTimeout(() => {
      if (notification.linkUrl) {
        router.push(notification.linkUrl);
      } else if (notification.sourceType && notification.sourceId) {
        const link = getNotificationLink(notification as any);
        router.push(link);
      }
    }, 100);
  };

  // 다음 페이지 로드 핸들러
  const loadMoreNotifications = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-3">
        <h3 className="font-medium text-gray-900">알림</h3>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-full px-2 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => markAllAsReadMutation()}
            >
              모두 읽음
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-full px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                if (
                  confirm(
                    '모든 알림을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
                  )
                ) {
                  deleteAllNotifications();
                }
              }}
            >
              전체 삭제
            </Button>
          )}
        </div>
      </div>

      <div
        className="flex-1 overflow-auto"
        id={
          isMobile
            ? 'mobile-notification-container'
            : 'notification-scroll-container'
        }
        ref={scrollContainerRef}
        style={{ height: 'calc(100% - 48px)' }}
      >
        {enhancedNotifications.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-10">
            <div className="rounded-full bg-gray-50 p-4">
              <Bell className="h-8 w-8 text-gray-300" />
            </div>
            <p className="mt-3 text-sm text-gray-500">알림이 없습니다</p>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={enhancedNotifications.length}
            next={loadMoreNotifications}
            hasMore={!!hasNextPage}
            loader={<ScrollLoader />}
            scrollableTarget={
              isMobile
                ? 'mobile-notification-container'
                : 'notification-scroll-container'
            }
            scrollThreshold={0.7}
            className="divide-y divide-gray-50"
            endMessage={
              <p className="py-10 text-center text-xs text-gray-400">
                모든 알림을 불러왔습니다
              </p>
            }
          >
            {enhancedNotifications.map(notification => (
              <ResponsiveDropdownMenuItem
                key={notification.id}
                className={`flex cursor-pointer flex-col gap-0 px-4 py-3.5 transition-colors ${
                  !notification.isRead ? 'bg-blue-50/40' : 'hover:bg-gray-50'
                }`}
                drawerClassName={`flex cursor-pointer flex-col gap-0 px-4 py-3.5 transition-colors ${
                  !notification.isRead ? 'bg-blue-50/40' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleNotificationClick(notification)}
                onSelect={e => e.preventDefault()} // 자동 닫힘 방지
              >
                <div className="flex w-full items-start gap-3">
                  {/* 아바타 또는 아이콘 */}
                  {renderNotificationIcon(notification)}

                  <div className="min-w-0 flex-1">
                    {/* 태그와 메시지 */}
                    <div className="mb-1.5 flex items-center gap-2">
                      <NotificationTypeBadge type={notification.type} />

                      {notification.sourceType && (
                        <PostTypeBadge sourceType={notification.sourceType} />
                      )}

                      {/* 읽지 않음 표시 */}
                      {!notification.isRead && (
                        <div className="ml-auto h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>

                    {/* 알림 메시지 */}
                    <div className="text-sm leading-normal break-words whitespace-normal text-gray-700">
                      {renderNotificationContent(notification)}
                    </div>

                    {/* 타임스탬프 */}
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">
                        {notification.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              </ResponsiveDropdownMenuItem>
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
