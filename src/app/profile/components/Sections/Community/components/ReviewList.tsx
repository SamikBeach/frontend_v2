import { ReviewResponseDto, ReviewType } from '@/apis/review/types';
import { ReviewCard } from '@/components/ReviewCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useUserReviewsInfinite } from '../../Reviews/hooks';
import { allReviewTypes } from '../constants';
import { EmptyState } from './EmptyState';

interface ReviewListProps {
  selectedType: ReviewType | undefined;
}

/**
 * 선택된 타입에 따라 리뷰 목록을 표시하는 컴포넌트
 */
export function ReviewList({ selectedType }: ReviewListProps) {
  const pageSize = 6;

  // 선택된 타입에 따라 API 호출에 전달할 타입 배열 생성
  const reviewTypes = selectedType ? [selectedType] : allReviewTypes;

  // 선택된 타입에 따라 리뷰 가져오기
  const { reviews, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserReviewsInfinite(pageSize, reviewTypes);

  if (reviews.length === 0) {
    return <EmptyState type={selectedType} />;
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
      className="md:mt-8"
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
