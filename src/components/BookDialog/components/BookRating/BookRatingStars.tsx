import { AuthDialog } from '@/components/Auth/AuthDialog';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { Star, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useBookRating } from '../../hooks';

// 별점을 표시하는 컴포넌트
export function RatingStars() {
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
      // 로그인 상태에서만 별점 상태 업데이트
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

  // x버튼 호버 시 별점 호버 상태 해제
  const handleXButtonHover = useCallback(() => {
    handleRatingLeave();
  }, [handleRatingLeave]);

  return (
    <>
      <div className="text-muted-foreground flex items-center gap-1">
        <div
          className="flex items-center gap-1"
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
        {userRating > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-7 w-7 cursor-pointer rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            onClick={handleRemoveRating}
            onMouseEnter={handleXButtonHover}
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
export function RatingStarsFallback() {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} className="h-6 w-6 text-gray-200" />
      ))}
      <span className="ml-2 text-xs text-gray-400">로딩 중...</span>
    </div>
  );
}
