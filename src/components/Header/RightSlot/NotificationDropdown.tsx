'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { mockNotifications } from './mockData';
import { Notification } from './types';

export function NotificationDropdown() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

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

  // 알림 클릭 핸들러
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    // 알림 유형에 따라 다른 페이지로 이동
    if (notification.type === 'library' && notification.libraryId) {
      // 서재 상세 페이지로 이동
      window.location.href = `/libraries/${notification.libraryId}`;
    }
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
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 hover:text-gray-900"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
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
                onClick={() => handleNotificationClick(notification)}
              >
                {notification.type === 'library' ? (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                  </div>
                ) : notification.user ? (
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
        <DropdownMenuItem
          asChild
          className="cursor-pointer py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Link href="/profile?section=subscriptions">모든 알림 확인하기</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
