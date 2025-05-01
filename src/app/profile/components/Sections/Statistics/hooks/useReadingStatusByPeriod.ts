import { getReadingStatusByPeriod } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 기간별 독서 상태 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useReadingStatusByPeriod = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'reading-status-by-period'],
    queryFn: () => getReadingStatusByPeriod(userId),
  });
};
