import { updateComment } from '@/apis/review/review';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MoreHorizontal, Pencil, ThumbsUp, Trash } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CommentItemProps } from '../types';

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
      onDelete(comment.id);
    }
    setIsDropdownOpen(false);
  };

  // 댓글 좋아요 토글 핸들러
  const handleLikeToggle = async () => {
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
    <div id={`comment-${comment.id}`} className="flex w-full gap-2">
      <Avatar className="h-7 w-7 flex-shrink-0">
        <AvatarImage
          src={comment.author.profileImage || `/images/avatars/placeholder.png`}
          alt={comment.author.username}
          className="object-cover"
        />
        <AvatarFallback className="bg-gray-200 text-gray-700">
          {comment.author.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div
        className={`flex-1 rounded-xl ${highlightBg ? 'bg-blue-50' : 'bg-gray-50'} p-2.5 transition-colors duration-3000 ease-in-out`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/profile/${comment.author.username}`}
              className="text-sm font-medium text-gray-900 hover:underline"
            >
              {comment.author.username}
            </Link>
            <span className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {isAuthor && (
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 rounded-xl">
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg py-1.5 text-xs"
                  onSelect={handleEditComment}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  수정하기
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg py-1.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-500"
                  onSelect={handleDeleteComment}
                >
                  <Trash className="mr-1.5 h-3.5 w-3.5 text-red-500" />
                  삭제하기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <div className="mt-1.5">
            <Textarea
              value={editedContent}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEditedContent(e.target.value)
              }
              className="min-h-[60px] w-full resize-none rounded-lg border-gray-200 bg-white text-xs"
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 rounded-full px-3 py-1 text-xs"
                onClick={handleCancelEdit}
              >
                취소
              </Button>
              <Button
                size="sm"
                className="h-7 rounded-full bg-gray-900 px-3 py-1 text-xs text-white hover:bg-gray-800"
                onClick={handleSaveEdit}
                disabled={!editedContent.trim()}
              >
                저장
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-1 text-sm text-gray-800">{comment.content}</p>

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
                  className={`h-3 w-3 ${isLiked ? 'fill-pink-500' : ''}`}
                />
                <span>{likeCount}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
