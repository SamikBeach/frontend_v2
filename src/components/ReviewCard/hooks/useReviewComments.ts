import {
  createComment as apiCreateComment,
  deleteComment as apiDeleteComment,
  likeComment as apiLikeComment,
  unlikeComment as apiUnlikeComment,
  getReviewComments,
} from '@/apis/review/review';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

// 댓글 및 댓글 생성 타입 정의
interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    email?: string;
  };
  likeCount?: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

interface UseReviewCommentsResult {
  comments: Comment[];
  isLoading: boolean;
  error: Error | null;
  commentText: string;
  setCommentText: (text: string) => void;
  handleAddComment: () => Promise<void>;
  handleDeleteComment: (commentId: number) => Promise<void>;
  handleLikeComment: (commentId: number, isLiked: boolean) => Promise<void>;
  replyToCommentId: number | null;
  setReplyToCommentId: (id: number | null) => void;
  refetch: () => Promise<any>;
}

export function useReviewComments(
  reviewId: number,
  showComments: boolean = false
): UseReviewCommentsResult {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const [commentText, setCommentText] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);

  // 댓글 목록 조회 - showComments가 true일 때만 활성화
  const {
    data: commentsResponse = { comments: [] },
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['review-comments', reviewId],
    queryFn: () => getReviewComments(reviewId),
    staleTime: 1000 * 60 * 5, // 5분
    enabled: showComments, // 댓글이 표시될 때만 데이터 가져오기
  });

  const comments = commentsResponse.comments || [];

  // 댓글 추가 mutation
  const { mutateAsync: addComment, isPending: isAddingComment } = useMutation({
    mutationFn: async () => {
      return apiCreateComment(reviewId, {
        content: commentText,
        parentId: replyToCommentId || undefined,
      });
    },
    onMutate: async () => {
      // 낙관적 업데이트를 위해 기존 데이터 저장
      await queryClient.cancelQueries({
        queryKey: ['review-comments', reviewId],
      });
      const previousComments = queryClient.getQueryData([
        'review-comments',
        reviewId,
      ]);

      // 낙관적 업데이트: 댓글 수 증가
      queryClient.setQueryData(['review-comments', reviewId], (old: any) => {
        if (!old || !old.comments) return old;
        return {
          ...old,
          comments: [
            ...old.comments,
            {
              id: Date.now(), // 임시 ID
              content: commentText,
              author: {
                id: currentUser?.id || 0,
                username: currentUser?.username || '',
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              likeCount: 0,
              isLiked: false,
            },
          ],
        };
      });

      // 커뮤니티 리뷰의 댓글 수도 업데이트
      const queryKeys = queryClient.getQueryCache().findAll({
        queryKey: ['communityReviews'],
      });

      const previousReviews: Record<string, unknown> = {};

      queryKeys.forEach(query => {
        const previousData = queryClient.getQueryData(query.queryKey);
        previousReviews[query.queryKey.join('/')] = previousData;

        queryClient.setQueryData(query.queryKey, (old: any) => {
          if (!old || !old.pages) return old;

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              reviews: page.reviews.map((review: any) =>
                review.id === reviewId
                  ? {
                      ...review,
                      commentsCount: (review.commentsCount || 0) + 1,
                    }
                  : review
              ),
            })),
          };
        });
      });

      return { previousComments, previousReviews };
    },
    onSuccess: () => {
      // 댓글 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: ['review-comments', reviewId],
      });
    },
    onError: (_, __, context) => {
      // 에러 발생 시 이전 상태로 복원
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['review-comments', reviewId],
          context.previousComments
        );
      }

      if (context?.previousReviews) {
        Object.entries(context.previousReviews).forEach(([key, data]) => {
          const queryKey = key.split('/');
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error('댓글 작성에 실패했습니다.');
    },
  });

  // 댓글 삭제 mutation
  const { mutateAsync: deleteComment, isPending: isDeletingComment } =
    useMutation({
      mutationFn: async (commentId: number) => {
        return apiDeleteComment(commentId);
      },
      onMutate: async commentId => {
        // 낙관적 업데이트를 위해 기존 데이터 저장
        await queryClient.cancelQueries({
          queryKey: ['review-comments', reviewId],
        });
        const previousComments = queryClient.getQueryData([
          'review-comments',
          reviewId,
        ]);

        // 낙관적 업데이트: 댓글 삭제
        queryClient.setQueryData(['review-comments', reviewId], (old: any) => {
          if (!old || !old.comments) return old;
          return {
            ...old,
            comments: old.comments.filter(
              (comment: any) => comment.id !== commentId
            ),
          };
        });

        // 커뮤니티 리뷰의 댓글 수도 업데이트
        const queryKeys = queryClient.getQueryCache().findAll({
          queryKey: ['communityReviews'],
        });

        const previousReviews: Record<string, unknown> = {};

        queryKeys.forEach(query => {
          const previousData = queryClient.getQueryData(query.queryKey);
          previousReviews[query.queryKey.join('/')] = previousData;

          queryClient.setQueryData(query.queryKey, (old: any) => {
            if (!old || !old.pages) return old;

            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                reviews: page.reviews.map((review: any) =>
                  review.id === reviewId
                    ? {
                        ...review,
                        commentsCount: Math.max(
                          0,
                          (review.commentsCount || 0) - 1
                        ),
                      }
                    : review
                ),
              })),
            };
          });
        });

        return { previousComments, previousReviews };
      },
      onSuccess: () => {
        // 댓글 목록 새로고침
        queryClient.invalidateQueries({
          queryKey: ['review-comments', reviewId],
        });
      },
      onError: (_, __, context) => {
        // 에러 발생 시 이전 상태로 복원
        if (context?.previousComments) {
          queryClient.setQueryData(
            ['review-comments', reviewId],
            context.previousComments
          );
        }

        if (context?.previousReviews) {
          Object.entries(context.previousReviews).forEach(([key, data]) => {
            const queryKey = key.split('/');
            queryClient.setQueryData(queryKey, data);
          });
        }

        toast.error('댓글 삭제에 실패했습니다.');
      },
    });

  // 댓글 좋아요 뮤테이션
  const { mutate: likeComment, isPending: isLiking } = useMutation({
    mutationFn: (commentId: number) => apiLikeComment(commentId),
    onMutate: async commentId => {
      // 낙관적 업데이트를 위해 기존 데이터 저장
      await queryClient.cancelQueries({
        queryKey: ['review-comments', reviewId],
      });
      const previousComments = queryClient.getQueryData([
        'review-comments',
        reviewId,
      ]);

      // 낙관적 업데이트: 댓글의 좋아요 상태와 개수 변경
      queryClient.setQueryData(['review-comments', reviewId], (old: any) => {
        if (!old || !old.comments) return old;
        return {
          ...old,
          comments: old.comments.map((comment: any) =>
            comment.id === commentId
              ? {
                  ...comment,
                  isLiked: true,
                  likeCount: (comment.likeCount || 0) + 1,
                }
              : comment
          ),
        };
      });

      return { previousComments };
    },
    onSuccess: () => {
      // 댓글 목록 완전히 새로고침하여 서버 상태 동기화
      queryClient.invalidateQueries({
        queryKey: ['review-comments', reviewId],
      });
    },
    onError: (error, commentId, context) => {
      // 오류 발생 시 이전 상태로 복원
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['review-comments', reviewId],
          context.previousComments
        );
      }
      toast.error('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    },
  });

  // 댓글 좋아요 취소 뮤테이션
  const { mutate: unlikeComment, isPending: isUnliking } = useMutation({
    mutationFn: (commentId: number) => apiUnlikeComment(commentId),
    onMutate: async commentId => {
      // 낙관적 업데이트를 위해 기존 데이터 저장
      await queryClient.cancelQueries({
        queryKey: ['review-comments', reviewId],
      });
      const previousComments = queryClient.getQueryData([
        'review-comments',
        reviewId,
      ]);

      // 낙관적 업데이트: 댓글의 좋아요 상태와 개수 변경
      queryClient.setQueryData(['review-comments', reviewId], (old: any) => {
        if (!old || !old.comments) return old;
        return {
          ...old,
          comments: old.comments.map((comment: any) =>
            comment.id === commentId
              ? {
                  ...comment,
                  isLiked: false,
                  likeCount: Math.max(0, (comment.likeCount || 0) - 1),
                }
              : comment
          ),
        };
      });

      return { previousComments };
    },
    onSuccess: () => {
      // 댓글 목록 완전히 새로고침하여 서버 상태 동기화
      queryClient.invalidateQueries({
        queryKey: ['review-comments', reviewId],
      });
    },
    onError: (error, commentId, context) => {
      // 오류 발생 시 이전 상태로 복원
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['review-comments', reviewId],
          context.previousComments
        );
      }
      toast.error('좋아요 취소 처리에 실패했습니다. 다시 시도해주세요.');
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

  // 댓글 좋아요 핸들러
  const handleLikeComment = async (commentId: number, isLiked: boolean) => {
    try {
      if (isLiked) {
        await unlikeComment(commentId);
      } else {
        await likeComment(commentId);
      }
    } catch (error) {
      console.error('Failed to toggle comment like:', error);
    }
  };

  return {
    comments,
    isLoading:
      isLoading ||
      isAddingComment ||
      isDeletingComment ||
      isLiking ||
      isUnliking,
    error: error as Error | null,
    commentText,
    setCommentText,
    handleAddComment,
    handleDeleteComment,
    handleLikeComment,
    replyToCommentId,
    setReplyToCommentId,
    refetch,
  };
}
