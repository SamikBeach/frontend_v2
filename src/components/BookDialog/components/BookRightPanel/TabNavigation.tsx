import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ReviewSortDropdown } from '../BookReviews';

// 탭 타입 정의
export type TabType = 'reviews' | 'libraries';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  reviewCount?: number;
  libraryCount?: number;
}

export function TabNavigation({
  activeTab,
  onTabChange,
  reviewCount,
  libraryCount,
}: TabNavigationProps) {
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
