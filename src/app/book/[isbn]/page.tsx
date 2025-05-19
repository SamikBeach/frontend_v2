'use client';

import {
  BookActionButtons,
  BookCoverSection,
  BookRatingSection,
  BookReadingStats,
  BookRightPanel,
} from '@/components/BookDialog/components';
import {
  BookInfo,
  BookInfoSkeleton,
} from '@/components/BookDialog/components/BookInfo';
import {
  BookSkeleton,
  ErrorFallback,
} from '@/components/BookDialog/components/common';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// 반응형 BookPageContent (tailwind만 사용)
function BookPageContent() {
  return (
    <div className="mx-auto w-full p-3 md:p-8">
      <div className="space-y-6 md:grid md:grid-cols-[380px_1fr] md:gap-10 md:space-y-0">
        {/* 왼쪽: 책 표지 및 기본 정보 */}
        <div className="space-y-6">
          <BookCoverSection />
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="h-24 animate-pulse rounded-xl bg-gray-50 p-4"></div>
              }
            >
              <BookRatingSection />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <BookReadingStats />
          </ErrorBoundary>
          <div className="flex flex-col gap-3">
            <BookActionButtons />
          </div>
          <div className="space-y-1">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<BookInfoSkeleton />}>
                <BookInfo />
              </Suspense>
            </ErrorBoundary>
            <p className="mt-2 text-right text-xs text-gray-400">
              정보제공: 알라딘
            </p>
          </div>
        </div>
        {/* 오른쪽: 리뷰 및 관련 정보 */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <BookRightPanel />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <main className="min-h-screen w-full bg-white">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<BookSkeleton />}>
          <div className="pb-safe h-full overflow-y-auto">
            <BookPageContent />
          </div>
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
