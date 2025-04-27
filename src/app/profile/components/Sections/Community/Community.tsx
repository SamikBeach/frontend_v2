import { ReviewResponseDto, ReviewType } from '@/apis/review/types';
import { UserReviewTypeCountsDto } from '@/apis/user/types';
import { getUserReviewTypeCounts } from '@/apis/user/user';
import { useUserProfile, useUserReviewsInfinite } from '@/app/profile/hooks';
import { ReviewCard } from '@/components/ReviewCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CommunitySkeleton } from './CommunitySkeleton';

// 리뷰 타입 필터 정의 (review 타입 제외)
const reviewTypeFilters = [
  { id: 'all', name: '전체', type: undefined },
  { id: 'general', name: '일반', type: 'general' as ReviewType },
  { id: 'discussion', name: '토론', type: 'discussion' as ReviewType },
  { id: 'question', name: '질문', type: 'question' as ReviewType },
  { id: 'meetup', name: '모임', type: 'meetup' as ReviewType },
];

// 전체 리뷰 타입 배열
const allReviewTypes = [
  'general',
  'discussion',
  'question',
  'meetup',
] as ReviewType[];

// 필터 메뉴 스켈레톤 컴포넌트
function FilterMenuSkeleton() {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-32 rounded-full" />
      ))}
    </div>
  );
}

// 리뷰 목록 컴포넌트 - 컨텐츠만 담당
function ReviewList({
  selectedType,
}: {
  selectedType: ReviewType | undefined;
}) {
  const params = useParams();
  const pageSize = 6;

  // 선택된 타입에 따라 API 호출에 전달할 타입 배열 생성
  const reviewTypes = selectedType ? [selectedType] : allReviewTypes;

  // 선택된 타입에 따라 리뷰 가져오기
  const { reviews, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserReviewsInfinite(pageSize, reviewTypes);

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

// 메뉴 항목 컴포넌트
function MenuItem({
  filter,
  counts,
  selectedType,
  onSelectType,
}: {
  filter: (typeof reviewTypeFilters)[0];
  counts: Record<string, number>;
  selectedType: ReviewType | undefined;
  onSelectType: (type: ReviewType | undefined) => void;
}) {
  const isSelected = selectedType === filter.type;

  // 필터 타입의 키 (all 또는 타입 이름)
  const filterKey = filter.id === 'all' ? 'total' : filter.id;

  // 해당 타입의 카운트 (없으면 0)
  const count = counts[filterKey] || 0;

  return (
    <button
      className={cn(
        'flex h-8 cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium transition-all',
        isSelected
          ? 'border-blue-200 bg-blue-50 text-blue-600'
          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
      )}
      onClick={() => onSelectType(filter.type)}
    >
      <span>{filter.name}</span>
      <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1 text-[11px] text-gray-600">
        {count}
      </span>
    </button>
  );
}

// 필터 메뉴 컴포넌트
function FilterMenu({
  counts,
  selectedType,
  onSelectType,
  isLoading,
}: {
  counts: Record<string, number>;
  selectedType: ReviewType | undefined;
  onSelectType: (type: ReviewType | undefined) => void;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <FilterMenuSkeleton />;
  }

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {reviewTypeFilters.map(filter => (
        <MenuItem
          key={filter.id}
          filter={filter}
          counts={counts}
          selectedType={selectedType}
          onSelectType={onSelectType}
        />
      ))}
    </div>
  );
}

// 메인 컴포넌트
export default function Community() {
  const [selectedType, setSelectedType] = useState<ReviewType | undefined>(
    undefined
  );
  const params = useParams();
  const userId = Number(params.id);
  const { profileData } = useUserProfile(userId);

  // 리뷰 타입별 카운트 직접 쿼리
  const { data: typeCounts, isLoading } =
    useSuspenseQuery<UserReviewTypeCountsDto>({
      queryKey: ['user-review-type-counts', userId],
      queryFn: () => getUserReviewTypeCounts(userId),
    });

  // 쿼리 결과를 필터 컴포넌트에 전달할 형태로 변환
  const countsForFilter: Record<string, number> = typeCounts
    ? {
        general: typeCounts.general,
        discussion: typeCounts.discussion,
        question: typeCounts.question,
        meetup: typeCounts.meetup,
        total: typeCounts.total,
        review: typeCounts.review,
      }
    : {};

  // 커뮤니티 활동 총 개수 (토론, 일반, 질문, 모임 리뷰의 합)
  const communityTotal =
    profileData.reviewCount.general +
    profileData.reviewCount.discussion +
    profileData.reviewCount.question +
    profileData.reviewCount.meetup;

  return (
    <div>
      {/* 헤더 영역 */}
      <div className="mt-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          커뮤니티 활동 ({communityTotal})
        </h2>
      </div>

      {/* 필터 메뉴 영역 */}
      <FilterMenu
        counts={countsForFilter}
        selectedType={selectedType}
        onSelectType={setSelectedType}
        isLoading={isLoading}
      />

      {/* 리뷰 리스트 영역 - 메뉴 선택에 따라 이 부분만 다시 로드됨 */}
      <Suspense fallback={<CommunitySkeleton />}>
        <ReviewList selectedType={selectedType} />
      </Suspense>
    </div>
  );
}
