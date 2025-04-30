import { getUserActivity } from '@/apis/user/user';
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useParams } from 'next/navigation';

interface UseUserActivityResult {
  activities: any[];
  isLoading: boolean;
  error: Error | null;
  totalActivities: number;
  currentPage: number;
  totalPages: number;
  fetchNextPage: () => Promise<any>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

/**
 * 사용자 활동(리뷰+별점)을 로드하는 훅 (페이지네이션 방식)
 */
export function useUserActivity(
  page: number = 1,
  limit: number = 10,
  filter: 'popular' | 'recent' = 'recent'
): Omit<
  UseUserActivityResult,
  'fetchNextPage' | 'hasNextPage' | 'isFetchingNextPage'
> {
  const params = useParams();
  const userId = Number(params.id);

  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: ['user-activity', userId, page, limit, filter],
    queryFn: async () => {
      return getUserActivity(userId, page, limit, filter);
    },
  });

  return {
    activities: data?.activities || [],
    isLoading,
    error: error as Error | null,
    totalActivities: data?.total || 0,
    currentPage: page,
    totalPages: data?.totalPages || 0,
  };
}

/**
 * 사용자의 활동(리뷰+별점)을 로드하는 훅 (무한 스크롤 방식)
 * @param limit 페이지당 항목 수
 * @param filter 정렬 방식
 */
export function useUserActivityInfinite(
  limit: number = 10,
  filter: 'popular' | 'recent' = 'recent'
): Omit<UseUserActivityResult, 'isLoading' | 'error'> {
  const params = useParams();
  const userId = Number(params.id);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['user-activity-infinite', userId, limit, filter],
      queryFn: async ({ pageParam = 1 }) => {
        const result = await getUserActivity(userId, pageParam, limit, filter);

        // 페이지 정보 계산
        const totalPages = result.totalPages || Math.ceil(result.total / limit);
        const hasMore = pageParam < totalPages && result.activities.length > 0;

        return {
          ...result,
          activities: result.activities,
          page: pageParam,
          hasNextPage: hasMore,
        };
      },
      getNextPageParam: lastPage => {
        if (lastPage.hasNextPage) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  // 모든 페이지의 활동 목록을 하나의 배열로 병합
  const activities = data?.pages.flatMap(page => page.activities || []) || [];

  // 첫 페이지의 총 활동 수 데이터
  const totalActivities = data?.pages[0]?.total || 0;

  return {
    activities,
    totalActivities,
    currentPage: data?.pages?.length || 1,
    totalPages: data?.pages[0]?.totalPages || 0,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
}
