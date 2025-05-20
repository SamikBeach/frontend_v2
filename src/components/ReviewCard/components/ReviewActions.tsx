import { MessageCircle, ThumbsUp } from 'lucide-react';

interface ReviewActionsProps {
  isLiked: boolean;
  likesCount: number;
  commentCount: number;
  showComments: boolean;
  isLikeLoading: boolean;
  onLike: () => Promise<void>;
  onToggleComments: () => void;
}

export function ReviewActions({
  isLiked,
  likesCount,
  commentCount,
  showComments,
  isLikeLoading,
  onLike,
  onToggleComments,
}: ReviewActionsProps) {
  return (
    <div className="flex w-full items-center gap-3">
      <button
        onClick={onLike}
        disabled={isLikeLoading}
        className={`flex h-8 cursor-pointer items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors ${
          isLiked
            ? 'bg-green-50 text-green-600'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <ThumbsUp
          className={`mr-0.5 h-4 w-4 ${isLiked ? 'fill-green-600' : ''}`}
        />
        <span>{likesCount}</span>
      </button>
      <button
        onClick={onToggleComments}
        className={`flex h-8 cursor-pointer items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors ${
          showComments
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <MessageCircle className="mr-0.5 h-4 w-4" />
        <span>{commentCount || 0}</span>
      </button>
    </div>
  );
}
