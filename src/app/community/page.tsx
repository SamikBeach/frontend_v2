'use client';

import { ReviewType } from '@/apis/review/types';
import {
  communitySortOptionAtom,
  communityTypeFilterAtom,
} from '@/atoms/community';
import { ReviewCard } from '@/components/ReviewCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CreateReviewCard, FilterArea } from './components';
import { useCommunityReviews } from './hooks';

// 로딩 상태 컴포넌트
function ReviewsLoading() {
  return (
    <div className="flex h-[calc(100vh-250px)] w-full items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

// 게시물 없음 상태 컴포넌트
function EmptyState({ selectedSort }: { selectedSort: string }) {
  return (
    <div className="mt-12 flex flex-col items-center justify-center rounded-lg bg-gray-50 py-16 text-center">
      <div className="text-3xl">📝</div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        게시물이 없습니다
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        {selectedSort === 'following'
          ? '팔로우하는 사용자의 게시물이 없습니다.'
          : selectedSort === 'popular'
            ? '인기 게시물이 없습니다.'
            : '최신 게시물이 없습니다.'}
      </p>
    </div>
  );
}

// 커뮤니티 게시물 컴포넌트
function ReviewsList() {
  // 무한 스크롤 훅 사용
  const {
    reviews,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sortOption,
  } = useCommunityReviews(10);

  if (isLoading) {
    return <ReviewsLoading />;
  }

  if (reviews.length === 0) {
    return <EmptyState selectedSort={sortOption} />;
  }

  const handleLoadMore = () => {
    if (fetchNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <InfiniteScroll
      dataLength={reviews.length}
      next={handleLoadMore}
      hasMore={!!hasNextPage}
      loader={
        <div className="mt-6 flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      }
      scrollThreshold={0.9}
      className="space-y-4"
      style={{ overflow: 'visible' }} // 스크롤바 숨기기
    >
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </InfiniteScroll>
  );
}

// 커뮤니티 메인 컨텐츠 컴포넌트
function CommunityContent() {
  // 필터 상태 atom 직접 사용
  const [typeFilter, setTypeFilter] = useAtom(communityTypeFilterAtom);
  const [sortOption, setSortOption] = useAtom(communitySortOptionAtom);

  // 현재 사용자 가져오기 (CreateReviewCard 위해 필요)
  const user = useCurrentUser();
  const currentUser = user;

  const isMobile = useIsMobile();

  // 필터 변경 핸들러
  const handleTypeFilterChange = (type: ReviewType | 'all') => {
    setTypeFilter(type);
  };

  const handleSortOptionChange = (sort: 'popular' | 'latest' | 'following') => {
    setSortOption(sort);
  };

  return (
    <div className="pb-3">
      {/* 필터 바 - 스크롤 시 상단에 고정 */}
      <div
        className={`${!isMobile ? 'sticky top-[56px] z-30' : ''} bg-white pt-2 pb-1 md:pt-4 md:pb-2`}
      >
        <FilterArea
          selectedCategory={typeFilter}
          selectedSort={sortOption}
          onCategoryClick={handleTypeFilterChange}
          onSortClick={handleSortOptionChange}
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="pt-2">
        {/* 포스트 작성 */}
        {currentUser && <CreateReviewCard user={currentUser} />}

        {/* 포스트 목록 - 바로 사용 */}
        <ReviewsList />
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <div className={cn('mx-auto max-w-2xl bg-white pb-8')}>
      <CommunityContent />
    </div>
  );
}
