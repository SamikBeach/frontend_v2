import { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BookLibraries } from '../../BookLibraries';
import { BookReviews } from '../../BookReviews';
import { useBookDetails, useBookLibraries } from '../../hooks';
import { SimpleErrorFallback } from '../common/ErrorFallback';
import { LibrariesSkeleton } from '../common/Skeletons';
import { TabNavigation, TabType } from './TabNavigation';

// 리뷰 수 업데이트를 위한 스크립트
const updateReviewCount = (count: number) => {
  const reviewCountElement = document.getElementById('review-count');
  if (reviewCountElement) {
    reviewCountElement.textContent = count > 0 ? `(${count})` : '';
  }
};

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
        <ErrorBoundary FallbackComponent={SimpleErrorFallback}>
          <Suspense fallback={<LibrariesSkeleton />}>
            <BookLibraries />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
