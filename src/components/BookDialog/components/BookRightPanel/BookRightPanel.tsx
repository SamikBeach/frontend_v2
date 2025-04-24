import { LibrarySortOption } from '@/apis/library/types';
import { BookReviews } from '@/components/BookDialog/BookReviews';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useBookDetails, useBookLibraries } from '../../hooks';
import { BookLibraries } from '../BookLibraries/BookLibraries';
import { SimpleErrorFallback } from '../common/ErrorFallback';
import { LibrariesSkeleton } from '../common/Skeletons';
import { TabNavigation, TabType } from './TabNavigation';

export function BookRightPanel() {
  const { book } = useBookDetails();
  const [activeTab, setActiveTab] = useState<TabType>('reviews');
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [libraryCount, setLibraryCount] = useState<number>(0);
  const [librarySort, setLibrarySort] = useState<LibrarySortOption>(
    LibrarySortOption.SUBSCRIBERS
  );
  const isMobile = useIsMobile();

  // 서재 수 가져오기
  const { meta } = useBookLibraries(book?.id, 10, librarySort);

  useEffect(() => {
    if (meta?.total !== undefined) {
      setLibraryCount(meta.total);
    }
  }, [meta?.total]);

  // 리뷰 수 업데이트 콜백
  const handleReviewCountChange = (count: number) => {
    setReviewCount(count);
  };

  // 서재 정렬 변경 핸들러
  const handleLibrarySortChange = (sort: LibrarySortOption) => {
    setLibrarySort(sort);
  };

  if (!book) return null;

  return (
    <div className={cn('relative flex flex-col', isMobile ? 'mt-4 mb-16' : '')}>
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        reviewCount={reviewCount}
        libraryCount={libraryCount}
        onLibrarySortChange={handleLibrarySortChange}
        librarySortValue={librarySort}
        className={isMobile ? 'mb-3' : 'mb-4'}
      />

      <div className={cn('overflow-hidden rounded-lg')}>
        {activeTab === 'reviews' && (
          <ErrorBoundary FallbackComponent={SimpleErrorFallback}>
            <Suspense
              fallback={
                <div className="flex h-16 items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-500"></div>
                </div>
              }
            >
              <BookReviews onReviewCountChange={handleReviewCountChange} />
            </Suspense>
          </ErrorBoundary>
        )}

        {activeTab === 'libraries' && (
          <ErrorBoundary FallbackComponent={SimpleErrorFallback}>
            <Suspense fallback={<LibrariesSkeleton />}>
              <BookLibraries sortOption={librarySort} />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}
