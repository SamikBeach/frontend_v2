'use client';

import { Book } from '@/apis/book';
import { selectedBookAtom, selectedBookIdAtom } from '@/atoms/book';
import { BookDialog } from '@/components/BookDialog';
import { useAtom } from 'jotai';
import { Suspense, useEffect, useState } from 'react';
import { LibraryContent } from './LibraryContent';
import { LibraryDetailSkeleton } from './LibraryDetailSkeleton';
import { LibraryHeader } from './LibraryHeader';
import { LibrarySidebar } from './LibrarySidebar';

function LibraryDetailContent() {
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1600px]">
      <LibraryHeader />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <LibraryContent />
        </div>
        <div className="w-full min-w-[360px]">
          <LibrarySidebar />
        </div>
      </div>

      {/* 책 정보 다이얼로그 */}
      <BookDialogWrapper
        isOpen={isBookDialogOpen}
        onOpenChange={setIsBookDialogOpen}
      />
    </div>
  );
}

export default function LibraryDetailPage() {
  return (
    <Suspense fallback={<LibraryDetailSkeleton />}>
      <LibraryDetailContent />
    </Suspense>
  );
}

// BookDialog 래퍼 컴포넌트 - 책 데이터를 로드하는 책임을 담당
interface BookDialogWrapperProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function BookDialogWrapper({ isOpen, onOpenChange }: BookDialogWrapperProps) {
  const [selectedBookId] = useAtom(selectedBookIdAtom);
  const [selectedBook, setSelectedBook] = useAtom(selectedBookAtom);

  // 선택된 책 ID가 변경되면 데이터 로드
  useEffect(() => {
    if (selectedBookId) {
      // 실제로는 API 호출로 책 데이터를 로드
      // 예시 코드이므로 실제 구현은 필요에 따라 변경
      const loadBook = async () => {
        try {
          // 실제로는 API 호출
          // const bookData = await getBookById(selectedBookId);
          // setSelectedBook(bookData);

          // 임시 데이터
          setSelectedBook({
            id: parseInt(selectedBookId),
            title: '샘플 책',
            author: '샘플 저자',
            coverImage: `https://picsum.photos/seed/${selectedBookId}/240/360`,
            description: '샘플 책 설명입니다.',
            // 필요한 다른 속성들...
          } as Book);
        } catch (error) {
          console.error('책 데이터 로드 중 오류:', error);
        }
      };

      loadBook();
    }
  }, [selectedBookId, setSelectedBook]);

  // 선택된 책이 없으면 다이얼로그 렌더링하지 않음
  if (!selectedBook) return null;

  return (
    <BookDialog book={selectedBook} open={isOpen} onOpenChange={onOpenChange} />
  );
}
