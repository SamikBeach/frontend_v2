import { getBookMetadataStats } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 도서 메타데이터 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useBookMetadataStats = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'book-metadata'],
    queryFn: () => getBookMetadataStats(userId),
  });
};
