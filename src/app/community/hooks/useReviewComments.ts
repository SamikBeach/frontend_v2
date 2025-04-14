import {
  Comment,
  createComment as apiCreateComment,
  deleteComment as apiDeleteComment,
  getReviewComments,
} from '@/apis/review/review';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface UseReviewCommentsResult {
  comments: Comment[];
  isLoading: boolean;
  error: Error | null;
  commentText: string;
  setCommentText: (text: string) => void;
  handleAddComment: () => Promise<void>;
  handleDeleteComment: (commentId: number) => Promise<void>;
  replyToCommentId: number | null;
  setReplyToCommentId: (id: number | null) => void;
}

export function useReviewComments(reviewId: number): UseReviewCommentsResult {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);

  // 댓글 목록 조회
  const {
    data: comments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['review-comments', reviewId],
    queryFn: () => getReviewComments(reviewId),
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 댓글 추가 mutation
  const { mutateAsync: addComment, isPending: isAddingComment } = useMutation({
    mutationFn: async () => {
      return apiCreateComment(reviewId, {
        content: commentText,
        parentCommentId: replyToCommentId || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['review-comments', reviewId],
      });
      // 게시물 데이터의 댓글 수도 업데이트
      queryClient.invalidateQueries({ queryKey: ['community-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review', reviewId] });
    },
  });

  // 댓글 삭제 mutation
  const { mutateAsync: deleteComment, isPending: isDeletingComment } =
    useMutation({
      mutationFn: async (commentId: number) => {
        return apiDeleteComment(commentId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['review-comments', reviewId],
        });
        // 게시물 데이터의 댓글 수도 업데이트
        queryClient.invalidateQueries({ queryKey: ['community-reviews'] });
        queryClient.invalidateQueries({ queryKey: ['review', reviewId] });
      },
    });

  // 댓글 추가 핸들러
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await addComment();
      // 성공 시 입력 필드 초기화
      setCommentText('');
      setReplyToCommentId(null);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return {
    comments,
    isLoading: isLoading || isAddingComment || isDeletingComment,
    error: error as Error | null,
    commentText,
    setCommentText,
    handleAddComment,
    handleDeleteComment,
    replyToCommentId,
    setReplyToCommentId,
  };
}
