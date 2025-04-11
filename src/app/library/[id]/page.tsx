'use client';

import { Book } from '@/apis/book';
import { useLibraryDetail } from '@/app/libraries/hooks/useLibraryDetail';
import { selectedBookAtom, selectedBookIdAtom } from '@/atoms/book';
import { BookDialog } from '@/components/BookDialog';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { LibraryContent } from './LibraryContent';
import { LibraryHeader } from './LibraryHeader';
import { LibrarySidebar } from './LibrarySidebar';

// 서재가 없을 때 표시할 컴포넌트
function LibraryNotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-900">
        서재를 찾을 수 없습니다
      </h1>
      <p className="mt-2 text-gray-500">
        요청하신 서재가 존재하지 않거나 삭제되었습니다.
      </p>
      <Button className="mt-4" onClick={() => router.push('/libraries')}>
        서재 목록으로 돌아가기
      </Button>
    </div>
  );
}

function LibraryDetailContent() {
  const params = useParams();
  const libraryId = parseInt(params.id as string, 10);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [selectedBookId] = useAtom(selectedBookIdAtom);

  const {
    library,
    isSubscribed,
    notificationsEnabled,
    handleSubscriptionToggle,
    handleNotificationToggle,
  } = useLibraryDetail(libraryId);

  if (!library) {
    return <div>서재를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="mx-auto max-w-[1600px]">
      <LibraryHeader
        library={library}
        isSubscribed={isSubscribed}
        notificationsEnabled={notificationsEnabled}
        onSubscriptionToggle={handleSubscriptionToggle}
        onNotificationToggle={handleNotificationToggle}
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <LibraryContent library={library} />
        </div>
        <div className="w-full min-w-[360px]">
          <LibrarySidebar
            library={library}
            isSubscribed={isSubscribed}
            notificationsEnabled={notificationsEnabled}
            onSubscriptionToggle={handleSubscriptionToggle}
            onNotificationToggle={handleNotificationToggle}
          />
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
    <Suspense fallback={<div>서재 정보를 불러오는 중...</div>}>
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
