import { cn } from '@/lib/utils';
import { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BookLibraries, LibrariesSkeleton } from '../BookLibraries';
import { BookReviews } from '../BookReviews';
import { useBookDetails, useBookLibraries } from '../hooks';
import { ReviewSortDropdown } from './ReviewSortDropdown';

// 탭 타입 정의
type TabType = 'reviews' | 'libraries';

// 에러 컴포넌트
function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="p-4 text-center">
      <p className="text-sm text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다
      </p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 cursor-pointer text-xs text-blue-500 hover:underline"
      >
        다시 시도
      </button>
    </div>
  );
}

// 리뷰 수 업데이트를 위한 스크립트
const updateReviewCount = (count: number) => {
  const reviewCountElement = document.getElementById('review-count');
  if (reviewCountElement) {
    reviewCountElement.textContent = count > 0 ? `(${count})` : '';
  }
};

// 탭 네비게이션 컴포넌트
function TabNavigation({
  activeTab,
  onTabChange,
  reviewCount,
  libraryCount,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  reviewCount?: number;
  libraryCount?: number;
}) {
  return (
    <div className="relative flex items-center justify-between border-b border-gray-200">
      <div className="flex">
        <button
          className={cn(
            'cursor-pointer pb-2 text-sm font-medium transition-colors',
            activeTab === 'reviews'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          )}
          onClick={() => onTabChange('reviews')}
        >
          리뷰{' '}
          {reviewCount !== undefined && reviewCount > 0 && `(${reviewCount})`}
        </button>
        <button
          className={cn(
            'ml-6 cursor-pointer pb-2 text-sm font-medium transition-colors',
            activeTab === 'libraries'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          )}
          onClick={() => onTabChange('libraries')}
        >
          이 책이 등록된 서재{' '}
          {libraryCount !== undefined &&
            libraryCount > 0 &&
            `(${libraryCount})`}
        </button>
      </div>

      {activeTab === 'reviews' && (
        <div className="absolute -top-1 right-0">
          <ErrorBoundary FallbackComponent={() => null}>
            <Suspense
              fallback={
                <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200"></div>
              }
            >
              <ReviewSortDropdown />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}

export function BookRightPanel() {
  const { book } = useBookDetails();
  const [activeTab, setActiveTab] = useState<TabType>('reviews');
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [libraryCount, setLibraryCount] = useState<number>(0);

  // 서재 수 가져오기
  const { meta: libraryMeta } = useBookLibraries(book?.id);

  useEffect(() => {
    if (libraryMeta?.total !== undefined) {
      setLibraryCount(libraryMeta.total);
    }
  }, [libraryMeta?.total]);

  if (!book) return null;

  const handleReviewCountChange = (count: number) => {
    setReviewCount(count);
    updateReviewCount(count);
  };

  return (
    <div className="space-y-4">
      {/* 탭 네비게이션 */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        reviewCount={reviewCount}
        libraryCount={libraryCount}
      />

      {/* 컨텐츠 영역 */}
      {activeTab === 'reviews' && (
        <BookReviews onReviewCountChange={handleReviewCountChange} />
      )}

      {activeTab === 'libraries' && (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LibrariesSkeleton />}>
            <BookLibraries />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
