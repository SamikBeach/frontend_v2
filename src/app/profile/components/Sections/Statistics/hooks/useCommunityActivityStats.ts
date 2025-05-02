import { getCommunityActivity } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 커뮤니티 활동 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useCommunityActivityStats = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'community-activity'],
    queryFn: () => getCommunityActivity(userId),
  });
};
