import { Suspense } from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import { useDialogQuery } from '@/hooks/useDialogQuery';
import { BookInfo } from './BookInfo';

import {
  BookActionButtons,
  BookCoverSection,
  BookHeader,
  BookRatingSection,
  BookRightPanel,
  BookSkeleton,
} from './components';

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
            <BookRatingSection />

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
          <BookRightPanel />
        </div>
      </div>
    </>
  );
}

export function BookDialog() {
  const { isOpen, close } = useDialogQuery({ type: 'book' });

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && close()}>
      <DialogContent className="w-full max-w-none rounded-lg bg-white p-0 md:max-w-screen-xl">
        <Suspense fallback={<BookSkeleton />}>
          <BookHeader />
          <BookDialogContent />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
