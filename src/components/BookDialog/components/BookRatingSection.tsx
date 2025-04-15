import { AuthDialog } from '@/components/Auth/AuthDialog';
import { ReviewDialog } from '@/components/ReviewDialog/ReviewDialog';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { PenLine, Star, X } from 'lucide-react';
import { Suspense, useCallback, useState } from 'react';
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
    removeRating,
  } = useBookRating();
  const currentUser = useCurrentUser();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // 별 클릭 핸들러 (로그인 체크 추가)
  const handleStarClick = useCallback(
    (star: number) => {
      if (!currentUser) {
        setAuthDialogOpen(true);
        return;
      }
      handleRatingClick(star);
    },
    [currentUser, handleRatingClick]
  );

  // 별 호버 핸들러
  const handleStarHover = useCallback(
    (star: number) => {
      handleRatingHover(star);
    },
    [handleRatingHover]
  );

  // 별점 취소 핸들러
  const handleRemoveRating = useCallback(() => {
    if (removeRating) {
      removeRating();
    }
  }, [removeRating]);

  return (
    <>
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
        {userRating > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-7 w-7 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            onClick={handleRemoveRating}
            title="별점 취소"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* 로그인 다이얼로그 */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
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
  const currentUser = useCurrentUser();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const {
    handleOpenReviewDialog,
    reviewDialogOpen,
    setReviewDialogOpen,
    userRating: dialogUserRating,
    handleReviewSubmit,
    isSubmitting,
    isEditMode,
    initialContent,
  } = useReviewDialog();

  // 리뷰 작성 버튼 클릭 핸들러(로그인 체크 추가)
  const handleReviewButtonClick = () => {
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }
    handleOpenReviewDialog();
  };

  if (!book) return null;

  // 별점 출력 포맷팅
  const displayRating = book.rating
    ? typeof book.rating === 'string'
      ? book.rating
      : book.rating.toFixed(1)
    : '0.0';

  // book 객체의 원시 데이터에 접근 (Book 타입)
  const rawBook = book as any;

  // 별점 참여 인원 수 - totalRatings 사용
  const ratingsCount = rawBook.totalRatings || 0;

  return (
    <>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-semibold">{displayRating}</span>
            <span className="text-sm text-gray-500">({ratingsCount}명)</span>
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
              onClick={handleReviewButtonClick}
            >
              <PenLine className="mr-1 h-3 w-3" />
              리뷰 쓰기
            </Button>
          </div>
        </div>
      </div>
      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        bookTitle={book?.title || ''}
        initialRating={userRating}
        initialContent={initialContent}
        isEditMode={isEditMode}
        onSubmit={handleReviewSubmit}
        isSubmitting={isSubmitting}
      />

      {/* 로그인 다이얼로그 */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
