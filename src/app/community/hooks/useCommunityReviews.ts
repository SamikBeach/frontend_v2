import { getReviews } from '@/apis/review/review';
import { ReviewType } from '@/apis/review/types';
import {
  communitySortOptionAtom,
  communityTypeFilterAtom,
} from '@/atoms/community';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

// 'review'를 제외한 모든 리뷰 타입
const ALL_COMMUNITY_TYPES: ReviewType[] = [
  'general',
  'discussion',
  'question',
  'meetup',
];

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
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['communityReviews', sortOption, typeFilter, limit],
    queryFn: async ({ pageParam = 1 }) => {
      // 타입 필터 처리
      let typeParam: ReviewType | ReviewType[] | undefined;

      if (typeFilter === 'all') {
        // '전체' 선택 시 'review'를 제외한 모든 타입 전달
        typeParam = ALL_COMMUNITY_TYPES;
      } else {
        // 특정 타입 선택 시 해당 타입만 전달
        typeParam = typeFilter as ReviewType;
      }

      // filter 값을 백엔드에 전달 (recent, popular, following)
      const filter = sortOption === 'latest' ? 'recent' : sortOption;

      // getReviews 함수 사용
      const result = await getReviews(pageParam, limit, filter, typeParam);

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
    isLoading,
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
