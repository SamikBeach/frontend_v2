import { ReviewCard } from '@/components/ReviewCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useUserRatingsInfinite } from '../hooks';
import { EmptyRatingState } from '../states/EmptyStates';

export function RatingList() {
  const pageSize = 6;

  // 별점 목록 가져오기
  const { ratings, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserRatingsInfinite(pageSize);

  if (ratings.length === 0) {
    return <EmptyRatingState />;
  }

  return (
    <InfiniteScroll
      dataLength={ratings.length}
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
        {ratings.map(rating => (
          <ReviewCard
            key={`rating-${rating.id}`}
            review={{
              id: rating.id,
              content: rating.comment || '',
              type: 'review', // 리뷰 타입 유지
              createdAt: rating.createdAt,
              updatedAt: rating.updatedAt,
              author: rating.user,
              books: rating.book ? [rating.book] : [],
              userRating: {
                bookId: rating.bookId,
                rating: rating.rating,
                comment: rating.comment,
              },
              likeCount: 0,
              commentCount: 0,
              isLiked: false,
              images: [],
              activityType: 'rating', // 별점 활동 타입 추가
            }}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
}
