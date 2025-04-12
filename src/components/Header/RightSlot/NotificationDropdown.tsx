'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, BookOpen, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNotifications } from './hooks';
import { Notification } from './types';

// 로딩 컴포넌트
function NotificationLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-gray-500"></div>
    </div>
  );
}

// 스크롤 로더 컴포넌트
function ScrollLoader() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-gray-500"></div>
    </div>
  );
}

// 알림 내용 컴포넌트
function NotificationContent({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    markAsRead,
    markAllAsReadMutation,
    formatNotificationTime,
    getNotificationLink,
    error,
    queryError,
  } = useNotifications();

  // 오류가 있는 경우 오류 메시지 표시
  if (error || queryError) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <Bell className="h-8 w-8 text-red-300" />
        <p className="mt-2 text-sm text-red-500">
          알림을 불러오는 중 오류가 발생했습니다
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 text-xs text-blue-600 hover:text-blue-800"
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
    user: notification.actorId
      ? {
          name: `사용자 ${notification.actorId}`,
          avatar: `https://i.pravatar.cc/150?u=${notification.actorId}`,
        }
      : undefined,
  }));

  // 알림 클릭 핸들러
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    // 드롭다운 메뉴 닫기
    onClose();

    // 약간의 지연 후 페이지 이동 (메뉴 닫힘 애니메이션을 위해)
    setTimeout(() => {
      // 링크가 있으면 해당 링크로 이동
      if (notification.linkUrl) {
        router.push(notification.linkUrl);
      } else if (notification.sourceType && notification.sourceId) {
        const link = getNotificationLink(notification);
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
    <>
      <div className="flex items-center justify-between border-b border-gray-100 p-3">
        <h3 className="text-sm font-medium">알림</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-blue-600 hover:text-blue-800"
            onClick={() => markAllAsReadMutation()}
          >
            모두 읽음 표시
          </Button>
        )}
      </div>

      {enhancedNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6">
          <Bell className="h-8 w-8 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">알림이 없습니다</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={enhancedNotifications.length}
          next={loadMoreNotifications}
          hasMore={!!hasNextPage}
          loader={<ScrollLoader />}
          scrollableTarget="notification-scroll-container"
          className="py-1"
        >
          {enhancedNotifications.map(notification => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex cursor-pointer items-start gap-3 p-3 ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
              onSelect={e => e.preventDefault()} // 자동 닫힘 방지
            >
              {renderNotificationIcon(notification)}
              <div className="flex-1 space-y-1">
                <p className="text-[13px] leading-tight font-medium">
                  {notification.content}
                </p>
                <p className="text-[11px] text-gray-500">
                  {notification.timestamp}
                </p>
              </div>
              {!notification.isRead && (
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              )}
            </DropdownMenuItem>
          ))}
        </InfiniteScroll>
      )}
    </>
  );
}

// 알림 아이콘 렌더링 함수
function renderNotificationIcon(notification: Notification) {
  switch (notification.type) {
    case 'library_update':
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
          <BookOpen className="h-5 w-5 text-blue-500" />
        </div>
      );
    case 'follow':
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
          <User className="h-5 w-5 text-green-500" />
        </div>
      );
    case 'system':
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
          <Bell className="h-5 w-5 text-gray-500" />
        </div>
      );
    default:
      // 사용자 아바타 표시 (comment, like 등)
      if (notification.user) {
        return (
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage
              src={notification.user.avatar}
              alt={notification.user.name}
            />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              {notification.user.name[0]}
            </AvatarFallback>
          </Avatar>
        );
      } else {
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <Bell className="h-5 w-5 text-gray-500" />
          </div>
        );
      }
  }
}

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 hover:text-gray-900"
        >
          <Suspense fallback={<Bell className="h-5 w-5" />}>
            <NotificationBadge />
          </Suspense>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[70vh] w-80 overflow-y-auto"
        id="notification-scroll-container"
      >
        <Suspense fallback={<NotificationLoading />}>
          <NotificationContent onClose={() => setOpen(false)} />
        </Suspense>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Notification badge component to show unread count
function NotificationBadge() {
  const { unreadCount } = useNotifications();

  return (
    <>
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </>
  );
}
