import { UserReviewTypeCountsDto } from '@/apis/user/types';
import { getUserReviewTypeCounts } from '@/apis/user/user';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

/**
 * 리뷰 타입별 카운트를 로드하는 훅
 * @returns 리뷰 타입별 카운트 데이터
 */
export function useTypeCountsLoader(): UserReviewTypeCountsDto {
  const params = useParams();
  const userId = Number(params.id);

  // 리뷰 타입별 카운트 직접 쿼리
  const { data: typeCounts } = useSuspenseQuery<UserReviewTypeCountsDto>({
    queryKey: ['user-review-type-counts', userId],
    queryFn: () => getUserReviewTypeCounts(userId),
  });

  return typeCounts;
}
