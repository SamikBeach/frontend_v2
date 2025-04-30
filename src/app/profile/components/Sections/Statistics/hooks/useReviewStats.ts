import { getReviewStats } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 리뷰 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useReviewStats = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'reviews'],
    queryFn: () => getReviewStats(userId),
  });
};
