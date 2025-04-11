'use client';

import type { Book } from '@/apis/book';
import { BookDialog } from '@/components/BookDialog';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLibraryDetail } from '../../libraries/hooks/useLibraryDetail';
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

export default function LibraryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const libraryId = parseInt(params.id, 10);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const user = useCurrentUser();

  // 서재 데이터와 상태 가져오기
  const {
    library,
    isLoading,
    isSubscribed,
    notificationsEnabled,
    handleSubscriptionToggle,
    handleNotificationToggle,
  } = useLibraryDetail(libraryId, user?.id);

  // 서재가 없으면 NotFound 컴포넌트 표시
  if (!library && !isLoading) {
    return <LibraryNotFound />;
  }

  // 책 선택 핸들러
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsBookDialogOpen(true);
  };

  if (!library) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      {/* 상단 헤더 */}
      <LibraryHeader library={library} />

      {/* 메인 콘텐츠와 사이드바 */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-4 md:grid-cols-3 lg:grid-cols-4">
        {/* 메인 컨텐츠 영역 */}
        <div className="md:col-span-2 lg:col-span-3">
          <LibraryContent library={library} onBookClick={handleBookClick} />
        </div>

        {/* 사이드바 영역 */}
        <div className="md:col-span-1">
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
      {selectedBook && (
        <BookDialog
          book={selectedBook}
          open={isBookDialogOpen}
          onOpenChange={setIsBookDialogOpen}
        />
      )}
    </>
  );
}
