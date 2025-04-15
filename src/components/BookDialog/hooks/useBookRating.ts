import {
  RatingDto,
  UpdateRatingDto,
  createOrUpdateRating,
  deleteRating,
  updateRating as updateRatingApi,
} from '@/apis/rating';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useBookDetails } from './useBookDetails';

// 별점 호버 및 표시를 위한 UI 관련 상태와 핸들러를 관리하는 훅
export function useBookRating() {
  const queryClient = useQueryClient();
  const { book, isbn, userRating: userRatingData } = useBookDetails();

  // UI 관련 상태만 로컬로 유지 (호버 효과 등)
  const [isRatingHovered, setIsRatingHovered] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  // 서버에서 가져온 userRating 사용
  const userRating = userRatingData?.rating || 0;
  const comment = userRatingData?.comment || '';

  // 별점 추가 뮤테이션
  const { mutate: addRating, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      bookId,
      ratingData,
    }: {
      bookId: number;
      ratingData: RatingDto;
    }) => {
      return createOrUpdateRating(
        bookId,
        ratingData,
        bookId < 0 ? isbn : undefined
      );
    },
    onSuccess: newRating => {
      // 캐시 직접 업데이트 - 다시 로드하지 않고 UI만 업데이트
      if (book?.id) {
        // user-book-rating 캐시 업데이트
        queryClient.setQueryData(['user-book-rating', book.id], newRating);

        // book-detail 캐시 직접 업데이트
        queryClient.setQueryData(['book-detail', isbn], (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            userRating: newRating,
          };
        });
      }

      toast.success('평점이 등록되었습니다.');
    },
    onError: () => {
      toast.error('평점 등록에 실패했습니다.');
    },
  });

  // 평점 수정 뮤테이션
  const { mutate: modifyRating } = useMutation({
    mutationFn: async ({
      ratingId,
      ratingData,
    }: {
      ratingId: number;
      ratingData: UpdateRatingDto;
    }) => {
      return updateRatingApi(ratingId, ratingData);
    },
    onSuccess: updatedRating => {
      // 캐시 직접 업데이트
      if (book?.id) {
        // user-book-rating 캐시 업데이트
        queryClient.setQueryData(['user-book-rating', book.id], updatedRating);

        // book-detail 캐시 직접 업데이트
        queryClient.setQueryData(['book-detail', isbn], (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            userRating: updatedRating,
          };
        });
      }

      toast.success('평점이 수정되었습니다.');
    },
    onError: () => {
      toast.error('평점 수정에 실패했습니다.');
    },
  });

  // 평점 삭제 뮤테이션
  const { mutate: removeRating, isPending: isDeleting } = useMutation({
    mutationFn: async (ratingId: number) => {
      return deleteRating(ratingId);
    },
    onSuccess: () => {
      // 캐시 직접 업데이트
      if (book?.id) {
        // user-book-rating 캐시 업데이트 (null로 설정)
        queryClient.setQueryData(['user-book-rating', book.id], null);

        // book-detail 캐시 직접 업데이트 (userRating을 null로 설정)
        queryClient.setQueryData(['book-detail', isbn], (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            userRating: null,
          };
        });
      }

      toast.success('평점이 삭제되었습니다.');
    },
    onError: () => {
      toast.error('평점 삭제에 실패했습니다.');
    },
  });

  // 별점 추가 핸들러
  const handleRatingClick = useCallback(
    (starRating: number) => {
      if (!book?.id) return;

      // API 호출로 별점 저장
      addRating({
        bookId: book.id,
        ratingData: { rating: starRating },
      });
    },
    [addRating, book]
  );

  // 별점 호버 핸들러
  const handleRatingHover = useCallback((starRating: number) => {
    setHoveredRating(starRating);
    setIsRatingHovered(true);
  }, []);

  // 별점 호버 아웃 핸들러
  const handleRatingLeave = useCallback(() => {
    setIsRatingHovered(false);
  }, []);

  // 평점 제출 핸들러 (리뷰 다이얼로그에서 사용)
  const handleSubmitRating = useCallback(
    (newRating: number, newComment: string = '') => {
      if (!book?.id) return;

      if (newRating === 0) {
        toast.error('별점을 선택해주세요.');
        return;
      }

      const ratingData: RatingDto = {
        rating: newRating,
        comment: newComment,
      };

      addRating({
        bookId: book.id,
        ratingData,
      });
    },
    [book, addRating]
  );

  return {
    userRating,
    userRatingData,
    isRatingHovered,
    hoveredRating,
    comment,
    isUpdating,
    isDeleting,
    handleRatingClick,
    handleRatingHover,
    handleRatingLeave,
    handleSubmitRating,
    removeRating: userRatingData?.id
      ? () => removeRating(userRatingData.id)
      : undefined,
  };
}
