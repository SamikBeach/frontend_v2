import { Bell, BookOpen, MessageSquare, ThumbsUp, User } from 'lucide-react';
import { NotificationTypeBadgeProps } from '../types';

export function NotificationTypeBadge({ type }: NotificationTypeBadgeProps) {
  const getIcon = () => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="h-3.5 w-3.5 text-pink-500" />;
      case 'comment_like':
        return <ThumbsUp className="h-3.5 w-3.5 text-red-500" />;
      case 'comment':
        return <MessageSquare className="h-3.5 w-3.5 text-purple-500" />;
      case 'follow':
        return <User className="h-3.5 w-3.5 text-yellow-500" />;
      case 'library_update':
        return <BookOpen className="h-3.5 w-3.5 text-green-500" />;
      case 'library_subscribe':
        return <BookOpen className="h-3.5 w-3.5 text-blue-500" />;
      default:
        return <Bell className="h-3.5 w-3.5 text-gray-500" />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'like':
        return '좋아요';
      case 'comment_like':
        return '댓글 좋아요';
      case 'comment':
        return '댓글';
      case 'follow':
        return '팔로우';
      case 'library_update':
        return '서재 업데이트';
      case 'library_subscribe':
        return '서재 구독';
      case 'system':
        return '시스템';
      default:
        return '알림';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'like':
        return 'bg-pink-50 text-pink-600';
      case 'comment_like':
        return 'bg-red-50 text-red-600';
      case 'comment':
        return 'bg-purple-50 text-purple-600';
      case 'follow':
        return 'bg-yellow-50 text-yellow-600';
      case 'library_update':
        return 'bg-green-50 text-green-600';
      case 'library_subscribe':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${getBgColor()}`}
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </span>
  );
}
