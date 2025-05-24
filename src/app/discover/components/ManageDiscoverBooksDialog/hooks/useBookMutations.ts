import { removeBookFromDiscoverCategory } from '@/apis/book/book';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseBookMutationsProps {
  onBookRemoved?: (bookId: number) => void;
}

export const useBookMutations = ({
  onBookRemoved,
}: UseBookMutationsProps = {}) => {
  const queryClient = useQueryClient();

  const removeBookMutation = useMutation({
    mutationFn: (bookId: number) => removeBookFromDiscoverCategory(bookId),
    onSuccess: (_, bookId) => {
      toast.success('도서가 발견하기 카테고리에서 제거되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['admin-discover-category-books'],
      });
      onBookRemoved?.(bookId);
    },
    onError: () => {
      toast.error('도서 제거 중 오류가 발생했습니다.');
    },
  });

  return {
    removeBookMutation,
  };
};
