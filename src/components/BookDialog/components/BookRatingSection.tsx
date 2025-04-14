import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PenLine, Star } from 'lucide-react';
import { Suspense, useCallback } from 'react';
import { useBookDetails, useBookRating, useReviewDialog } from '../hooks';

// 별점을 표시하는 컴포넌트
function RatingStars() {
  const {
    userRating,
    isRatingHovered,
    hoveredRating,
    handleRatingClick,
    handleRatingHover,
    handleRatingLeave,
  } = useBookRating();

  // 별 클릭 핸들러
  const handleStarClick = useCallback(
    (star: number) => {
      handleRatingClick(star);
    },
    [handleRatingClick]
  );

  // 별 호버 핸들러
  const handleStarHover = useCallback(
    (star: number) => {
      handleRatingHover(star);
    },
    [handleRatingHover]
  );

  return (
    <div
      className="text-muted-foreground flex items-center gap-1"
      onMouseLeave={handleRatingLeave}
    >
      {Array.from({ length: 5 }, (_, i) => i + 1).map(star => (
        <Star
          key={star}
          className={cn(
            'h-5 w-5 cursor-pointer transition-colors',
            (isRatingHovered ? hoveredRating >= star : userRating >= star)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-none'
          )}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
        />
      ))}
    </div>
  );
}

// Fallback for rating stars while loading
function RatingStarsFallback() {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} className="h-6 w-6 text-gray-200" />
      ))}
      <span className="ml-2 text-xs text-gray-400">로딩 중...</span>
    </div>
  );
}

export function BookRatingSection() {
  const { book } = useBookDetails();
  const { userRating } = useBookRating();
  const { handleOpenReviewDialog } = useReviewDialog();

  if (!book) return null;

  // 별점 출력 포맷팅
  const displayRating = book.rating
    ? typeof book.rating === 'string'
      ? book.rating
      : book.rating.toFixed(1)
    : '0.0';

  // 리뷰 카운트 출력 수정
  const reviewCount = book.reviews
    ? typeof book.reviews === 'number'
      ? book.reviews
      : book.reviews.length || 0
    : 0;

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="text-2xl font-semibold">{displayRating}</span>
          <span className="text-sm text-gray-500">({reviewCount}명)</span>
        </div>
      </div>

      {/* 사용자 별점 선택 UI */}
      <div className="mt-3 border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between">
          <Suspense fallback={<RatingStarsFallback />}>
            <RatingStars />
          </Suspense>

          {/* 리뷰 작성하기 버튼 - 별점 옆으로 이동 */}
          <Button
            className="h-8 rounded-full bg-gray-100 px-3 text-xs text-gray-700 hover:bg-gray-200"
            onClick={() => handleOpenReviewDialog(userRating)}
          >
            <PenLine className="mr-1 h-3 w-3" />
            리뷰 쓰기
          </Button>
        </div>
      </div>
    </div>
  );
}
