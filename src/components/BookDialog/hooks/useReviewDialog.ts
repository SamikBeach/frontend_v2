import { useCallback, useState } from 'react';

export function useReviewDialog(initialReviewRating: number = 0) {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(initialReviewRating);

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
    (rating: number, content: string, isbn?: string | null) => {
      if (!isbn) return;

      // 리뷰 제출 로직 구현 (API 호출 등)
      console.log('리뷰 제출:', { rating, content, isbn });
      setReviewDialogOpen(false);

      return rating;
    },
    []
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
