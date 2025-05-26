import { LibrarySortOption } from '@/apis/library/types';
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
  return (
    <div className={cn('space-y-2 md:space-y-0', className)}>
      {/* 탭 영역 */}
      <div className="relative flex border-b border-gray-200">
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

        {/* 데스크톱 정렬 필터 - 절대 위치 */}
        {activeTab === 'reviews' && (
          <div className="absolute -top-1 right-0 hidden md:block">
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

        {activeTab === 'libraries' && onLibrarySortChange && (
          <div className="absolute -top-1 right-0 hidden md:block">
            <LibrarySortDropdown
              onChange={onLibrarySortChange}
              value={librarySortValue}
            />
          </div>
        )}
      </div>

      {/* 모바일 정렬 필터 영역 */}
      {activeTab === 'reviews' && (
        <div className="flex justify-end md:hidden">
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

      {activeTab === 'libraries' && onLibrarySortChange && (
        <div className="flex justify-end md:hidden">
          <LibrarySortDropdown
            onChange={onLibrarySortChange}
            value={librarySortValue}
          />
        </div>
      )}
    </div>
  );
}
