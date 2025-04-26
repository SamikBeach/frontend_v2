import { ReviewResponseDto } from '@/apis/review/types';
import { useUserReviewsInfinite } from '@/app/profile/hooks';
import { ReviewCard } from '@/components/ReviewCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CommunitySkeleton } from './CommunitySkeleton';

export default function Community() {
  const pageSize = 6;

  // 모든 리뷰를 가져온 후 프론트에서 'review' 타입이 아닌 것만 필터링
  const {
    reviews: allReviews,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useUserReviewsInfinite(pageSize, 'all');

  // 'review' 타입이 아닌 리뷰만 필터링
  const communityReviews = allReviews.filter(
    review => review.type !== 'review'
  );

  if (isLoading) {
    return <CommunitySkeleton />;
  }

  if (communityReviews.length === 0) {
    return (
      <div className="mt-8 flex items-center justify-center rounded-lg bg-gray-50 py-16">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            커뮤니티 활동이 없습니다
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            아직 커뮤니티 활동이 없습니다. 다양한 주제로 게시물을 작성해보세요.
          </p>
        </div>
      </div>
    );
  }

  // 필요한 InfiniteScroll props 함수 정의
  const handleFetchNextPage = () => {
    if (fetchNextPage) {
      fetchNextPage();
    }
  };

  return (
    <InfiniteScroll
      dataLength={communityReviews.length}
      next={handleFetchNextPage}
      hasMore={hasNextPage ?? false}
      loader={
        <div className="mt-6 flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      }
      scrollThreshold={0.9}
      className="mt-8"
      style={{ overflow: 'visible' }} // 스크롤바 숨기기
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {communityReviews.map((review: ReviewResponseDto) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
