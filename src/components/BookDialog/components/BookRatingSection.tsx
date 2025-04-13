import { Button } from '@/components/ui/button';
import { PenLine, Star } from 'lucide-react';
import { useBookDetails, useBookRating, useReviewDialog } from '../hooks';

export function BookRatingSection() {
  const { book } = useBookDetails();
  const {
    userRating,
    isRatingHovered,
    hoveredRating,
    handleRatingClick,
    handleRatingHover,
    handleRatingLeave,
  } = useBookRating();
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

  // 별점 텍스트 가져오기
  const getRatingText = (rating: number) => {
    if (rating === 0) return '';
    if (rating === 1) return '별로예요';
    if (rating === 2) return '아쉬워요';
    if (rating === 3) return '보통이에요';
    if (rating === 4) return '좋아요';
    return '최고예요';
  };

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
          <div
            className="flex items-center gap-1"
            onMouseLeave={handleRatingLeave}
          >
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`h-6 w-6 cursor-pointer ${
                  (isRatingHovered ? star <= hoveredRating : star <= userRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-200 hover:text-gray-300'
                }`}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleRatingHover(star)}
              />
            ))}
            <span className="ml-2 text-xs text-gray-600">
              {isRatingHovered
                ? getRatingText(hoveredRating)
                : getRatingText(userRating)}
            </span>
          </div>

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
