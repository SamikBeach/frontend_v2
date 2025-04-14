import { Book } from '@/apis/book/types';
import { addBookToBookshelf } from '@/apis/library/library';
import { LibrarySummary } from '@/apis/library/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { josa } from 'josa';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { BookDetails } from '../types';

// useBookshelf 훅 정의
export function useBookshelf(
  book: Book | BookDetails | null,
  isbn: string | null,
  userLibraries: LibrarySummary[] = []
) {
  const queryClient = useQueryClient();
  // 에러 상태 관리
  const [error, setError] = useState<Error | null>(null);

  // 책을 북쉘프에 추가하는 뮤테이션
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      bookId,
      bookshelfId,
    }: {
      bookId: number;
      bookshelfId: number;
    }) => {
      if (!book || !isbn) {
        throw new Error('책 정보가 없습니다.');
      }

      return addBookToBookshelf({
        bookshelfId,
        bookId,
        isbn,
      });
    },
    onError: (err: Error) => {
      setError(err);
      toast.error('북쉘프에 책을 추가하는 데 실패했습니다.');
    },
  });

  // 책을 북쉘프에 추가하는 핸들러 함수
  const handleAddToBookshelf = (bookshelfId: number) => {
    if (!book) {
      toast.error('책 정보가 없습니다.');
      return;
    }

    // 선택한 서재의 이름 가져오기
    const selectedLibrary = userLibraries.find(lib => lib.id === bookshelfId);
    const libraryName = selectedLibrary?.name || '서재';

    mutate(
      {
        bookId: book.id,
        bookshelfId,
      },
      {
        onSuccess: () => {
          // josa 라이브러리를 사용하여 적절한 조사 적용
          const message = josa(`책이 '${libraryName}'#{에} 추가되었습니다.`);
          toast.success(message);

          // 서재 데이터 갱신
          queryClient.invalidateQueries({ queryKey: ['user-libraries'] });
        },
      }
    );
  };

  // 에러 초기화 함수
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    handleAddToBookshelf,
    isPending,
    error,
    resetError,
  };
}
