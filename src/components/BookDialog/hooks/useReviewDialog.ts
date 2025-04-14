import { createOrUpdateRating } from '@/apis/rating/rating';
import { createReview, updateReview } from '@/apis/review/review';
import { Review } from '@/apis/review/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useBookDetails } from './useBookDetails';

export function useReviewDialog() {
  const { book, isbn, userRating: userRatingData } = useBookDetails();
  const queryClient = useQueryClient();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // 수정 모드 상태 추가
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [initialContent, setInitialContent] = useState('');

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

      // 수정 모드인 경우 리뷰 업데이트
      if (isEditMode && editingReview) {
        await updateReview(editingReview.id, {
          content: content.trim(),
          type: 'review',
          bookId: parseInt(String(book.id), 10),
        });
      }
      // 새 리뷰 작성 (내용이 있는 경우)
      else if (content.trim()) {
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

        // book-reviews 쿼리 데이터 업데이트하여 별점 즉시 반영
        queryClient.setQueryData(['book-reviews', book.id], (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          // 해당 책에 대한 모든 리뷰에 새로운 별점 정보 추가
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => {
              if (!page || !page.data) return page;

              return {
                ...page,
                data: page.data.map((review: any) => {
                  // 리뷰 내부의 book ID가 현재 책 ID와 일치하는지 확인
                  const isMatchingBook = review.book?.id === book.id;

                  if (isMatchingBook) {
                    return {
                      ...review,
                      authorRating: {
                        bookId: book.id,
                        rating: data.rating,
                        comment: data.comment || '',
                      },
                      // authorRatings도 업데이트
                      authorRatings: [
                        {
                          bookId: book.id,
                          rating: data.rating,
                          comment: data.comment || '',
                        },
                      ],
                    };
                  }
                  return review;
                }),
              };
            }),
          };
        });
      }

      // 다이얼로그 닫기
      setReviewDialogOpen(false);

      // 수정 모드 초기화
      resetEditMode();

      toast.success(
        isEditMode
          ? '리뷰가 수정되었습니다.'
          : '리뷰가 성공적으로 저장되었습니다.'
      );
      return data?.rating;
    },
    onError: error => {
      toast.error('리뷰 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    },
  });

  // 수정 모드 초기화
  const resetEditMode = useCallback(() => {
    setIsEditMode(false);
    setEditingReview(null);
    setInitialContent('');
  }, []);

  // 현재 사용자의 별점 가져오기
  const userRating = userRatingData?.rating || 0;

  // 리뷰 다이얼로그 열기 핸들러 (새 리뷰 작성)
  const handleOpenReviewDialog = useCallback(() => {
    resetEditMode();
    setReviewDialogOpen(true);
  }, [resetEditMode]);

  // 리뷰 수정 다이얼로그 열기 핸들러
  const handleOpenEditReviewDialog = useCallback((review: Review) => {
    setIsEditMode(true);
    setEditingReview(review);
    setInitialContent(review.content);
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
    isEditMode,
    initialContent,
    handleOpenReviewDialog,
    handleOpenEditReviewDialog,
    handleReviewSubmit,
    isSubmitting: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    status: mutation.status,
    data: mutation.data,
  };
}
