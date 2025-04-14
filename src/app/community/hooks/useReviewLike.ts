import {
  likeReview as apiLikeReview,
  unlikeReview as apiUnlikeReview,
} from '@/apis/review/review';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseReviewLikeResult {
  handleLikeToggle: (reviewId: number, isLiked: boolean) => Promise<void>;
  isLoading: boolean;
}

export function useReviewLike(): UseReviewLikeResult {
  const queryClient = useQueryClient();

  // 좋아요 추가 mutation
  const { mutateAsync: addLike, isPending: isAddLikeLoading } = useMutation({
    mutationFn: (reviewId: number) => apiLikeReview(reviewId),
    onSuccess: (_, reviewId) => {
      // 게시물 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ['community-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review', reviewId] });
    },
  });

  // 좋아요 취소 mutation
  const { mutateAsync: removeLike, isPending: isRemoveLikeLoading } =
    useMutation({
      mutationFn: (reviewId: number) => apiUnlikeReview(reviewId),
      onSuccess: (_, reviewId) => {
        // 게시물 데이터 새로고침
        queryClient.invalidateQueries({ queryKey: ['community-reviews'] });
        queryClient.invalidateQueries({ queryKey: ['review', reviewId] });
      },
    });

  // 좋아요 토글 핸들러
  const handleLikeToggle = async (reviewId: number, isLiked: boolean) => {
    try {
      if (isLiked) {
        await removeLike(reviewId);
      } else {
        await addLike(reviewId);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  return {
    handleLikeToggle,
    isLoading: isAddLikeLoading || isRemoveLikeLoading,
  };
}
