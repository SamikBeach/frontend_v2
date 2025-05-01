import { getGenreAnalysis } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 장르/카테고리 분석 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useGenreAnalysis = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'genre-analysis'],
    queryFn: () => getGenreAnalysis(userId),
  });
};
