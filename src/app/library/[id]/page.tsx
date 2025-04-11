'use client';

import { Book } from '@/apis/book';
import { selectedBookAtom, selectedBookIdAtom } from '@/atoms/book';
import { BookDialog } from '@/components/BookDialog';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const user = useCurrentUser();
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [selectedBookId] = useAtom(selectedBookIdAtom);

  // 서재 데이터 가져오기
  const { library, isLoading } = useLibraryDetail(libraryId, user?.id);

  // 서재가 없으면 NotFound 컴포넌트 표시
  if (!library && !isLoading) {
    return <LibraryNotFound />;
  }

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
          <LibraryContent library={library} />
        </div>

        {/* 사이드바 영역 */}
        <div className="md:col-span-1">
          <LibrarySidebar library={library} />
        </div>
      </div>

      {/* 책 정보 다이얼로그 */}
      <BookDialogWrapper
        isOpen={isBookDialogOpen}
        onOpenChange={setIsBookDialogOpen}
      />
    </>
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
