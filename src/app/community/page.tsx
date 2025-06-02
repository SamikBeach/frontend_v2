'use client';

import { ReviewType } from '@/apis/review/types';
import {
  communitySortOptionAtom,
  communityTypeFilterAtom,
} from '@/atoms/community';
import { ReviewCard } from '@/components/ReviewCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useFilterScrollVisibility, useQueryParams } from '@/hooks';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sortOption,
  } = useCommunityReviews(10);

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

// 기본값 상수 정의
const DEFAULT_CATEGORY = 'all';
const DEFAULT_SORT = 'latest';

// 커뮤니티 메인 컨텐츠 컴포넌트
function CommunityContent() {
  const searchParams = useSearchParams();
  const { updateQueryParams } = useQueryParams();

  // 필터 상태 atom 직접 사용
  const [typeFilter, setTypeFilter] = useAtom(communityTypeFilterAtom);
  const [sortOption, setSortOption] = useAtom(communitySortOptionAtom);

  // 필터 스크롤 가시성 훅 추가
  const [showFilter] = useFilterScrollVisibility();

  // URL 파라미터에서 필터 상태 초기화
  useEffect(() => {
    const category = searchParams.get('category') || DEFAULT_CATEGORY;
    const sort = searchParams.get('sort') || DEFAULT_SORT;

    // Atoms 업데이트
    setTypeFilter(category as ReviewType | 'all');
    setSortOption(sort as 'popular' | 'latest' | 'following');

    // 필터나 정렬이 변경되었을 때 스크롤 위치를 맨 위로 이동
    // 초기 로드가 아닌 경우에만 스크롤 이동
    const isInitialLoad = !searchParams.toString();
    if (!isInitialLoad) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [searchParams, setTypeFilter, setSortOption]);

  // 필터 변경 핸들러
  const handleTypeFilterChange = (type: ReviewType | 'all') => {
    setTypeFilter(type);
    updateQueryParams({ category: type === 'all' ? undefined : type });
  };

  const handleSortOptionChange = (sort: 'popular' | 'latest' | 'following') => {
    setSortOption(sort);
    updateQueryParams({ sort: sort === DEFAULT_SORT ? undefined : sort });
  };

  return (
    <div className="pb-3">
      {/* 필터 바 - 모바일에서 스크롤에 따라 보임/숨김 */}
      <div
        className={`bg-white transition-transform duration-300 sm:translate-y-0 md:sticky md:top-[56px] md:z-30 ${
          showFilter ? 'translate-y-0' : '-translate-y-[150%]'
        } fixed top-[56px] right-0 left-0 z-20 pt-2 pb-1 sm:relative sm:top-0 md:pt-4 md:pb-2`}
      >
        <FilterArea
          selectedCategory={typeFilter}
          selectedSort={sortOption}
          onCategoryClick={handleTypeFilterChange}
          onSortClick={handleSortOptionChange}
        />
      </div>

      {/* 메인 콘텐츠 - 모바일에서 필터 높이만큼 상단 여백 추가 */}
      <div className="px-2 pt-[110px] sm:px-0 sm:pt-1">
        {/* 포스트 작성 */}
        <CreateReviewCard />

        {/* 포스트 목록 - Suspense로 감싸기 */}
        <Suspense fallback={<ReviewsLoading />}>
          <ReviewsList />
        </Suspense>
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
