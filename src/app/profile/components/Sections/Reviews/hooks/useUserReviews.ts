import { ReviewResponseDto, ReviewType } from '@/apis/review/types';
import { getUserReviews } from '@/apis/user/user';
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useParams } from 'next/navigation';

interface UseUserReviewsResult {
  reviews: ReviewResponseDto[];
  isLoading: boolean;
  error: Error | null;
  totalReviews: number;
  currentPage: number;
  totalPages: number;
  fetchNextPage: () => Promise<any>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

/**
 * 사용자 리뷰를 로드하는 훅 (페이지네이션 방식)
 */
export function useUserReviews(
  page: number = 1,
  limit: number = 10
): Omit<
  UseUserReviewsResult,
  'fetchNextPage' | 'hasNextPage' | 'isFetchingNextPage'
> {
  const params = useParams();
  const userId = Number(params.id);

  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: ['user-reviews', userId, page, limit],
    queryFn: async () => {
      return getUserReviews(userId, page, limit);
    },
  });

  return {
    reviews: data?.reviews || [],
    isLoading,
    error: error as Error | null,
    totalReviews: data?.total || 0,
    currentPage: page,
    totalPages: data?.totalPages || 0,
  };
}

/**
 * 사용자의 리뷰를 로드하는 훅 (무한 스크롤 방식) - Suspense와 함께 사용
 * @param limit 페이지당 항목 수
 * @param reviewTypes 리뷰 타입 배열 (비어있을 경우 모든 타입 반환)
 */
export function useUserReviewsInfinite(
  limit: number = 10,
  reviewTypes?: ReviewType[]
): Omit<UseUserReviewsResult, 'isLoading' | 'error'> {
  const params = useParams();
  const userId = Number(params.id);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['user-reviews-infinite', userId, limit, reviewTypes],
      queryFn: async ({ pageParam = 1 }) => {
        // API 호출 - reviewTypes 그대로 전달
        const result = await getUserReviews(
          userId,
          pageParam,
          limit,
          reviewTypes
        );

        // 페이지 정보 계산
        const totalPages = result.totalPages || Math.ceil(result.total / limit);
        const hasMore = pageParam < totalPages && result.reviews.length > 0;

        return {
          ...result,
          reviews: result.reviews,
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

  // 모든 페이지의 리뷰 목록을 하나의 배열로 병합
  const reviews = data?.pages.flatMap(page => page.reviews || []) || [];

  // 첫 페이지의 총 리뷰 수 데이터
  const totalReviews = data?.pages[0]?.total || 0;

  return {
    reviews,
    totalReviews,
    currentPage: data?.pages?.length || 1,
    totalPages: data?.pages[0]?.totalPages || 0,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
}
