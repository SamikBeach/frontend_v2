import { getLibraryUpdatePattern } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 서재 업데이트 패턴 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useLibraryUpdatePattern = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'library-update-pattern'],
    queryFn: () => getLibraryUpdatePattern(userId),
  });
};
