'use client';

import { Book } from '@/apis';
import { BookDialog } from '@/components/BookDialog';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useLibraryDetail } from '../../libraries/hooks/useLibraryDetail';
import { LibraryContent } from './LibraryContent';
import { LibraryDetailSkeleton } from './LibraryDetailSkeleton';
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
      <Button className="mt-4" onClick={() => router.push('/library')}>
        서재 목록으로 돌아가기
      </Button>
    </div>
  );
}

// 라이브러리 상세 컨텐츠 컴포넌트
function LibraryDetailContent() {
  const params = useParams();
  const libraryId = parseInt(params.id as string);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);

  // 서재 데이터와 상태 가져오기
  const {
    library,
    isSubscribed,
    notificationsEnabled,
    handleSubscriptionToggle,
    handleNotificationToggle,
  } = useLibraryDetail(libraryId);

  // 서재가 없으면 NotFound 컴포넌트 표시
  if (!library) {
    return <LibraryNotFound />;
  }

  // BookCard에 필요한 onClick 핸들러
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsBookDialogOpen(true);
  };

  return (
    <>
      {/* 상단 헤더 */}
      <LibraryHeader library={library} />

      {/* 메인 콘텐츠와 사이드바 */}
      <div className="w-full pb-12">
        <div className="grid gap-6 md:grid-cols-[1fr_400px]">
          {/* 왼쪽: 서재 정보 및 책 목록 */}
          <div className="pl-8">
            <LibraryContent library={library} onBookClick={handleBookClick} />
          </div>

          {/* 오른쪽: 사이드바 */}
          <div className="pr-8">
            <LibrarySidebar
              library={library}
              isSubscribed={isSubscribed}
              notificationsEnabled={notificationsEnabled}
              onSubscriptionToggle={handleSubscriptionToggle}
              onNotificationToggle={handleNotificationToggle}
            />
          </div>
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

export default function LibraryDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<LibraryDetailSkeleton />}>
        <LibraryDetailContent />
      </Suspense>
    </div>
  );
}
