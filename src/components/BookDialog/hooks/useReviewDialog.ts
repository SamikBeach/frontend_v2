import { createOrUpdateRating } from '@/apis/rating/rating';
import { createReview } from '@/apis/review/review';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useBookDetails } from './useBookDetails';

export function useReviewDialog() {
  const { book, isbn, userRating: userRatingData } = useBookDetails();
  const queryClient = useQueryClient();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // 리뷰 제출 뮤테이션
  const mutation = useMutation({
    mutationFn: async ({
      rating,
      content,
    }: {
      rating: number;
      content: string;
    }) => {
      if (!book?.id) {
        throw new Error('책 정보를 찾을 수 없습니다.');
      }

      // 항상 평점 등록 (comment 없이)
      const ratingResult = await createOrUpdateRating(book.id, { rating });

      // content가 있는 경우 리뷰 생성
      if (content.trim()) {
        await createReview({
          content: content.trim(),
          type: 'review',
          bookId: parseInt(String(book.id), 10),
        });
      }

      return ratingResult;
    },
    onSuccess: data => {
      // 관련된 모든 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['user-book-rating', book?.id],
      });

      // book-detail 쿼리 무효화 (별점 정보가 포함된 책 정보 갱신)
      queryClient.invalidateQueries({
        queryKey: ['book-detail', isbn],
      });

      // 리뷰 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['book-reviews', book?.id],
      });

      // 직접 book-detail 캐시 업데이트 (별점 즉시 반영)
      if (book && isbn) {
        queryClient.setQueryData(['book-detail', isbn], (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            userRating: data,
          };
        });
      }

      // 다이얼로그 닫기
      setReviewDialogOpen(false);

      toast.success('리뷰가 성공적으로 저장되었습니다.');
      return data?.rating;
    },
    onError: error => {
      console.error('리뷰 저장 오류:', error);
      toast.error('리뷰 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    },
  });

  // 현재 사용자의 별점 가져오기
  const userRating = userRatingData?.rating || 0;

  // 리뷰 다이얼로그 열기 핸들러
  const handleOpenReviewDialog = useCallback(() => {
    setReviewDialogOpen(true);
  }, []);

  // 리뷰 제출 처리
  const handleReviewSubmit = useCallback(
    (rating: number, content: string) => {
      if (rating === 0) {
        toast.error('별점을 선택해주세요.');
        return;
      }

      mutation.mutate({ rating, content });
    },
    [mutation]
  );

  return {
    reviewDialogOpen,
    setReviewDialogOpen,
    userRating,
    handleOpenReviewDialog,
    handleReviewSubmit,
    isSubmitting: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    status: mutation.status,
    data: mutation.data,
  };
}
