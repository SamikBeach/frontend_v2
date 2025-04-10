'use client';

import { Book } from '@/apis';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { LibraryContent, LibrarySidebar } from '../components';
import { useLibraryDetail } from '../hooks/useLibraryDetail';

// 서재 상세 로딩 스켈레톤
function LibraryDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex py-6">
        <div className="flex-1 pl-8">
          <div className="mb-2 h-8 w-64 rounded bg-gray-200"></div>
          <div className="h-4 w-32 rounded bg-gray-200"></div>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-6 pl-8">
          <div className="h-24 rounded-lg bg-gray-200"></div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-6 w-16 rounded-full bg-gray-200"></div>
            ))}
          </div>
          <div className="h-6 w-48 rounded bg-gray-200"></div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] rounded-lg bg-gray-200"
              ></div>
            ))}
          </div>
        </div>
        <div className="pr-8">
          <div className="space-y-6">
            <div className="h-48 rounded-xl bg-gray-200"></div>
            <div className="h-48 rounded-xl bg-gray-200"></div>
            <div className="h-48 rounded-xl bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 라이브러리 상세 컨텐츠 컴포넌트
function LibraryDetailContent() {
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
  } = useLibraryDetail(libraryId);

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

  // 카테고리 색상 찾기
  const libraryCategory =
    library.tags && library.tags.length > 0
      ? { name: library.tags[0].name, color: '#FFF8E2' }
      : { name: '기타', color: '#E2E8F0' };

  return (
    <>
      {/* 상단 헤더 */}
      <div className="flex items-start bg-white py-6">
        <div className="flex-1 pl-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{library.name}</h1>
            <Badge
              className="rounded-full px-2 py-0.5 text-xs"
              style={{ backgroundColor: libraryCategory.color }}
            >
              {libraryCategory.name}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">
              {library.owner.username}
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
