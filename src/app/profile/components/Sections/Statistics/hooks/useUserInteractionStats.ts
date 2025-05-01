import { getUserInteraction } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 사용자 상호작용 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useUserInteractionStats = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'user-interaction'],
    queryFn: () => getUserInteraction(userId),
  });
};
