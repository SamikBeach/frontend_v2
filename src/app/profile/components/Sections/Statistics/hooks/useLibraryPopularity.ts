import { getLibraryPopularity } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 서재 인기도 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useLibraryPopularity = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'library-popularity'],
    queryFn: () => getLibraryPopularity(userId),
  });
};
