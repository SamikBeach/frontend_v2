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
  BookFullSkeleton,
  ErrorFallback,
} from '@/components/BookDialog/components/common';
import { useIsMobile } from '@/hooks/use-mobile';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// 모바일용 BookPageContent
function MobileBookPageContent() {
  return (
    <div className="mx-auto w-full p-3">
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
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <BookRightPanel />
        </ErrorBoundary>
      </div>
    </div>
  );
}

// 데스크톱용 BookPageContent
function DesktopBookPageContent() {
  return (
    <div className="mx-auto w-full p-3 md:p-8">
      <div className="grid gap-10 md:grid-cols-[380px_1fr]">
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
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <BookRightPanel />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default function BookPage() {
  const isMobile = useIsMobile();
  // params.isbn을 활용해 내부적으로 BookDialog의 각종 훅/컴포넌트가 동작하도록 함 (BookDialog와 동일하게 Suspense 기반)
  // BookDialog처럼 내부에서 isbn을 읽어 api 호출 등에 활용하는 구조라면, 별도 props 전달 없이도 정상 동작함
  return (
    <main className="min-h-screen w-full bg-white">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<BookFullSkeleton />}>
          <div className="pb-safe h-full overflow-y-auto">
            {isMobile ? <MobileBookPageContent /> : <DesktopBookPageContent />}
          </div>
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
