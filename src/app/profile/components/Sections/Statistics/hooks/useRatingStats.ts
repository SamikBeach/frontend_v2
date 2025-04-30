import { getRatingStats } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 평점 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useRatingStats = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'ratings'],
    queryFn: () => getRatingStats(userId),
  });
};
