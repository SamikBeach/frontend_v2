'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useIsMobile } from '@/hooks/use-mobile';
import { useDialogQuery } from '@/hooks/useDialogQuery';
import { useQueryParams } from '@/hooks/useQueryParams';

import {
  BookActionButtons,
  BookCoverSection,
  BookHeader,
  BookRatingSection,
  BookReadingStats,
  BookRightPanel,
} from './components';
import { BookInfo, BookInfoSkeleton } from './components/BookInfo';
import { BookFullSkeleton, ErrorFallback } from './components/common';

import { bookReviewSortAtom } from '@/atoms/book';
import { hasOpenDropdownAtom } from '@/atoms/book-dialog';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogPortal,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { useAtomValue, useSetAtom } from 'jotai';

// 모바일용 BookDialogContent 컴포넌트
function MobileBookDialogContent() {
  return (
    <>
      <div className="mx-auto w-full px-4 pt-4">
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
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<BookInfoSkeleton />}>
                <BookInfo />
              </Suspense>
            </ErrorBoundary>
            <p className="mt-2 text-right text-xs text-gray-400">
              정보제공: 알라딘
            </p>
          </div>

          {/* 리뷰 및 관련 정보 */}
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <BookRightPanel />
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}

// 데스크톱용 BookDialogContent 컴포넌트
function DesktopBookDialogContent() {
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
    </>
  );
}

export function BookDialog() {
  const { searchParams } = useQueryParams();
  // URL에 id 파라미터가 있으면 'id' 타입으로, 없으면 'isbn' 타입으로 설정
  const idType = searchParams.has('id') ? 'id' : 'isbn';
  const { isOpen, close } = useDialogQuery({ type: 'book', idType });
  const isMobile = useIsMobile();

  // 현재 열려있는 드롭다운이 있는지 확인
  const hasOpenDropdown = useAtomValue(hasOpenDropdownAtom);

  // 정렬 상태 초기화를 위한 setter
  const setBookReviewSort = useSetAtom(bookReviewSortAtom);

  // 다이얼로그 닫기 핸들러
  const handleClose = () => {
    // 정렬 상태 초기화 (기본값으로 리셋)
    setBookReviewSort('likes');
    close();
  };

  // 모바일 환경에서는 ResponsiveDialog 사용, 데스크톱에서는 직접 Dialog 컴포넌트 스타일링
  if (isMobile) {
    return (
      <ResponsiveDialog
        open={isOpen}
        onOpenChange={open => {
          if (!open) handleClose();
        }}
        shouldScaleBackground={false}
      >
        <ResponsiveDialogPortal>
          <ResponsiveDialogContent drawerClassName="w-full h-[100dvh] bg-white p-0 rounded-t-[16px] overflow-hidden shadow-lg outline-none focus:outline-none focus-visible:outline-none">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<BookFullSkeleton />}>
                <div className="flex h-full flex-col">
                  <ResponsiveDialogTitle
                    className="sr-only"
                    drawerClassName="sr-only"
                  >
                    도서 상세 정보
                  </ResponsiveDialogTitle>
                  <ResponsiveDialogHeader className="flex-shrink-0 p-0">
                    <BookHeader isDialog />
                  </ResponsiveDialogHeader>
                  <div className="pb-safe flex-1 overflow-y-auto">
                    <MobileBookDialogContent />
                  </div>
                </div>
              </Suspense>
            </ErrorBoundary>
          </ResponsiveDialogContent>
        </ResponsiveDialogPortal>
      </ResponsiveDialog>
    );
  }

  // 데스크톱 환경에서는 기존 Dialog 스타일 그대로 유지
  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={open => {
        if (!open) handleClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 overflow-y-auto bg-black/50">
          <div className="min-h-full rounded-lg py-5">
            <DialogPrimitive.Content
              aria-describedby={undefined}
              className="relative left-[50%] min-w-[960px] translate-x-[-50%] rounded-lg border bg-white p-0 shadow-lg outline-none focus:outline-none focus-visible:outline-none md:max-w-screen-xl"
              onEscapeKeyDown={e => {
                if (hasOpenDropdown) {
                  e.preventDefault();
                  return;
                }
              }}
              onOpenAutoFocus={e => e.preventDefault()}
              onCloseAutoFocus={e => e.preventDefault()}
            >
              {/* DialogTitle 컴포넌트는 접근성 목적으로 필요하지만 실제 화면에 표시되는 제목은 BookHeader 컴포넌트에 있습니다. */}
              <DialogPrimitive.Title className="sr-only">
                도서 상세 정보
              </DialogPrimitive.Title>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={<BookFullSkeleton />}>
                  <BookHeader isDialog />
                  <DesktopBookDialogContent />
                </Suspense>
              </ErrorBoundary>
            </DialogPrimitive.Content>
          </div>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
