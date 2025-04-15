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
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [conflictLibraryName, setConflictLibraryName] = useState('');

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
    onError: (err: any, variables) => {
      // 409 Conflict 에러 감지
      if (err.response && err.response.status === 409) {
        // 에러가 발생한 라이브러리 ID는 mutate에 전달된 variables에서 가져옵니다
        const { libraryId } = variables;
        const selectedLibrary = userLibraries.find(lib => lib.id === libraryId);
        const libraryName = selectedLibrary?.name || '서재';

        setConflictLibraryName(libraryName);
        setConflictDialogOpen(true);
      } else {
        setError(err);
        toast.error('서재에 책을 추가하는 데 실패했습니다.');
      }
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
    const bookTitle = book.title || '책';

    mutate(
      {
        bookId: book.id,
        libraryId,
      },
      {
        onSuccess: () => {
          // 성공 메시지 표시 - 수정된 포맷
          toast.success(
            `"${bookTitle}"이 서재 "${libraryName}"에 추가되었습니다.`
          );

          // 사용자 서재 목록 갱신
          queryClient.invalidateQueries({ queryKey: ['user-libraries'] });

          // 책에 대한 서재 목록 갱신
          if (book.id) {
            queryClient.invalidateQueries({
              queryKey: ['book-libraries', book.id],
            });
          }

          // isbn이 존재하는 경우에도 book-libraries 캐시 무효화
          if (isbn) {
            // bookId가 -1인 경우를 위한 캐시 무효화
            queryClient.invalidateQueries({
              queryKey: ['book-libraries', -1],
            });

            // ISBN을 사용하는 다른 쿼리도 무효화
            queryClient.invalidateQueries({
              queryKey: ['book-libraries'],
              predicate: query => {
                const queryKey = query.queryKey as any[];
                // 쿼리 키에 isbn이 포함되어 있는지 확인
                return queryKey.length > 3 && queryKey[3] === isbn;
              },
            });
          }
        },
      }
    );
  };

  // 에러 초기화 함수
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // 충돌 다이얼로그 닫기 함수
  const closeConflictDialog = useCallback(() => {
    setConflictDialogOpen(false);
  }, []);

  return {
    handleAddToLibrary,
    isPending,
    error,
    resetError,
    conflictDialogOpen,
    conflictLibraryName,
    closeConflictDialog,
  };
}
