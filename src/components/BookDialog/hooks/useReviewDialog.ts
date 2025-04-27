import { createOrUpdateRating } from '@/apis/rating/rating';
import { createReview, updateReview } from '@/apis/review/review';
import { Review } from '@/apis/review/types';
import { bookReviewSortAtom } from '@/atoms/book';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { invalidateUserProfileQueries } from '@/utils/query';
import { BookWithRating } from '@/utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useBookDetails } from './useBookDetails';

export function useReviewDialog() {
  const { book, isbn, userRating: userRatingData } = useBookDetails();
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const pathname = usePathname();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const sort = useAtomValue(bookReviewSortAtom);

  // 수정 모드 상태 추가
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [initialContent, setInitialContent] = useState('');

  // 리뷰 제출 뮤테이션 (생성/수정/별점 모두 처리)
  const mutation = useMutation({
    mutationFn: async (params: {
      rating: number;
      content: string;
    }): Promise<any> => {
      const { rating, content } = params;

      // 책 ID 확인
      if (!book?.id) {
        throw new Error('책 정보가 없습니다.');
      }

      // 리뷰 수정 모드
      if (isEditMode && editingReview) {
        // 리뷰 수정 시에도 별점 업데이트 필요
        // 먼저 별점 업데이트 - comment 없이 rating만 전송
        const ratingResponse = await createOrUpdateRating(
          book.id,
          { rating },
          book.id < 0 ? isbn : undefined
        );

        // 그 다음 리뷰 내용 업데이트
        const reviewResponse = await updateReview(editingReview.id, {
          content,
          bookId: book.id,
        });

        // 별점과 리뷰 응답을 합쳐서 반환
        return {
          ...reviewResponse,
          rating: ratingResponse.rating,
          ratingId: ratingResponse.id,
        };
      }

      // 별점만 등록(또는 업데이트)하는 경우
      if (!content.trim()) {
        return await createOrUpdateRating(
          book.id,
          { rating },
          book.id < 0 ? isbn : undefined
        );
      }

      // 새 리뷰 생성 - 별점과 리뷰를 따로 처리
      // 먼저 별점 업데이트 - comment 없이 rating만 전송
      const ratingResponse = await createOrUpdateRating(
        book.id,
        { rating },
        book.id < 0 ? isbn : undefined
      );

      // 그 다음 리뷰 생성
      const reviewResponse = await createReview({
        content,
        type: 'review',
        bookId: book.id,
      });

      // 별점과 리뷰 응답을 합쳐서 반환
      return {
        ...reviewResponse,
        rating: ratingResponse.rating,
        ratingId: ratingResponse.id,
      };
    },
    onSuccess: data => {
      // 직접 book-detail 캐시 업데이트 (별점 즉시 반영)
      if (book && isbn) {
        // 별점 표시를 위한 userRating 데이터 구성
        const userRatingData = {
          id: data.ratingId || data.id,
          rating: data.rating,
          bookId: book.id,
          comment: data.comment || '',
        };

        // book-detail 쿼리 데이터 직접 업데이트
        queryClient.setQueryData(['book-detail', isbn], (oldData: unknown) => {
          if (!oldData) return oldData;

          const typedOldData = oldData as BookWithRating;

          // 평균 별점 업데이트 계산
          let newRatingValue = typedOldData.rating || 0;
          let newTotalRatings = typedOldData.totalRatings || 0;

          // 기존에 userRating이 있는지 확인
          const hadPreviousRating = !!typedOldData.userRating;
          const oldRating = typedOldData.userRating?.rating || 0;
          const newRating = data.rating;

          if (!hadPreviousRating) {
            // 새 평점 추가 - 총합에 새 평점 추가하고 카운트 증가
            const totalRatingSum = newRatingValue * newTotalRatings + newRating;
            newTotalRatings += 1;
            newRatingValue =
              newTotalRatings > 0 ? totalRatingSum / newTotalRatings : 0;
          } else if (oldRating !== newRating) {
            // 평점 변경 - 총합에서 이전 평점 제거하고 새 평점 추가
            const totalRatingSum =
              newRatingValue * newTotalRatings - oldRating + newRating;
            newRatingValue =
              newTotalRatings > 0 ? totalRatingSum / newTotalRatings : 0;
          }

          // 업데이트된 데이터 반환
          return {
            ...typedOldData,
            userRating: userRatingData,
            rating: newRatingValue,
            totalRatings: newTotalRatings,
          };
        });

        // user-book-rating 캐시 직접 업데이트
        if (book?.id) {
          queryClient.setQueryData(
            ['user-book-rating', book.id],
            userRatingData
          );
        }

        // 평균 별점 정보 계산 (book-reviews 업데이트에 사용)
        let updatedRating = book.rating || 0;
        let updatedTotalRatings = book.totalRatings || 0;

        // 기존에 userRating이 있는지 확인
        const hadUserRating = !!book.userRating;
        const previousRating = book.userRating?.rating || 0;
        const currentRating = data.rating;

        if (!hadUserRating) {
          // 새 평점 추가
          const sum = updatedRating * updatedTotalRatings + currentRating;
          updatedTotalRatings += 1;
          updatedRating =
            updatedTotalRatings > 0 ? sum / updatedTotalRatings : 0;
        } else if (previousRating !== currentRating) {
          // 평점 변경
          const sum =
            updatedRating * updatedTotalRatings -
            previousRating +
            currentRating;
          updatedRating =
            updatedTotalRatings > 0 ? sum / updatedTotalRatings : 0;
        }

        // book-reviews 쿼리 무효화하여 리뷰 목록 갱신
        queryClient.invalidateQueries({
          queryKey: ['book-reviews', book.id],
          refetchType: 'active',
        });

        // 추가적으로 정렬 상태를 고려하여 무효화
        queryClient.invalidateQueries({
          queryKey: ['book-reviews', book.id, sort],
          refetchType: 'active',
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
                    // 리뷰의 책 정보에도 새로운 평균 평점 반영
                    const updatedBook = review.book
                      ? {
                          ...review.book,
                          rating: updatedRating,
                          totalRatings: updatedTotalRatings,
                        }
                      : review.book;

                    return {
                      ...review,
                      userRating: userRatingData,
                      book: updatedBook,
                    };
                  }
                  return review;
                }),
              };
            }),
          };
        });
      }

      // 사용자 프로필 관련 쿼리 무효화 (현재 본인 프로필 페이지인 경우)
      invalidateUserProfileQueries(queryClient, pathname, currentUser?.id);

      // 다이얼로그 닫기
      setReviewDialogOpen(false);

      // 수정 모드 초기화
      resetEditMode();

      toast.success(
        isEditMode
          ? '리뷰가 수정되었습니다.'
          : '리뷰가 성공적으로 저장되었습니다.'
      );
    },
    onError: error => {
      console.error('리뷰 저장 오류:', error);
      toast.error(
        isEditMode ? '리뷰 수정에 실패했습니다.' : '리뷰 저장에 실패했습니다.'
      );
    },
  });

  // 리뷰 다이얼로그 열기 핸들러
  const handleOpenReviewDialog = useCallback(() => {
    // 열 때 수정 모드 초기화
    resetEditMode();
    setReviewDialogOpen(true);
  }, []);

  // 리뷰 수정 모드 초기화
  const resetEditMode = useCallback(() => {
    setIsEditMode(false);
    setEditingReview(null);
    setInitialContent('');
  }, []);

  // 리뷰 수정 다이얼로그 열기 핸들러
  const handleOpenEditReviewDialog = useCallback((review: Review) => {
    setIsEditMode(true);
    setEditingReview(review);
    setInitialContent(review.content);
    setReviewDialogOpen(true);
  }, []);

  // 리뷰 제출 핸들러
  const handleReviewSubmit = useCallback(
    (rating: number, content: string) => {
      if (!book) {
        toast.error('책 정보가 없습니다.');
        return;
      }

      // 삭제 기능이 아니라면 별점 필수
      if (rating === 0) {
        toast.error('별점을 선택해주세요.');
        return;
      }

      mutation.mutate({ rating, content });
    },
    [book, mutation]
  );

  // 사용자의 현재 별점 (없으면 0)
  const userRating = userRatingData?.rating || 0;

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
