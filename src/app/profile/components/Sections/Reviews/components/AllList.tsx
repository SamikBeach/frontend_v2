import { useUserActivityInfinite } from '@/app/profile/hooks';
import { ReviewCard } from '@/components/ReviewCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EmptyAllState } from '../states/EmptyStates';

export function AllList() {
  const pageSize = 6;

  // 통합된 활동 피드 사용 (API에서 리뷰와 별점을 함께 제공)
  const { activities, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserActivityInfinite(pageSize);

  if (activities.length === 0) {
    return <EmptyAllState />;
  }

  return (
    <InfiniteScroll
      dataLength={activities.length}
      next={fetchNextPage}
      hasMore={hasNextPage ?? false}
      loader={
        isFetchingNextPage && (
          <div className="mt-6 flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )
      }
      scrollThreshold={0.9}
      className="mt-8"
      style={{ overflow: 'visible' }} // 스크롤바 숨기기
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {activities.map(item => {
          // 활동 타입에 따라 ReviewCard에 맞는 형태로 표시
          const activityType = item.activityType || 'review';

          // 리뷰 타입인 경우
          if (activityType === 'review') {
            return <ReviewCard key={`review-${item.id}`} review={item} />;
          }

          // 별점 타입인 경우
          return (
            <ReviewCard
              key={`rating-${item.id}`}
              review={{
                id: item.id,
                content: item.comment || '',
                type: 'review', // 리뷰 타입 유지
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                author: item.user,
                books: item.book ? [item.book] : [],
                userRating: {
                  bookId: item.bookId,
                  rating: item.rating,
                  comment: item.comment,
                },
                likeCount: 0,
                commentCount: 0,
                isLiked: false,
                images: [],
                activityType: 'rating', // 별점 활동 타입 추가
              }}
            />
          );
        })}
      </div>
    </InfiniteScroll>
  );
}
