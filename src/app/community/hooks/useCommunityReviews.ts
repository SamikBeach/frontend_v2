import { getReviews } from '@/apis/review/review';
import { ReviewType } from '@/apis/review/types';
import {
  communitySortOptionAtom,
  communityTypeFilterAtom,
} from '@/atoms/community';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

/**
 * 커뮤니티 리뷰를 무한 스크롤로 불러오는 훅
 */
export const useCommunityReviews = (limit: number = 10) => {
  const typeFilter = useAtomValue(communityTypeFilterAtom);
  const sortOption = useAtomValue(communitySortOptionAtom);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useSuspenseInfiniteQuery({
    queryKey: ['communityReviews', sortOption, typeFilter, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const type =
        typeFilter !== 'all' ? (typeFilter as ReviewType) : undefined;
      const filter = sortOption === 'latest' ? 'recent' : sortOption;
      const result = await getReviews(pageParam, limit, filter, type);
      return {
        ...result,
        page: pageParam,
        hasNextPage: pageParam < result.totalPages,
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
  const totalPages = data?.pages[0]?.totalPages || 0;

  return {
    reviews,
    isError,
    error,
    totalReviews,
    totalPages,
    typeFilter,
    sortOption,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
