import { ReviewResponseDto, ReviewType } from '@/apis/review/types';
import { useUserReviewsInfinite } from '@/app/profile/hooks';
import { ReviewCard } from '@/components/ReviewCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CommunitySkeleton } from './CommunitySkeleton';

// 'review' 타입을 제외한 커뮤니티 타입들
const COMMUNITY_REVIEW_TYPES: ReviewType[] = [
  'general',
  'discussion',
  'question',
  'meetup',
];

// 커뮤니티 타입 필터 매핑
const communityTypeFilters = [
  { id: 'ALL', name: '전체', type: undefined },
  { id: 'GENERAL', name: '일반', type: 'general' as ReviewType },
  { id: 'DISCUSSION', name: '토론', type: 'discussion' as ReviewType },
  { id: 'QUESTION', name: '질문', type: 'question' as ReviewType },
  { id: 'MEETUP', name: '모임', type: 'meetup' as ReviewType },
];

export default function Community() {
  const params = useParams();
  const pageSize = 6;
  const [selectedType, setSelectedType] = useState<ReviewType | undefined>(
    undefined
  );

  // 선택된 타입에 따라 타입 필터 적용
  const reviewTypes = selectedType ? [selectedType] : COMMUNITY_REVIEW_TYPES;

  // 선택된 타입 또는 'review'를 제외한 모든 타입의 리뷰를 가져오는 hooks 사용
  const {
    reviews,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalReviews,
  } = useUserReviewsInfinite(pageSize, reviewTypes);

  // 각 타입별 리뷰 수를 가져오기 위한 훅 호출
  const { totalReviews: totalAll } = useUserReviewsInfinite(
    1,
    COMMUNITY_REVIEW_TYPES
  );
  const { totalReviews: totalGeneral } = useUserReviewsInfinite(1, ['general']);
  const { totalReviews: totalDiscussion } = useUserReviewsInfinite(1, [
    'discussion',
  ]);
  const { totalReviews: totalQuestion } = useUserReviewsInfinite(1, [
    'question',
  ]);
  const { totalReviews: totalMeetup } = useUserReviewsInfinite(1, ['meetup']);

  // 각 필터에 수량 정보 추가
  const filtersWithCount = [
    { ...communityTypeFilters[0], count: totalAll },
    { ...communityTypeFilters[1], count: totalGeneral },
    { ...communityTypeFilters[2], count: totalDiscussion },
    { ...communityTypeFilters[3], count: totalQuestion },
    { ...communityTypeFilters[4], count: totalMeetup },
  ];

  // 타입 변경 핸들러
  const handleTypeChange = (type: ReviewType | undefined) => {
    setSelectedType(type);
  };

  if (isLoading) {
    return <CommunitySkeleton />;
  }

  if (reviews.length === 0) {
    return (
      <div className="mt-8 flex items-center justify-center rounded-lg bg-gray-50 py-16">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            커뮤니티 활동이 없습니다
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            아직 커뮤니티 활동이 없습니다. 독서방에 참여하고 다양한 활동을
            해보세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 커뮤니티 타입 필터 */}
      <div className="mb-6 flex flex-wrap gap-3">
        {filtersWithCount.map(filter => (
          <button
            key={filter.id}
            className={cn(
              'flex h-8 cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium transition-all',
              selectedType === filter.type
                ? 'border-blue-200 bg-blue-50 text-blue-600'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            )}
            onClick={() => handleTypeChange(filter.type)}
          >
            <span>{filter.name}</span>
            <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1 text-[11px] text-gray-600">
              {filter.count || 0}
            </span>
          </button>
        ))}
      </div>

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
        className="mt-4"
        style={{ overflow: 'visible' }} // 스크롤바 숨기기
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {reviews.map((review: ReviewResponseDto) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
}
