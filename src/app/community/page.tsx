'use client';

import { ReviewType } from '@/apis/review/types';
import {
  communitySortOptionAtom,
  communityTypeFilterAtom,
} from '@/atoms/community';
import { LoadingSpinner } from '@/components';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAtom } from 'jotai';
import { Suspense } from 'react';
import { CreateReviewCard, FilterBar, ReviewCard } from './components';
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

// 커뮤니티 게시물 컴포넌트 (Suspense로 감싸기 위해 분리)
function ReviewsList() {
  const { reviews, totalPages, currentPage, sortOption, setCurrentPage } =
    useCommunityReviews();

  // 현재 사용자 가져오기 (없으면 기본값 사용)
  const user = useCurrentUser();
  const currentUser = user
    ? {
        id: user.id,
        username: user.username || 'guest',
        name: user.username || '게스트',
        avatar: `https://i.pravatar.cc/150?u=${user.id || 'guest'}`,
      }
    : {
        id: 0,
        username: 'guest',
        name: '게스트',
        avatar: 'https://i.pravatar.cc/150?u=guest',
      };

  if (reviews.length === 0) {
    return <EmptyState selectedSort={sortOption} />;
  }

  return (
    <>
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} currentUser={currentUser} />
      ))}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            이전
          </Button>
          <span className="flex h-9 items-center px-2">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </>
  );
}

// 커뮤니티 메인 컨텐츠 컴포넌트
function CommunityContent() {
  // 필터 상태 atom 직접 사용
  const [typeFilter, setTypeFilter] = useAtom(communityTypeFilterAtom);
  const [sortOption, setSortOption] = useAtom(communitySortOptionAtom);

  // 현재 사용자 가져오기 (CreateReviewCard 위해 필요)
  const user = useCurrentUser();
  const currentUser = user
    ? {
        id: user.id,
        username: user.username || 'guest',
        name: user.username || '게스트',
        avatar: `https://i.pravatar.cc/150?u=${user.id || 'guest'}`,
      }
    : {
        id: 0,
        username: 'guest',
        name: '게스트',
        avatar: 'https://i.pravatar.cc/150?u=guest',
      };

  // 필터 변경 핸들러
  const handleTypeFilterChange = (type: ReviewType | 'all') => {
    setTypeFilter(type);
  };

  const handleSortOptionChange = (sort: 'popular' | 'latest' | 'following') => {
    setSortOption(sort);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pt-2 pb-3">
      {/* 필터 바 */}
      <FilterBar
        selectedCategory={typeFilter}
        selectedSort={sortOption}
        onCategoryClick={handleTypeFilterChange}
        onSortClick={handleSortOptionChange}
      />

      {/* 메인 콘텐츠 */}
      <div className="pt-2">
        {/* 포스트 작성 */}
        <CreateReviewCard user={currentUser} />

        {/* 포스트 목록 - Suspense로 감싸서 필터가 변경되어도 페이지는 유지 */}
        <Suspense fallback={<ReviewsLoading />}>
          <ReviewsList />
        </Suspense>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <div className="bg-white pb-8">
      <CommunityContent />
    </div>
  );
}
