import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, BookOpen, MessageSquare, ThumbsUp, User } from 'lucide-react';
import { Notification } from '../types';

/**
 * 알림 아이콘 렌더링 함수
 * 알림 타입과 작성자에 따라 적절한 아이콘을 표시
 */
export function renderNotificationIcon(notification: Notification) {
  // 사용자가 있는 경우 항상 아바타 표시
  if (notification.actor) {
    return (
      <Avatar className="h-10 w-10 flex-shrink-0">
        {notification.actor.profileImage && (
          <AvatarImage
            src={notification.actor.profileImage}
            alt={notification.actor.username}
          />
        )}
        <AvatarFallback className="bg-gray-100 text-gray-600">
          {notification.actor.username.charAt(0)}
        </AvatarFallback>
      </Avatar>
    );
  } else if (notification.user) {
    // 이전 방식 호환성 유지
    return (
      <Avatar className="h-10 w-10 flex-shrink-0">
        {notification.user.avatar && (
          <AvatarImage
            src={notification.user.avatar}
            alt={notification.user.name}
          />
        )}
        <AvatarFallback className="bg-gray-100 text-gray-600">
          {notification.user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
    );
  }

  // 사용자 정보가 없는 경우 타입별 아이콘 표시
  switch (notification.type) {
    case 'library_update':
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
          <BookOpen className="h-5 w-5 text-green-600" />
        </div>
      );
    case 'library_subscribe':
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
          <BookOpen className="h-5 w-5 text-blue-600" />
        </div>
      );
    case 'follow':
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
          <User className="h-5 w-5 text-yellow-600" />
        </div>
      );
    case 'like':
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-100">
          <ThumbsUp className="h-5 w-5 text-pink-600" />
        </div>
      );
    case 'comment_like':
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
          <ThumbsUp className="h-5 w-5 text-red-600" />
        </div>
      );
    case 'comment':
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
          <MessageSquare className="h-5 w-5 text-purple-600" />
        </div>
      );
    case 'system':
    default:
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
          <Bell className="h-5 w-5 text-gray-500" />
        </div>
      );
  }
}
