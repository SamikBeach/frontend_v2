'use client';

import { bookReviewSortAtom } from '@/atoms/book';
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
import { ErrorFallback } from '@/components/BookDialog/components/common';
import { useSetAtom } from 'jotai';
import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// 통합 스켈레톤 컴포넌트 (모바일/데스크톱 공통)
function UnifiedBookSkeleton() {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="pb-safe h-full overflow-y-auto">
        <div className="mx-auto w-full p-3 md:p-8">
          <div className="space-y-6 md:grid md:grid-cols-[380px_1fr] md:gap-10 md:space-y-0">
            {/* 왼쪽: 책 표지 및 기본 정보 */}
            <div className="space-y-6">
              {/* 책 표지 이미지 */}
              <div className="relative mx-auto w-44 overflow-hidden rounded-2xl bg-gray-50 md:w-56 lg:w-64">
                <div className="h-[264px] w-full animate-pulse bg-gray-100 md:h-[320px]" />
              </div>
              {/* 제목/저자/출판사/출간일 */}
              <div className="space-y-2 px-1 md:px-0">
                <div className="text-center md:text-left">
                  <div className="mx-auto inline-block h-7 w-32 animate-pulse rounded bg-gray-100 md:mx-0 md:h-8 md:w-48" />
                  <div className="ml-2 inline-block h-5 w-12 animate-pulse rounded-full bg-gray-100 align-text-bottom" />
                  <div className="ml-1 inline-block h-5 w-10 animate-pulse rounded-full bg-gray-100 align-text-bottom" />
                </div>
                <div className="mx-auto h-5 w-24 animate-pulse rounded bg-gray-100 md:mx-0 md:w-32" />
                <div className="mx-auto h-5 w-20 animate-pulse rounded bg-gray-100 md:mx-0 md:w-28" />
                <div className="mx-auto h-5 w-28 animate-pulse rounded bg-gray-100 md:mx-0 md:w-36" />
              </div>
              {/* 별점 정보 스켈레톤 */}
              <div className="h-24 animate-pulse rounded-xl bg-gray-50 p-4"></div>
              {/* 읽기 통계 스켈레톤 */}
              <div className="h-20 w-full animate-pulse rounded-xl bg-gray-100" />
              {/* 기능 버튼 스켈레톤 */}
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 w-full animate-pulse rounded-full bg-gray-100" />
                  <div className="h-10 w-full animate-pulse rounded-full bg-gray-100" />
                </div>
              </div>
              {/* 책 설명 스켈레톤 */}
              <BookInfoSkeleton />
              <p className="mt-2 text-right text-xs text-gray-400">
                정보제공: 알라딘
              </p>
            </div>
            {/* 오른쪽: 리뷰 및 관련 정보 스켈레톤 - 데스크톱에서만 표시 */}
            <div className="relative hidden flex-col md:flex">
              {/* 탭 네비게이션 스켈레톤 */}
              <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex gap-6">
                  <div className="h-6 w-20 animate-pulse rounded bg-gray-100" />
                  <div className="h-6 w-36 animate-pulse rounded bg-gray-100" />
                  <div className="h-6 w-16 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="h-8 w-24 animate-pulse rounded-full bg-gray-100" />
              </div>
              {/* 컨텐츠 영역 스켈레톤 */}
              <div className="overflow-hidden rounded-lg">
                <div className="space-y-0">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className={`${index === 0 ? 'pt-2 pb-6' : 'py-6'} ${
                          index !== 2 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="mt-0.5 h-9 w-9 flex-shrink-0 animate-pulse rounded-full bg-gray-100" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                              <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
                            </div>
                            {/* 별점 스켈레톤 */}
                            <div className="mt-1 flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="h-3 w-3 animate-pulse rounded-full bg-gray-100"
                                />
                              ))}
                            </div>
                            {/* 본문 스켈레톤 */}
                            <div className="mt-2 space-y-1.5">
                              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                            </div>
                            {/* 버튼 스켈레톤 */}
                            <div className="mt-2.5 flex items-center gap-2 pt-1">
                              <div className="h-7 w-16 animate-pulse rounded-full bg-gray-100" />
                              <div className="h-7 w-16 animate-pulse rounded-full bg-gray-100" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  // 정렬 상태 초기화를 위한 setter
  const setBookReviewSort = useSetAtom(bookReviewSortAtom);

  // 페이지 이탈 시 정렬 상태 초기화
  useEffect(() => {
    return () => {
      // cleanup 함수에서 정렬 상태 초기화
      setBookReviewSort('likes');
    };
  }, [setBookReviewSort]);

  return (
    <main className="min-h-screen w-full bg-white">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<UnifiedBookSkeleton />}>
          <div className="pb-safe h-full overflow-y-auto">
            <BookPageContent />
          </div>
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
