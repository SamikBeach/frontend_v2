import { LibrarySortOption } from '@/apis/library/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LibrarySortDropdown } from '../BookLibraries';
import { ReviewSortDropdown } from '../BookReviews';

// 탭 타입 정의
export type TabType = 'reviews' | 'libraries' | 'videos';

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
    <div className={cn('space-y-2 md:space-y-0', className)}>
      {/* 탭 영역 */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="no-scrollbar flex w-full overflow-x-auto pb-1 md:pb-2">
          <button
            className={cn(
              'cursor-pointer pb-2 text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === 'reviews'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
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
                : 'text-gray-500 hover:text-gray-700'
            )}
            onClick={() => onTabChange('libraries')}
          >
            이 책이 등록된 서재{' '}
            {libraryCount !== undefined && `(${libraryCount})`}
          </button>
          <button
            className={cn(
              'ml-6 cursor-pointer pb-2 text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === 'videos'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            )}
            onClick={() => onTabChange('videos')}
          >
            관련 영상
          </button>
        </div>

        {/* 데스크톱에서만 정렬 필터 표시 */}
        {!isMobile && (
          <div className="ml-4 flex flex-shrink-0">
            {activeTab === 'reviews' && (
              <ErrorBoundary FallbackComponent={() => null}>
                <Suspense
                  fallback={
                    <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200"></div>
                  }
                >
                  <ReviewSortDropdown />
                </Suspense>
              </ErrorBoundary>
            )}

            {activeTab === 'libraries' && onLibrarySortChange && (
              <LibrarySortDropdown
                onChange={onLibrarySortChange}
                value={librarySortValue}
              />
            )}
          </div>
        )}
      </div>

      {/* 모바일에서만 정렬 필터 표시 */}
      {isMobile && (
        <div className="flex justify-end">
          {activeTab === 'reviews' && (
            <ErrorBoundary FallbackComponent={() => null}>
              <Suspense
                fallback={
                  <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200"></div>
                }
              >
                <ReviewSortDropdown />
              </Suspense>
            </ErrorBoundary>
          )}

          {activeTab === 'libraries' && onLibrarySortChange && (
            <LibrarySortDropdown
              onChange={onLibrarySortChange}
              value={librarySortValue}
            />
          )}
        </div>
      )}
    </div>
  );
}
