import { BookOpen, Hash, MessageSquare, User } from 'lucide-react';
import { PostTypeBadgeProps } from '../types';

export function PostTypeBadge({ sourceType }: PostTypeBadgeProps) {
  if (!sourceType) return null;

  const getIcon = () => {
    switch (sourceType) {
      case 'review':
        return <BookOpen className="h-3 w-3" />;
      case 'comment':
        return <MessageSquare className="h-3 w-3" />;
      case 'library':
        return <Hash className="h-3 w-3" />;
      case 'user':
        return <User className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (sourceType) {
      case 'review':
        return '리뷰';
      case 'comment':
        return '댓글';
      case 'library':
        return '서재';
      case 'user':
        return '프로필';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (sourceType) {
      case 'review':
        return 'bg-blue-50 text-blue-600';
      case 'comment':
        return 'bg-purple-50 text-purple-600';
      case 'library':
        return 'bg-green-50 text-green-600';
      case 'user':
        return 'bg-yellow-50 text-yellow-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] ${getColor()}`}
    >
      {getIcon()}
      <span>{getLabel()}</span>
    </span>
  );
}
