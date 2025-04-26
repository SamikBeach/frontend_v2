import { LibrarySortOption } from '@/apis/library/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LibrarySortDropdown } from '../BookLibraries';
import { ReviewSortDropdown } from '../BookReviews';

// 탭 타입 정의
export type TabType = 'reviews' | 'libraries';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  reviewCount?: number;
  libraryCount?: number;
  onLibrarySortChange?: (sort: LibrarySortOption) => void;
  librarySortValue?: LibrarySortOption;
  className?: string;
}

export function TabNavigation({
  activeTab,
  onTabChange,
  reviewCount,
  libraryCount,
  onLibrarySortChange,
  librarySortValue = LibrarySortOption.RECENT,
  className,
}: TabNavigationProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        'relative flex items-center justify-between border-b border-gray-200',
        className
      )}
    >
      <div
        className={cn(
          'flex',
          isMobile ? 'no-scrollbar w-full overflow-x-auto pb-1' : ''
        )}
      >
        <button
          className={cn(
            'cursor-pointer pb-2 text-sm font-medium whitespace-nowrap transition-colors',
            activeTab === 'reviews'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-500 hover:text-gray-700',
            isMobile && 'text-sm'
          )}
          onClick={() => onTabChange('reviews')}
        >
          리뷰 {reviewCount !== undefined && `(${reviewCount})`}
        </button>
        <button
          className={cn(
            'ml-6 cursor-pointer pb-2 text-sm font-medium whitespace-nowrap transition-colors',
            activeTab === 'libraries'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-500 hover:text-gray-700',
            isMobile && 'text-sm'
          )}
          onClick={() => onTabChange('libraries')}
        >
          이 책이 등록된 서재{' '}
          {libraryCount !== undefined && `(${libraryCount})`}
        </button>
      </div>

      {activeTab === 'reviews' && !isMobile && (
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

      {activeTab === 'libraries' && onLibrarySortChange && !isMobile && (
        <div className="absolute -top-1 right-0">
          <LibrarySortDropdown
            onChange={onLibrarySortChange}
            value={librarySortValue}
          />
        </div>
      )}
    </div>
  );
}
