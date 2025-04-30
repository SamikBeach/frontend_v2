import { getReadingStatusStats } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 독서 상태별 도서 수 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useReadingStatusStats = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'reading-status'],
    queryFn: () => getReadingStatusStats(userId),
  });
};
