import {
  addReviewComment,
  likeComment as apiLikeComment,
  unlikeComment as apiUnlikeComment,
  CreateCommentDto,
  deleteComment,
  getReviewComments,
} from '@/apis/review';
import { CommentsResponse, Review } from '@/apis/review/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useBookDetails } from './useBookDetails';

export function useReviewComments(reviewId: number) {
  const { book, isbn } = useBookDetails();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  // 댓글 목록 조회
  const { data, isLoading } = useQuery<CommentsResponse>({
    queryKey: ['review-comments', reviewId],
    queryFn: async () => {
      try {
        const response = await getReviewComments(reviewId);
        return response;
      } catch {
        // 에러 발생 시 기본 형식에 맞는 빈 데이터 반환
        return { comments: [] };
      }
    },
  });

  // 댓글 입력 변경 핸들러
  const handleCommentTextChange = useCallback((text: string) => {
    setCommentText(text);
  }, []);

  // 댓글 추가 뮤테이션
  const { mutate: submitComment, isPending: isSubmitting } = useMutation({
    mutationFn: (content: string) => {
      const commentData: CreateCommentDto = { content };
      return addReviewComment(reviewId, commentData);
    },
    onMutate: async () => {
      // 낙관적 업데이트를 위해 기존 댓글 목록 저장
      await queryClient.cancelQueries({
        queryKey: ['review-comments', reviewId],
      });
      const previousComments = queryClient.getQueryData([
        'review-comments',
        reviewId,
      ]);

      // 여기서 낙관적 업데이트는 복잡하므로 생략하고 성공 후 데이터를 갱신합니다.

      return { previousComments };
    },
    onSuccess: () => {
      // 댓글 목록 갱신
      queryClient.invalidateQueries({
        queryKey: ['review-comments', reviewId],
      });

      // 리뷰 목록의 댓글 수만 업데이트 (리뷰 전체 데이터 다시 로드 방지)
      updateReviewCommentCount(reviewId, 1);

      // 입력창 초기화
      setCommentText('');
      toast.success('댓글이 등록되었습니다');
    },
    onError: () => {
      // 오류 발생 시 사용자에게 알림
      toast.error('댓글 등록에 실패했습니다. 다시 시도해주세요.');
    },
  });

  // 댓글 삭제 뮤테이션
  const { mutate: removeComment, isPending: isDeleting } = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onMutate: async commentId => {
      // 낙관적 업데이트를 위해 기존 댓글 목록 저장
      await queryClient.cancelQueries({
        queryKey: ['review-comments', reviewId],
      });
      const previousComments = queryClient.getQueryData([
        'review-comments',
        reviewId,
      ]);

      // 낙관적 업데이트: 삭제된 댓글을 UI에서 즉시 제거
      queryClient.setQueryData(['review-comments', reviewId], (old: any) => {
        if (!old || !old.comments) return old;
        return {
          ...old,
          comments: old.comments.filter(
            (comment: any) => comment.id !== commentId
          ),
        };
      });

      return { previousComments };
    },
    onSuccess: () => {
      // 댓글 목록 갱신
      queryClient.invalidateQueries({
        queryKey: ['review-comments', reviewId],
      });

      // 리뷰 목록의 댓글 수만 업데이트 (리뷰 전체 데이터 다시 로드 방지)
      updateReviewCommentCount(reviewId, -1);

      toast.success('댓글이 삭제되었습니다');
    },
    onError: (_, __, context) => {
      // 오류 발생 시 이전 상태로 복원
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['review-comments', reviewId],
          context.previousComments
        );
      }
      toast.error('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
    },
  });

  // 댓글 좋아요 뮤테이션
  const { mutate: likeComment, isPending: isLikingComment } = useMutation({
    mutationFn: (commentId: number) => apiLikeComment(commentId),
    onMutate: async commentId => {
      // 낙관적 업데이트를 위해 기존 댓글 목록 저장
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
    onError: (_, __, context) => {
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
  const { mutate: unlikeComment, isPending: isUnlikingComment } = useMutation({
    mutationFn: (commentId: number) => apiUnlikeComment(commentId),
    onMutate: async commentId => {
      // 낙관적 업데이트를 위해 기존 댓글 목록 저장
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
    onError: (_, __, context) => {
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

  // 리뷰의 댓글 수만 업데이트하는 헬퍼 함수
  const updateReviewCommentCount = (reviewId: number, changeAmount: number) => {
    // 'book-reviews' 쿼리 키들을 가져옴
    const queryKeys = queryClient.getQueryCache().findAll({
      queryKey: ['book-reviews'],
    });

    // 각 쿼리 키에 대해 댓글 수 업데이트
    queryKeys.forEach(query => {
      // 모든 book-reviews 쿼리를 업데이트
      queryClient.setQueryData(query.queryKey, (oldData: any) => {
        // 배열 형태인 경우
        if (Array.isArray(oldData)) {
          return oldData.map((review: Review) =>
            review.id === reviewId
              ? {
                  ...review,
                  commentsCount: Math.max(
                    0,
                    (review.commentsCount || 0) + changeAmount
                  ),
                }
              : review
          );
        }

        // { data: [...], meta: {...} } 형태인 경우
        if (oldData?.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: oldData.data.map((review: Review) =>
              review.id === reviewId
                ? {
                    ...review,
                    commentsCount: Math.max(
                      0,
                      (review.commentsCount || 0) + changeAmount
                    ),
                  }
                : review
            ),
          };
        }

        // 무한 쿼리 형태인 경우 ({ pages: [{...}] })
        if (oldData?.pages && Array.isArray(oldData.pages)) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => {
              if (!page || !page.data || !Array.isArray(page.data)) return page;

              return {
                ...page,
                data: page.data.map((review: Review) =>
                  review.id === reviewId
                    ? {
                        ...review,
                        commentsCount: Math.max(
                          0,
                          (review.commentsCount || 0) + changeAmount
                        ),
                      }
                    : review
                ),
              };
            }),
          };
        }

        return oldData;
      });
    });

    // 리뷰 목록 전체 갱신을 위해 추가로 무효화
    if (book?.id) {
      queryClient.invalidateQueries({
        queryKey: ['book-reviews', book.id],
        exact: false,
        refetchType: 'none',
      });
    }

    // ISBN을 사용하는 경우도 처리
    if (isbn) {
      queryClient.invalidateQueries({
        queryKey: ['book-reviews', -1],
        exact: false,
        refetchType: 'none',
      });
    }
  };

  // 댓글 좋아요 토글 핸들러
  const handleLikeComment = useCallback(
    (commentId: number, isLiked: boolean) => {
      if (isLiked) {
        unlikeComment(commentId);
      } else {
        likeComment(commentId);
      }
    },
    [likeComment, unlikeComment]
  );

  // 댓글 제출 핸들러
  const handleSubmitComment = useCallback(() => {
    if (!commentText.trim()) return;
    submitComment(commentText);
  }, [commentText, submitComment]);

  // 댓글 삭제 핸들러
  const handleDeleteComment = useCallback(
    (commentId: number) => {
      removeComment(commentId);
    },
    [removeComment]
  );

  // comments가 배열이 아니면 빈 배열로 처리
  const comments = Array.isArray(data?.comments)
    ? data.comments
    : Array.isArray(data)
      ? data
      : [];

  return {
    comments,
    commentText,
    isLoading,
    isSubmitting,
    isDeleting,
    isLikingComment: isLikingComment || isUnlikingComment,
    handleCommentTextChange,
    handleSubmitComment,
    handleDeleteComment,
    handleLikeComment,
  };
}
