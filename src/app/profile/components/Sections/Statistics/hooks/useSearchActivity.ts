import { getSearchActivity } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 검색 활동 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useSearchActivity = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'search-activity'],
    queryFn: () => getSearchActivity(userId),
  });
};
