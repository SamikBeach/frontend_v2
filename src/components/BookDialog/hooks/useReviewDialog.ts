import { createOrUpdateRating } from '@/apis/rating/rating';
import { createReview, updateReview } from '@/apis/review/review';
import { Review } from '@/apis/review/types';
import { bookReviewSortAtom } from '@/atoms/book';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { invalidateUserProfileQueries } from '@/utils/query';
import { updateBookRating } from '@/utils/rating';
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

      // 별점만 등록(또는 업데이트)하는 경우
      if (!content.trim()) {
        return await createOrUpdateRating(
          book.id,
          { rating, comment: content },
          book.id < 0 ? isbn : undefined
        );
      }

      // 리뷰 수정 모드
      if (isEditMode && editingReview) {
        return await updateReview(editingReview.id, {
          content,
          bookId: book.id,
        });
      }

      // 새 리뷰 생성
      return await createReview({
        content,
        type: 'review',
        bookId: book.id,
      });
    },
    onSuccess: data => {
      // 직접 book-detail 캐시 업데이트 (별점 즉시 반영)
      if (book && isbn) {
        // book-detail 쿼리 데이터 직접 업데이트
        queryClient.setQueryData(['book-detail', isbn], (oldData: unknown) => {
          return updateBookRating(oldData as BookWithRating, data);
        });

        // user-book-rating 캐시 직접 업데이트
        if (book?.id) {
          queryClient.setQueryData(['user-book-rating', book.id], data);
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
                    return {
                      ...review,
                      userRating: {
                        bookId: book.id,
                        rating: data.rating,
                        comment: data.comment || '',
                      },
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
