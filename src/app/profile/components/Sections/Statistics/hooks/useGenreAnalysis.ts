import { getGenreAnalysis } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 장르/카테고리 분석 통계를 조회하는 훅
 * @param userId 사용자 ID
 * @param period 기간 필터 (선택사항)
 */
export const useGenreAnalysis = (userId: number, period?: string) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'genre-analysis', period],
    queryFn: () => getGenreAnalysis(userId),
  });
};
