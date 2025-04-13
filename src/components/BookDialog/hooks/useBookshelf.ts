import { josa } from 'josa';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { BookDetails } from '../types';

interface Bookshelf {
  id: number;
  name: string;
  owner: string;
  bookCount: number;
  followers: number;
  thumbnail?: string;
}

export function useBookshelf(
  book: BookDetails | null,
  isbn: string | null | undefined,
  bookshelves: Bookshelf[]
) {
  const router = useRouter();

  // 서재에 담기 핸들러
  const handleAddToBookshelf = useCallback(
    (bookshelfId: number) => {
      if (!isbn || !book) return;

      // 서재 정보 찾기
      const bookshelf = bookshelves.find(shelf => shelf.id === bookshelfId);

      // API 호출 등 구현
      console.log(`서재에 담기: 책 ISBN ${isbn}, 서재 ID ${bookshelfId}`);

      // 토스트 알림 표시 - josa 사용하여 조사 처리
      toast.success(
        josa(`${book.title}#{이} ${bookshelf?.name || '서재'}에 담겼습니다`),
        {
          duration: 5000, // 5초로 늘림
          action: {
            label: '서재로 이동',
            onClick: () => {
              // 서재 페이지로 이동
              router.push('/profile/library');
            },
          },
          // 기본 스타일링 유지
          style: {
            fontWeight: 'bold',
          },
        }
      );
    },
    [book, isbn, bookshelves, router]
  );

  return {
    handleAddToBookshelf,
  };
}
