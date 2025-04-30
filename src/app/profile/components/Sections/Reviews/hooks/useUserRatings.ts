import { getUserRatings } from '@/apis/user/user';
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useParams } from 'next/navigation';

interface UseUserRatingsResult {
  ratings: any[];
  isLoading: boolean;
  error: Error | null;
  totalRatings: number;
  currentPage: number;
  totalPages: number;
  fetchNextPage: () => Promise<any>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

/**
 * 사용자 평점을 로드하는 훅 (페이지네이션 방식)
 */
export function useUserRatings(
  page: number = 1,
  limit: number = 10
): Omit<
  UseUserRatingsResult,
  'fetchNextPage' | 'hasNextPage' | 'isFetchingNextPage'
> {
  const params = useParams();
  const userId = Number(params.id);

  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: ['user-ratings', userId, page, limit],
    queryFn: async () => {
      return getUserRatings(userId, page, limit);
    },
  });

  return {
    ratings: data?.ratings || [],
    isLoading,
    error: error as Error | null,
    totalRatings: data?.total || 0,
    currentPage: page,
    totalPages: data?.totalPages || 0,
  };
}

/**
 * 사용자의 평점을 로드하는 훅 (무한 스크롤 방식)
 * @param limit 페이지당 항목 수
 */
export function useUserRatingsInfinite(
  limit: number = 10
): Omit<UseUserRatingsResult, 'isLoading' | 'error'> {
  const params = useParams();
  const userId = Number(params.id);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['user-ratings-infinite', userId, limit],
      queryFn: async ({ pageParam = 1 }) => {
        const result = await getUserRatings(userId, pageParam, limit);

        // 페이지 정보 계산
        const totalPages = result.totalPages || Math.ceil(result.total / limit);
        const hasMore = pageParam < totalPages && result.ratings.length > 0;

        return {
          ...result,
          ratings: result.ratings,
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

  // 모든 페이지의 평점 목록을 하나의 배열로 병합
  const ratings = data?.pages.flatMap(page => page.ratings || []) || [];

  // 첫 페이지의 총 평점 수 데이터
  const totalRatings = data?.pages[0]?.total || 0;

  return {
    ratings,
    totalRatings,
    currentPage: data?.pages?.length || 1,
    totalPages: data?.pages[0]?.totalPages || 0,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
}
