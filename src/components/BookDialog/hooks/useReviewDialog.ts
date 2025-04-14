import { createOrUpdateRating } from '@/apis/rating/rating';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useBookDetails } from './useBookDetails';

export function useReviewDialog(initialReviewRating: number = 0) {
  const { book, isbn } = useBookDetails();
  const queryClient = useQueryClient();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(initialReviewRating);

  // 리뷰 제출 뮤테이션
  const { mutate: submitReview } = useMutation({
    mutationFn: async ({
      rating,
      content,
    }: {
      rating: number;
      content: string;
    }) => {
      if (!book?.id) return null;
      return await createOrUpdateRating(book.id, {
        rating,
        comment: content,
      });
    },
    onSuccess: data => {
      // 캐시 업데이트
      queryClient.invalidateQueries({
        queryKey: ['user-book-rating', book?.id],
      });

      // 책 상세 정보도 업데이트 (평점 평균이 바뀔 수 있으므로)
      queryClient.invalidateQueries({
        queryKey: ['book-detail', isbn],
      });

      setReviewDialogOpen(false);
      toast.success('리뷰가 저장되었습니다.');

      return data?.rating;
    },
    onError: () => {
      toast.error('리뷰 저장 중 오류가 발생했습니다.');
    },
  });

  // 리뷰 다이얼로그 열기 핸들러
  const handleOpenReviewDialog = useCallback((currentRating: number = 0) => {
    // 현재 별점이 있으면 리뷰 별점으로 설정
    if (currentRating > 0) {
      setReviewRating(currentRating);
    }
    setReviewDialogOpen(true);
  }, []);

  // 리뷰 제출 처리
  const handleReviewSubmit = useCallback(
    (rating: number, content: string) => {
      submitReview({ rating, content });
    },
    [submitReview]
  );

  return {
    reviewDialogOpen,
    setReviewDialogOpen,
    reviewRating,
    setReviewRating,
    handleOpenReviewDialog,
    handleReviewSubmit,
  };
}
