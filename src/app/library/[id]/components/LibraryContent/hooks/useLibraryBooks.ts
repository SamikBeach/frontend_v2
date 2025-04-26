import { addBookToLibrary, removeBookFromLibrary } from '@/apis/library';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useLibraryBooks(libraryId: number) {
  const queryClient = useQueryClient();

  // 책 삭제 mutation
  const { mutateAsync: removeBook } = useMutation({
    mutationFn: (bookId: number) => removeBookFromLibrary(libraryId, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library', libraryId] });
      queryClient.invalidateQueries({
        queryKey: ['library-updates', libraryId],
      });
      toast.success('책이 서재에서 삭제되었습니다.');
    },
    onError: error => {
      console.error('책 삭제 중 오류 발생:', error);
      toast.error('책 삭제 중 오류가 발생했습니다.');
    },
  });

  // 책을 다른 서재로 이동하는 mutation
  const { mutate: moveBook } = useMutation({
    mutationFn: async ({
      bookId,
      targetLibraryId,
    }: {
      bookId: number;
      targetLibraryId: number;
    }) => {
      if (targetLibraryId === libraryId) {
        throw new Error('같은 서재로 이동할 수 없습니다.');
      }

      // 1. 먼저 타겟 서재에 책 추가
      await addBookToLibrary(targetLibraryId, { bookId });

      // 2. 소스 서재에서 책 제거
      await removeBookFromLibrary(libraryId, bookId);
    },
    onSuccess: () => {
      // 양쪽 서재 모두 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['library', libraryId] });
      toast.success('책이 다른 서재로 이동되었습니다.');
    },
    onError: error => {
      console.error('책 이동 중 오류 발생:', error);
      toast.error('책을 이동하는 중 오류가 발생했습니다.');
    },
  });

  return {
    removeBook,
    moveBook,
  };
}
