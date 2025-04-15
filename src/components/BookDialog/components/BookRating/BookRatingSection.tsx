import { AuthDialog } from '@/components/Auth/AuthDialog';
import { ReviewDialog } from '@/components/ReviewDialog/ReviewDialog';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { PenLine, Star } from 'lucide-react';
import { Suspense, useState } from 'react';
import { useBookDetails, useReviewDialog } from '../../hooks';
import { RatingStars, RatingStarsFallback } from './BookRatingStars';

export function BookRatingSection() {
  const { book } = useBookDetails();
  const { userRating } = useBookDetails();
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
