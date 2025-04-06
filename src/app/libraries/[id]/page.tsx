'use client';

import { Book } from '@/components/BookCard/BookCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { LibraryContent, LibrarySidebar } from '../components';
import { useLibrary } from '../hooks';

export default function LibraryDetailPage() {
  // 라우트 파라미터에서 서재 ID 가져오기
  const params = useParams();
  const router = useRouter();
  const libraryId = parseInt(params.id as string);

  // 서재 데이터와 상태 가져오기
  const {
    library,
    isSubscribed,
    notificationsEnabled,
    handleSubscriptionToggle,
    handleNotificationToggle,
    findLibraryCategory,
  } = useLibrary(libraryId);

  // 서재가 없으면 404 또는 오류 메시지 표시
  if (!library) {
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

  // BookCard에 필요한 onClick 핸들러
  const handleBookClick = (book: Book) => {
    // 책 상세 정보 페이지로 이동하거나 모달 열기 등의 기능 구현
    console.log('Book clicked:', book);
  };

  const libraryCategory = findLibraryCategory(library.category);

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 헤더 */}
      <div className="flex items-start bg-white py-6">
        <div className="flex-1 pl-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {library.title}
            </h1>
            <Badge
              className="rounded-full px-2 py-0.5 text-xs"
              style={{ backgroundColor: libraryCategory.color }}
            >
              {libraryCategory.name}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">
              {library.owner.name}
            </span>
            님의 서재
          </p>
        </div>
      </div>

      {/* 메인 콘텐츠와 사이드바 */}
      <div className="w-full pb-12">
        <div className="grid gap-8 md:grid-cols-[1fr_320px]">
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
    </div>
  );
}
