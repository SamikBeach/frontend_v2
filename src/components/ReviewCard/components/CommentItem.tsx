import { updateComment } from '@/apis/review/review';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CommentItemProps } from '../types';
import { CommentItemDropdown } from './CommentItemDropdown';

export function CommentItem({
  comment,
  formatDate,
  currentUser,
  onDelete,
  onLike,
  isHighlighted = false,
  isMobile = false,
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

  // 하이라이트 효과 관리 - 3초 후 사라짐
  useEffect(() => {
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
      // 댓글 목록 리로드
      queryClient.invalidateQueries({
        queryKey: ['review-comments'],
        exact: false,
      });
      setIsEditing(false);
      toast.success('댓글이 수정되었습니다.');
    },
    onError: () => {
      toast.error('댓글 수정 중 오류가 발생했습니다.');
    },
  });

  const handleEditComment = () => {
    setIsEditing(true);
    setIsDropdownOpen(false);
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) return;

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

  // 모바일 환경에 따른 스타일 및 크기 조정
  const avatarSize = isMobile ? 'h-6 w-6' : 'h-7 w-7';
  const commentPadding = isMobile ? 'p-2' : 'p-2.5';
  const usernameSize = isMobile ? 'text-xs' : 'text-sm';
  const dateSize = isMobile ? 'text-[10px]' : 'text-xs';
  const contentSize = isMobile ? 'text-xs' : 'text-sm';
  const buttonHeight = isMobile ? 'h-6' : 'h-7';
  const buttonPadding = isMobile ? 'px-2.5' : 'px-3';
  const iconSize = isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3';
  const gap = isMobile ? 'gap-1' : 'gap-1.5';
  const textareaHeight = isMobile ? 'min-h-[50px]' : 'min-h-[60px]';
  const buttonGap = isMobile ? 'gap-1.5' : 'gap-2';
  const commentGap = isMobile ? 'gap-1.5' : 'gap-2';

  return (
    <>
      <div id={`comment-${comment.id}`} className={`flex w-full ${commentGap}`}>
        <Avatar className={`${avatarSize} flex-shrink-0`}>
          {comment.author.profileImage && (
            <AvatarImage
              src={comment.author.profileImage}
              alt={comment.author.username}
              className="object-cover"
            />
          )}
          <AvatarFallback className="bg-gray-200 text-gray-700">
            {comment.author.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div
          className={`flex-1 rounded-xl ${highlightBg ? 'bg-blue-50' : 'bg-gray-50'} ${commentPadding} transition-colors duration-3000 ease-in-out`}
        >
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${gap}`}>
              <Link
                href={`/profile/${comment.author.username}`}
                className={`${usernameSize} font-medium text-gray-900 hover:underline`}
              >
                {comment.author.username}
              </Link>
              <span className={`${dateSize} text-gray-500`}>
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
                className={`${textareaHeight} w-full resize-none rounded-lg border-gray-200 bg-white text-xs`}
              />
              <div className={`mt-2 flex justify-end ${buttonGap}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${buttonHeight} rounded-full ${buttonPadding} py-1 text-xs`}
                  onClick={handleCancelEdit}
                >
                  취소
                </Button>
                <Button
                  size="sm"
                  className={`${buttonHeight} rounded-full bg-gray-900 ${buttonPadding} py-1 text-xs text-white hover:bg-gray-800`}
                  onClick={handleSaveEdit}
                  disabled={!editedContent.trim()}
                >
                  저장
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className={`mt-1 ${contentSize} text-gray-800`}>
                {comment.content}
              </p>

              {/* 좋아요 버튼 */}
              <div className="mt-1 flex justify-start">
                <button
                  onClick={handleLikeToggle}
                  className={`flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors ${
                    isLiked
                      ? 'bg-pink-50 text-pink-500'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp
                    className={`${iconSize} ${isLiked ? 'fill-pink-500' : ''}`}
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
