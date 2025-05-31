import { updateComment } from '@/apis/review/review';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { useLayoutEffect, useState } from 'react';
import { toast } from 'sonner';
import { useFocusManagement } from '../hooks/useFocusManagement';
import { CommentItemProps } from '../types';
import { CommentItemDropdown } from './CommentItemDropdown';

export function CommentItem({
  comment,
  formatDate,
  currentUser,
  onDelete,
  onLike,
  isHighlighted = false,
}: CommentItemProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [highlightBg, setHighlightBg] = useState(isHighlighted);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  // 포커스 관리 훅 사용 - ResponsiveDropdownMenu의 100ms 지연을 고려
  const { elementRef: textareaRef, ensureFocus } = useFocusManagement({
    delay: 250, // ResponsiveDropdownMenu 닫힘 지연(100ms)보다 충분히 긴 지연
    debugPrefix: 'CommentItem',
  });

  // 하이라이트 효과 관리 - 3초 후 사라짐
  useLayoutEffect(() => {
    if (isHighlighted) {
      setHighlightBg(true);
      const timer = setTimeout(() => {
        setHighlightBg(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  // 현재 사용자가 댓글 작성자인지 확인
  const isAuthor = currentUser.id === comment.author.id;

  // 댓글 수정 mutation
  const updateCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => {
      return updateComment(commentId, { content });
    },
    onSuccess: () => {
      // 백그라운드에서 댓글 목록 리로드
      queryClient.invalidateQueries({
        queryKey: ['review-comments'],
        exact: false,
      });
      toast.success('댓글이 수정되었습니다.');
    },
    onError: () => {
      // 에러 발생 시 원래 내용으로 복원
      setEditedContent(comment.content);
      setIsEditing(true); // 수정 모드 다시 활성화
      toast.error('댓글 수정 중 오류가 발생했습니다.');
    },
  });

  const handleEditComment = () => {
    console.log('handleEditComment 호출됨');
    setIsEditing(true);
    setIsDropdownOpen(false);
    ensureFocus();
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) return;

    // 낙관적 업데이트: 즉시 수정 모드 종료
    setIsEditing(false);

    // 백그라운드에서 API 호출
    updateCommentMutation.mutate({
      commentId: comment.id,
      content: editedContent,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = () => {
    if (onDelete) {
      setIsDeleting(true);
      try {
        onDelete(comment.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // 댓글 좋아요 토글 핸들러
  const handleLikeToggle = async () => {
    // 로그인 확인
    if (!currentUser?.id) {
      setAuthDialogOpen(true);
      return;
    }

    // 낙관적 UI 업데이트
    setIsLiked(!isLiked);
    setLikeCount((prev: number) => prev + (isLiked ? -1 : 1));

    try {
      // API 호출
      if (onLike) {
        await onLike(comment.id, isLiked);
      }
    } catch (error) {
      // 에러 발생 시 UI 되돌리기
      setIsLiked(isLiked);
      setLikeCount(comment.likeCount || 0);
      console.error('Failed to toggle comment like:', error);
    }
  };

  return (
    <>
      <div
        id={`comment-${comment.id}`}
        className="flex w-full gap-1.5 sm:gap-2"
      >
        <Avatar className="h-7 w-7 flex-shrink-0 sm:h-7 sm:w-7">
          {comment.author.profileImage && (
            <AvatarImage
              src={comment.author.profileImage}
              alt={comment.author.username}
              className="object-cover"
            />
          )}
          <AvatarFallback className="text-xs">
            {comment.author.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div
          className={`flex-1 rounded-xl ${highlightBg ? 'bg-blue-50' : 'bg-gray-50'} p-2 transition-colors duration-3000 ease-in-out sm:p-2.5`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Link
                href={`/profile/${comment.author.username}`}
                className="text-sm font-medium text-gray-900 hover:underline sm:text-sm"
              >
                {comment.author.username}
              </Link>
              <span className="text-xs text-gray-500 sm:text-xs">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            {isAuthor && (
              <CommentItemDropdown
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
                isDeleting={isDeleting}
              />
            )}
          </div>

          {isEditing ? (
            <div className="mt-1.5">
              <Textarea
                value={editedContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setEditedContent(e.target.value)
                }
                className="min-h-[50px] w-full resize-none rounded-lg border-gray-200 bg-white text-base placeholder:text-xs sm:min-h-[60px] sm:text-xs sm:placeholder:text-xs"
                ref={textareaRef}
              />
              <div className="mt-2 flex justify-end gap-1.5 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 cursor-pointer rounded-full px-3 py-1 text-sm sm:h-9 sm:px-4"
                  onClick={handleCancelEdit}
                >
                  취소
                </Button>
                <Button
                  size="sm"
                  className="h-8 cursor-pointer rounded-full bg-gray-900 px-3 py-1 text-sm text-white hover:bg-gray-800 sm:h-9 sm:px-4"
                  onClick={handleSaveEdit}
                  disabled={!editedContent.trim()}
                >
                  저장
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-1 text-sm whitespace-pre-wrap text-gray-800 sm:text-sm">
                {comment.content}
              </p>

              {/* 좋아요 버튼 */}
              <div className="mt-1 flex justify-start">
                <button
                  onClick={handleLikeToggle}
                  className={`flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-sm transition-colors ${
                    isLiked
                      ? 'bg-green-50 text-green-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp
                    className={`h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 ${isLiked ? 'fill-green-600' : ''}`}
                  />
                  <span>{likeCount}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 로그인 다이얼로그 */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
