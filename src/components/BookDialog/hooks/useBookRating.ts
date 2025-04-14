import {
  RatingDto,
  RatingResponseDto,
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
  const { book, userRating: initialUserRating } = useBookDetails();

  // 별점 상태 관리 - book.userRating에서 초기화
  const [userRatingData, setUserRatingData] =
    useState<RatingResponseDto | null>(book?.userRating || null);
  const [userRating, setUserRating] = useState<number>(
    book?.userRating?.rating || 0
  );
  const [isRatingHovered, setIsRatingHovered] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [rating, setRating] = useState<number>(book?.userRating?.rating || 0);
  const [comment, setComment] = useState<string>(
    book?.userRating?.comment || ''
  );

  // 별점 추가 뮤테이션
  const { mutate: addRating, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      bookId,
      ratingData,
    }: {
      bookId: number;
      ratingData: RatingDto;
    }) => {
      return createOrUpdateRating(bookId, ratingData);
    },
    onSuccess: data => {
      // 로컬 상태 업데이트
      setUserRatingData(data);
      setUserRating(data.rating);

      // 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['book-detail'] });
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
    onSuccess: data => {
      // 로컬 상태 업데이트
      setUserRatingData(data);
      setUserRating(data.rating);

      queryClient.invalidateQueries({ queryKey: ['book-detail'] });
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
      // 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['book-detail'] });

      // 상태 초기화
      setUserRatingData(null);
      setRating(0);
      setUserRating(0);
      setComment('');

      toast.success('평점이 삭제되었습니다.');
    },
    onError: () => {
      toast.error('평점 삭제에 실패했습니다.');
    },
  });

  // 별점 추가 핸들러
  const handleRatingClick = useCallback(
    (rating: number) => {
      setUserRating(rating);
      setRating(rating);

      if (!book?.id) return;

      // API 호출로 별점 저장
      addRating({
        bookId: book.id,
        ratingData: { rating },
      });
    },
    [addRating, book]
  );

  // 별점 호버 핸들러
  const handleRatingHover = useCallback((rating: number) => {
    setHoveredRating(rating);
    setIsRatingHovered(true);
  }, []);

  // 별점 호버 아웃 핸들러
  const handleRatingLeave = useCallback(() => {
    setIsRatingHovered(false);
  }, []);

  // 평점 제출 핸들러 (리뷰 다이얼로그에서 사용)
  const handleSubmitRating = useCallback(() => {
    if (!book?.id) return;

    if (rating === 0) {
      toast.error('별점을 선택해주세요.');
      return;
    }

    const ratingData: RatingDto = {
      rating,
      comment,
    };

    addRating({
      bookId: book.id,
      ratingData,
    });
  }, [book, rating, comment, addRating]);

  return {
    userRating,
    userRatingData,
    setUserRating,
    isRatingHovered,
    hoveredRating,
    rating,
    setRating,
    comment,
    setComment,
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
