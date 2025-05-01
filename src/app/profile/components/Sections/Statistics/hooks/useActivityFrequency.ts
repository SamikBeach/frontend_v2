import { getActivityFrequency } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 액티비티 빈도 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useActivityFrequency = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'activity-frequency'],
    queryFn: () => getActivityFrequency(userId),
  });
};
