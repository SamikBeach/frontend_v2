import { UserReadingStatusCountsDto } from '@/apis/user/types';
import { getUserReadingStatusCounts } from '@/apis/user/user';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

/**
 * 사용자의 독서 상태 카운트를 가져오는 훅
 * @returns 독서 상태별 카운트 정보
 */
export function useReadingStatusCounts() {
  const params = useParams();
  const userId = Number(params.id);

  const { data, isLoading } = useSuspenseQuery<UserReadingStatusCountsDto>({
    queryKey: ['user-reading-status-counts', userId],
    queryFn: () => getUserReadingStatusCounts(userId),
  });

  return {
    statusCounts: data || {
      WANT_TO_READ: 0,
      READING: 0,
      READ: 0,
      total: 0,
    },
    isLoading,
  };
}
