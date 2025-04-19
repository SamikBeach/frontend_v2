import { LibrarySortOption } from '@/apis/library/types';
import { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BookReviews } from '../../BookReviews';
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

  // 서재 수 가져오기
  const { meta: libraryMeta } = useBookLibraries(book?.id, 10, librarySort);

  useEffect(() => {
    if (libraryMeta?.total !== undefined) {
      setLibraryCount(libraryMeta.total);
    }
  }, [libraryMeta?.total]);

  if (!book) return null;

  const handleReviewCountChange = (count: number) => {
    setReviewCount(count);
  };

  // 서재 정렬 옵션 변경 핸들러
  const handleLibrarySortChange = (sort: LibrarySortOption) => {
    setLibrarySort(sort);
  };

  return (
    <div className="space-y-4">
      {/* 탭 네비게이션 */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        reviewCount={reviewCount}
        libraryCount={libraryCount}
        onLibrarySortChange={handleLibrarySortChange}
        librarySortValue={librarySort}
      />

      {/* 컨텐츠 영역 */}
      {activeTab === 'reviews' && (
        <BookReviews onReviewCountChange={handleReviewCountChange} />
      )}

      {activeTab === 'libraries' && (
        <ErrorBoundary FallbackComponent={SimpleErrorFallback}>
          <Suspense fallback={<LibrariesSkeleton />}>
            <BookLibraries sortOption={librarySort} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
