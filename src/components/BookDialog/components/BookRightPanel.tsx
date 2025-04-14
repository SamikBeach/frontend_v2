import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BookLibraries } from '../BookLibraries';
import { BookQuotes } from '../BookQuotes';
import { BookReviews } from '../BookReviews';
import { useBookDetails, useBookReviews } from '../hooks';

// 리뷰 제목 컴포넌트
function ReviewTitle() {
  const { meta } = useBookReviews();
  const reviewCount = meta?.total || 0;

  return (
    <p className="text-sm font-medium text-gray-900">
      리뷰 <span className="text-gray-700">({reviewCount})</span>
    </p>
  );
}

// 리뷰 제목 로딩 컴포넌트
function ReviewTitleLoading() {
  return <div className="h-5 w-28 animate-pulse rounded bg-gray-200"></div>;
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

export function BookRightPanel() {
  const { book } = useBookDetails();

  if (!book) return null;

  return (
    <div className="space-y-7">
      {/* 리뷰 섹션 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<ReviewTitleLoading />}>
              <ReviewTitle />
            </Suspense>
          </ErrorBoundary>
        </div>

        <BookReviews />
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
