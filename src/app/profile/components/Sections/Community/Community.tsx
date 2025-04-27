import { ReviewResponseDto, ReviewType } from '@/apis/review/types';
import { UserReviewTypeCountsDto } from '@/apis/user/types';
import { getUserReviewTypeCounts } from '@/apis/user/user';
import { useUserReviewsInfinite } from '@/app/profile/hooks';
import { ReviewCard } from '@/components/ReviewCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CommunityContentSkeleton } from './CommunitySkeleton';

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

// 빈 상태 컴포넌트 - 선택된 타입별로 다른 메시지 표시
function EmptyState({ type }: { type: ReviewType | undefined }) {
  // 타입별 메시지 설정
  let title = '커뮤니티 활동이 없습니다';
  let description =
    '아직 커뮤니티 활동이 없습니다. 독서방에 참여하고 다양한 활동을 해보세요.';

  if (type === 'general') {
    title = '일반 게시글이 없습니다';
    description =
      '아직 일반 게시글이 없습니다. 독서 경험이나 생각을 자유롭게 공유해보세요.';
  } else if (type === 'discussion') {
    title = '토론 게시글이 없습니다';
    description =
      '아직 토론 게시글이 없습니다. 책에 대한 다양한 토론 주제를 공유하고 의견을 나눠보세요.';
  } else if (type === 'question') {
    title = '질문 게시글이 없습니다';
    description =
      '아직 질문 게시글이 없습니다. 책에 대한 궁금한 점을 질문하고 다른 독자들의 답변을 들어보세요.';
  } else if (type === 'meetup') {
    title = '모임 게시글이 없습니다';
    description =
      '아직 모임 게시글이 없습니다. 함께 책을 읽고 이야기 나눌 모임을 만들어보세요.';
  }

  return (
    <div className="mt-8 flex items-center justify-center rounded-lg bg-gray-50 py-16">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

// 리뷰 목록 컴포넌트 - 컨텐츠만 담당
function ReviewList({
  selectedType,
}: {
  selectedType: ReviewType | undefined;
}) {
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
  counts: UserReviewTypeCountsDto;
  selectedType: ReviewType | undefined;
  onSelectType: (type: ReviewType | undefined) => void;
}) {
  const isSelected = selectedType === filter.type;

  // 필터 타입의 키 (all 또는 타입 이름)
  const filterKey = filter.id === 'all' ? 'total' : filter.id;

  // 해당 타입의 카운트 계산 (all인 경우 total에서 review 타입 제외)
  let count = 0;
  if (filter.id === 'all') {
    // 전체 카운트 = 총합에서 review 타입 제외
    count = (counts.total || 0) - (counts.review || 0);
  } else {
    // 개별 타입 카운트
    count = counts[filterKey as keyof UserReviewTypeCountsDto] || 0;
  }

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
}: {
  counts: UserReviewTypeCountsDto;
  selectedType: ReviewType | undefined;
  onSelectType: (type: ReviewType | undefined) => void;
}) {
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

// 타입 카운트 로더 컴포넌트
function TypeCountsLoader() {
  const params = useParams();
  const userId = Number(params.id);

  // 리뷰 타입별 카운트 직접 쿼리
  const { data: typeCounts } = useSuspenseQuery<UserReviewTypeCountsDto>({
    queryKey: ['user-review-type-counts', userId],
    queryFn: () => getUserReviewTypeCounts(userId),
  });

  return typeCounts;
}

// 메인 컴포넌트
export default function Community() {
  return <FilterAndContentLoader />;
}

// 필터와 콘텐츠를 함께 로드하는 컴포넌트
function FilterAndContentLoader() {
  const [selectedType, setSelectedType] = useState<ReviewType | undefined>(
    undefined
  );

  // 타입 카운트 로드
  const typeCounts = TypeCountsLoader();

  return (
    <div>
      {/* 필터 메뉴 */}
      <FilterMenu
        counts={typeCounts}
        selectedType={selectedType}
        onSelectType={setSelectedType}
      />

      {/* 리뷰 리스트 영역 - 메뉴 선택에 따라 이 부분만 다시 로드됨 */}
      <Suspense fallback={<CommunityContentSkeleton />}>
        <ReviewList selectedType={selectedType} />
      </Suspense>
    </div>
  );
}
