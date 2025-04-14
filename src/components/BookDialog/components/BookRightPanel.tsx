import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BookLibraries } from '../BookLibraries';
import { BookQuotes } from '../BookQuotes';
import { BookReviews } from '../BookReviews';
import { useBookDetails } from '../hooks';
import { ReviewSortDropdown } from './ReviewSortDropdown';

// 리뷰 제목 컴포넌트
function ReviewTitle() {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-sm font-medium text-gray-900">
        리뷰 <span className="text-gray-700" id="review-count"></span>
      </p>

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
  );
}

// 리뷰 제목 로딩 컴포넌트
function ReviewTitleLoading() {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="h-5 w-28 animate-pulse rounded bg-gray-200"></div>
      <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200"></div>
    </div>
  );
}

// 라이브러리 로딩 컴포넌트
function LibrariesLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-48 rounded bg-gray-200"></div>
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 rounded-xl bg-gray-100"></div>
        ))}
      </div>
    </div>
  );
}

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
    reviewCountElement.textContent = `(${count})`;
  }
};

export function BookRightPanel() {
  const { book } = useBookDetails();

  if (!book) return null;

  return (
    <div className="space-y-7">
      {/* 리뷰 섹션 */}
      <div className="space-y-4">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<ReviewTitleLoading />}>
            <ReviewTitle />
          </Suspense>
        </ErrorBoundary>

        <BookReviews onReviewCountChange={updateReviewCount} />
      </div>

      {/* 등록된 서재 섹션 */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LibrariesLoading />}>
          <BookLibraries />
        </Suspense>
      </ErrorBoundary>

      {/* 인상적인 구절 */}
      <BookQuotes />
    </div>
  );
}
