import { ReadingStatusType } from '@/apis/reading-status/types';
import { getUserBooks } from '@/apis/user/user';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

// 사용자의 책 목록 데이터를 반환하는 훅
export function useUserBooks(status?: ReadingStatusType) {
  const params = useParams();
  const userId = Number(params.id as string);

  const { data } = useSuspenseQuery({
    queryKey: ['user-books', userId, status],
    queryFn: async () => {
      return getUserBooks(userId, status, 1, 12);
    },
  });

  const books =
    data?.items.map(item => ({
      id: item.book.id,
      title: item.book.title,
      author: item.book.author,
      coverImage: item.book.coverImageUrl,
      status: item.status,
      // 추가 필드가 필요하면 여기에 추가
    })) || [];

  return {
    books,
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 0,
    hasNextPage: data?.hasNextPage || false,
  };
}
