import { getReviewInfluence } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 리뷰 영향력 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useReviewInfluence = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'review-influence'],
    queryFn: () => getReviewInfluence(userId),
  });
};
