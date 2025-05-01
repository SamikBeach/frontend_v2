import { getLibraryComposition } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 서재 구성 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useLibraryComposition = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'library-composition'],
    queryFn: () => getLibraryComposition(userId),
  });
};
