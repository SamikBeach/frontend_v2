import { likeReview, unlikeReview } from '@/apis/review/review';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export function useReviewLike() {
  const queryClient = useQueryClient();
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // 리뷰 좋아요 뮤테이션
  const likeMutation = useMutation({
    mutationFn: (reviewId: number) => likeReview(reviewId),
    onMutate: async reviewId => {
      // 낙관적 업데이트를 위해 이전 캐시 값 보존
      await queryClient.cancelQueries({ queryKey: ['reviews'] });
      const previousReviews = queryClient.getQueryData(['reviews']);

      // 캐시 업데이트
      queryClient.setQueryData(['reviews'], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.map((review: any) =>
            review.id === reviewId
              ? {
                  ...review,
                  isLiked: true,
                  likeCount: review.likeCount + 1,
                }
              : review
          ),
        };
      });

      return { previousReviews };
    },
    onError: (err, reviewId, context) => {
      // 에러 발생 시 이전 상태로 롤백
      queryClient.setQueryData(['reviews'], context?.previousReviews);
      toast.error('좋아요 처리 중 문제가 발생했습니다.');
    },
    onSettled: () => {
      // 뮤테이션 완료 후 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setTimeout(() => {
        setIsLikeLoading(false);
      }, 300);
    },
  });

  // 리뷰 좋아요 취소 뮤테이션
  const unlikeMutation = useMutation({
    mutationFn: (reviewId: number) => unlikeReview(reviewId),
    onMutate: async reviewId => {
      // 낙관적 업데이트를 위해 이전 캐시 값 보존
      await queryClient.cancelQueries({ queryKey: ['reviews'] });
      const previousReviews = queryClient.getQueryData(['reviews']);

      // 캐시 업데이트
      queryClient.setQueryData(['reviews'], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.map((review: any) =>
            review.id === reviewId
              ? {
                  ...review,
                  isLiked: false,
                  likeCount: review.likeCount > 0 ? review.likeCount - 1 : 0,
                }
              : review
          ),
        };
      });

      return { previousReviews };
    },
    onError: (err, reviewId, context) => {
      // 에러 발생 시 이전 상태로 롤백
      queryClient.setQueryData(['reviews'], context?.previousReviews);
      toast.error('좋아요 취소 중 문제가 발생했습니다.');
    },
    onSettled: () => {
      // 뮤테이션 완료 후 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setTimeout(() => {
        setIsLikeLoading(false);
      }, 300);
    },
  });

  // 리뷰 좋아요 처리 함수
  const handleLike = useCallback(
    (reviewId: number, isLiked: boolean) => {
      setIsLikeLoading(true);

      if (isLiked) {
        unlikeMutation.mutate(reviewId);
      } else {
        likeMutation.mutate(reviewId);
      }
    },
    [likeMutation, unlikeMutation]
  );

  return {
    handleLike,
    isLikeLoading,
  };
}
