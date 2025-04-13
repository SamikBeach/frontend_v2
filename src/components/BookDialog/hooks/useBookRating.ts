import { useCallback, useState } from 'react';

export function useBookRating(initialRating = 0) {
  const [userRating, setUserRating] = useState(initialRating);
  const [isRatingHovered, setIsRatingHovered] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewRating, setReviewRating] = useState(initialRating);

  // 별점 추가 핸들러
  const handleRatingClick = useCallback((rating: number) => {
    setUserRating(rating);
    // 리뷰 별점도 함께 업데이트
    setReviewRating(rating);
    // TODO: API 호출로 별점 저장
    console.log(`별점 추가: ${rating}점`);
  }, []);

  // 별점 호버 핸들러
  const handleRatingHover = useCallback((rating: number) => {
    setHoveredRating(rating);
    setIsRatingHovered(true);
  }, []);

  // 별점 호버 아웃 핸들러
  const handleRatingLeave = useCallback(() => {
    setIsRatingHovered(false);
  }, []);

  return {
    userRating,
    setUserRating,
    isRatingHovered,
    hoveredRating,
    reviewRating,
    setReviewRating,
    handleRatingClick,
    handleRatingHover,
    handleRatingLeave,
  };
}
