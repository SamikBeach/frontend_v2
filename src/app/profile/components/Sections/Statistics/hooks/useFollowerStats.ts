import { getFollowerStats } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 팔로워/팔로잉 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useFollowerStats = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'follower'],
    queryFn: () => getFollowerStats(userId),
  });
};
