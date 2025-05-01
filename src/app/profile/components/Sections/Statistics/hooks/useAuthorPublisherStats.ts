import { getAuthorPublisherStats } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 저자/출판사 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useAuthorPublisherStats = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'author-publisher'],
    queryFn: () => getAuthorPublisherStats(userId),
  });
};
