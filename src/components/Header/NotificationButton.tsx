'use client';

import { Bell } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

// 알림 타입 정의
interface Notification {
  id: number;
  type: 'comment' | 'like' | 'follow' | 'mention' | 'system';
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  user?: {
    name: string;
    avatar: string;
  };
}

export function NotificationButton() {
  // 알림 목록 (실제로는 API에서 가져옴)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'comment',
      title: '새 댓글',
      content: '김철수님이 당신의 리뷰에 댓글을 남겼습니다.',
      timestamp: '10분 전',
      isRead: false,
      user: {
        name: '김철수',
        avatar: 'https://i.pravatar.cc/150?u=user1',
      },
    },
    {
      id: 2,
      type: 'like',
      title: '새 좋아요',
      content: '이영희님이 당신의 독서 목록을 좋아합니다.',
      timestamp: '30분 전',
      isRead: false,
      user: {
        name: '이영희',
        avatar: 'https://i.pravatar.cc/150?u=user2',
      },
    },
    {
      id: 3,
      type: 'follow',
      title: '새 팔로워',
      content: '박지민님이 당신을 팔로우합니다.',
      timestamp: '1시간 전',
      isRead: true,
      user: {
        name: '박지민',
        avatar: 'https://i.pravatar.cc/150?u=user3',
      },
    },
    {
      id: 4,
      type: 'mention',
      title: '새 멘션',
      content: '최경제님이 게시글에서 당신을 언급했습니다.',
      timestamp: '3시간 전',
      isRead: true,
      user: {
        name: '최경제',
        avatar: 'https://i.pravatar.cc/150?u=user4',
      },
    },
    {
      id: 5,
      type: 'system',
      title: '시스템 알림',
      content: '보안 설정이 업데이트되었습니다. 확인해보세요.',
      timestamp: '1일 전',
      isRead: true,
    },
  ]);

  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter(
    notification => !notification.isRead
  ).length;

  // 알림 읽음 처리 함수
  const markAsRead = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // 모든 알림 읽음 처리 함수
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[70vh] w-80 overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-3">
          <h3 className="text-sm font-medium">알림</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-blue-600 hover:text-blue-800"
              onClick={markAllAsRead}
            >
              모두 읽음 표시
            </Button>
          )}
        </div>
        <div className="py-1">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6">
              <Bell className="h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">알림이 없습니다</p>
            </div>
          ) : (
            notifications.map(notification => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex cursor-pointer items-start gap-3 p-3 ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                {notification.user ? (
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage
                      src={notification.user.avatar}
                      alt={notification.user.name}
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {notification.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <Bell className="h-5 w-5 text-gray-500" />
                  </div>
                )}
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
            ))
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-800">
          모든 알림 확인하기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
