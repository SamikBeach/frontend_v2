import { getAmountStats } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 금액 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useAmountStats = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'amount'],
    queryFn: () => getAmountStats(userId),
  });
};
