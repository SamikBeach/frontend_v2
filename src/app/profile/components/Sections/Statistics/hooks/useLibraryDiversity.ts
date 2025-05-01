import { getLibraryDiversity } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 서재 다양성 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useLibraryDiversity = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'library-diversity'],
    queryFn: () => getLibraryDiversity(userId),
  });
};
