import { Suspense } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { useDialogQuery } from '@/hooks/useDialogQuery';
import { BookInfo } from './BookInfo';

import { ErrorBoundary } from 'react-error-boundary';
import {
  BookActionButtons,
  BookCoverSection,
  BookHeader,
  BookRatingSection,
  BookReadingStats,
  BookRightPanel,
  BookSkeleton,
} from './components';

// Error fallback component
function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <p className="text-lg font-medium text-red-600">
        데이터를 불러오는 중 오류가 발생했습니다
      </p>
      <p className="mt-1 text-sm text-gray-600">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        다시 시도
      </button>
    </div>
  );
}

function BookDialogContent() {
  return (
    <>
      <div className="mx-auto w-full max-w-screen-xl px-10 pt-4 pb-10">
        <div className="grid gap-10 md:grid-cols-[380px_1fr]">
          {/* 왼쪽: 책 표지 및 기본 정보 */}
          <div className="space-y-6">
            {/* 책 표지 및 기본 정보 */}
            <BookCoverSection />

            {/* 별점 정보 */}
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense
                fallback={
                  <div className="h-24 animate-pulse rounded-xl bg-gray-50 p-4"></div>
                }
              >
                <BookRatingSection />
              </Suspense>
            </ErrorBoundary>

            {/* 읽기 통계 */}
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <BookReadingStats />
            </ErrorBoundary>

            {/* 기능 버튼들 */}
            <div className="flex flex-col gap-3">
              {/* 읽기 상태 및 서재에 담기 버튼 */}
              <BookActionButtons />
            </div>

            {/* 책 설명, 저자 소개 */}
            <div className="space-y-1">
              <BookInfo />
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
    </>
  );
}

export function BookDialog() {
  const { isOpen, close } = useDialogQuery({ type: 'book' });

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) close();
      }}
    >
      <DialogContent className="w-full max-w-none rounded-lg bg-white p-0 md:max-w-screen-xl">
        {/* DialogTitle 컴포넌트는 접근성 목적으로 필요합니다. 실제 화면에 표시되는 제목은 BookHeader 컴포넌트에 있습니다. */}
        <DialogTitle className="sr-only">도서 상세 정보</DialogTitle>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<BookSkeleton />}>
            <BookHeader />
            <BookDialogContent />
          </Suspense>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
}
