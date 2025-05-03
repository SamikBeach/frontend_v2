import { Comment as ApiComment } from '@/apis/review/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, SendHorizontal } from 'lucide-react';
import { Comment } from '../types';
import { getNameInitial } from '../utils';
import { CommentItem } from './CommentItem';

interface CommentSectionProps {
  comments: Comment[];
  formatDate: (date: string | Date) => string;
  currentUser: {
    id: number;
    username: string;
    avatar?: string;
  };
  commentText: string;
  setCommentText: (text: string) => void;
  isCommentLoading: boolean;
  handleSubmitComment: () => Promise<void>;
  handleDeleteComment: (commentId: number) => Promise<void>;
  handleCommentLikeToggle: (
    commentId: number,
    isLiked: boolean
  ) => Promise<void>;
  highlightedCommentId?: number | null;
}

export function CommentSection({
  comments,
  formatDate,
  currentUser,
  commentText,
  setCommentText,
  isCommentLoading,
  handleSubmitComment,
  handleDeleteComment,
  handleCommentLikeToggle,
  highlightedCommentId,
}: CommentSectionProps) {
  return (
    <div className="w-full space-y-3">
      {/* 댓글 입력 */}
      <div className="flex w-full gap-2">
        <Avatar className="mt-1 h-7 w-7 flex-shrink-0">
          {currentUser.avatar && (
            <AvatarImage
              src={currentUser.avatar}
              alt={currentUser.username}
              className="object-cover"
            />
          )}
          <AvatarFallback className="bg-gray-200 text-gray-700">
            {getNameInitial(currentUser.username)}
          </AvatarFallback>
        </Avatar>
        <div className="w-full flex-1">
          <div className="flex w-full gap-2">
            <div className="flex-1">
              <Input
                placeholder="댓글을 입력하세요..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="h-9 w-full flex-1 rounded-xl border-gray-200 bg-gray-50 text-sm shadow-none"
                disabled={isCommentLoading}
                onKeyDown={e => {
                  // Cmd+Enter(Mac) 또는 Ctrl+Enter(Windows)로 댓글 제출
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault();
                    if (commentText.trim() && !isCommentLoading) {
                      handleSubmitComment();
                    }
                  }
                }}
              />
            </div>
            <Button
              size="icon"
              className="h-9 w-9 rounded-xl bg-gray-900 text-white hover:bg-gray-800"
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || isCommentLoading}
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 댓글 로딩 상태 */}
      {isCommentLoading ? (
        <div className="my-6 flex flex-col items-center justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700"></div>
          <p className="mt-3 text-xs text-gray-500">댓글을 불러오는 중...</p>
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="w-full space-y-3 pl-9">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={
                comment as unknown as ApiComment & { replies?: ApiComment[] }
              }
              formatDate={formatDate}
              currentUser={{
                id: currentUser.id,
                username: currentUser.username,
                avatar: currentUser.avatar,
              }}
              onDelete={handleDeleteComment}
              onLike={handleCommentLikeToggle}
              isHighlighted={highlightedCommentId === comment.id}
            />
          ))}
        </div>
      ) : (
        <div className="my-2 flex flex-col items-center justify-center rounded-xl bg-gray-50 px-4 py-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <MessageCircle className="h-6 w-6 text-gray-400" />
          </div>
          <h4 className="text-sm font-medium text-gray-800">
            아직 댓글이 없습니다
          </h4>
          <p className="mt-1 text-xs text-gray-500">
            이 글에 첫 번째 댓글을 작성해보세요
          </p>
          <Button
            variant="outline"
            className="mt-4 h-8 rounded-full border-gray-300 bg-white px-4 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => {
              // 댓글 입력창에 포커스
              const commentInput = document.querySelector(
                `input[placeholder="댓글을 입력하세요..."]`
              ) as HTMLInputElement;
              if (commentInput) commentInput.focus();
            }}
          >
            <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
            댓글 작성하기
          </Button>
        </div>
      )}
    </div>
  );
}
