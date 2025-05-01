import { getRatingHabits } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 평가 습관 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useRatingHabits = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'rating-habits'],
    queryFn: () => getRatingHabits(userId),
  });
};
