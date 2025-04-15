import { Book } from '@/apis/book/types';
import { addBookToLibraryWithIsbn } from '@/apis/library/library';
import { LibrarySummary } from '@/apis/library/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { BookDetails } from '../types';

// useLibrary 훅 정의
export function useLibrary(
  book: Book | BookDetails | null,
  isbn: string | null,
  userLibraries: LibrarySummary[] = []
) {
  const queryClient = useQueryClient();
  // 에러 상태 관리
  const [error, setError] = useState<Error | null>(null);

  // 책을 서재에 추가하는 뮤테이션
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      bookId,
      libraryId,
    }: {
      bookId: number;
      libraryId: number;
    }) => {
      if (!book || !isbn) {
        throw new Error('책 정보가 없습니다.');
      }

      return addBookToLibraryWithIsbn({
        libraryId: libraryId,
        bookId,
        isbn,
      });
    },
    onError: (err: Error) => {
      setError(err);
      toast.error('서재에 책을 추가하는 데 실패했습니다.');
    },
  });

  // 책을 서재에 추가하는 핸들러 함수
  const handleAddToLibrary = (libraryId: number) => {
    if (!book) {
      toast.error('책 정보가 없습니다.');
      return;
    }

    // 선택한 서재의 이름 가져오기
    const selectedLibrary = userLibraries.find(lib => lib.id === libraryId);
    const libraryName = selectedLibrary?.name || '서재';

    mutate(
      {
        bookId: book.id,
        libraryId,
      },
      {
        onSuccess: () => {
          // 직접 텍스트로 메시지 작성
          const message = `책이 '${libraryName}'에 추가되었습니다.`;
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
    handleAddToLibrary,
    isPending,
    error,
    resetError,
  };
}
