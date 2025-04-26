import { ReviewResponseDto } from '@/apis/review/types';
import { useUserReviews } from '@/app/profile/hooks';
import { ReviewCard } from '@/components/ReviewCard';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useState } from 'react';
import { ReviewsSkeleton } from './ReviewsSkeleton';

export default function Reviews() {
  const [page, setPage] = useState(1);
  const { reviews, isLoading, totalPages } = useUserReviews(page);
  const currentUser = useCurrentUser();

  // 현재 사용자 정보로 기본값 설정
  const userProfile = currentUser
    ? {
        id: currentUser.id,
        username: currentUser.username || 'guest',
        name: currentUser.username || '게스트',
        avatar: `https://i.pravatar.cc/150?u=${currentUser.id || 'guest'}`,
      }
    : {
        id: 0,
        username: 'guest',
        name: '게스트',
        avatar: 'https://i.pravatar.cc/150?u=guest',
      };

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  if (reviews.length === 0) {
    return (
      <div className="mt-8 flex items-center justify-center rounded-lg bg-gray-50 py-16">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            작성한 리뷰가 없습니다
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            아직 작성한 리뷰가 없습니다. 책을 읽고 리뷰를 작성해보세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {reviews.map((review: ReviewResponseDto) => (
        <ReviewCard key={review.id} review={review} currentUser={userProfile} />
      ))}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            이전
          </Button>
          <span className="flex h-9 items-center px-2">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
