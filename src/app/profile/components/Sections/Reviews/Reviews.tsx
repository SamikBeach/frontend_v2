import { ReviewResponseDto } from '@/apis/review/types';
import { useUserReviewsInfinite } from '@/app/profile/hooks';
import { ReviewCard } from '@/components/ReviewCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useParams } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';

// 빈 상태 컴포넌트
function EmptyState() {
  return (
    <div className="mt-8 flex items-center justify-center rounded-lg bg-gray-50 py-16">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">
          작성한 책 리뷰가 없습니다
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          아직 작성한 책 리뷰가 없습니다. 책을 읽고 리뷰를 작성해보세요.
        </p>
      </div>
    </div>
  );
}

// 리뷰 목록 컴포넌트
function ReviewList() {
  const params = useParams();
  const userId = Number(params.id);
  const pageSize = 6;

  // 'review' 타입의 리뷰만 가져오는 hooks 사용
  const { reviews, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserReviewsInfinite(pageSize, ['review']);

  if (reviews.length === 0) {
    return <EmptyState />;
  }

  return (
    <InfiniteScroll
      dataLength={reviews.length}
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
        {reviews.map((review: ReviewResponseDto) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </InfiniteScroll>
  );
}

// 메인 컴포넌트
export default function Reviews() {
  return <ReviewList />;
}
