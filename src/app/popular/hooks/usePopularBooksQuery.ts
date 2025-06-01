import { getPopularBooks } from '@/apis/book/book';
import {
  BookSearchResponse,
  PopularBooksParams,
  PopularBooksSortOptions,
  TimeRangeOptions,
} from '@/apis/book/types';
import {
  categoryFilterAtom,
  sortOptionAtom,
  subcategoryFilterAtom,
  timeRangeAtom,
} from '@/atoms/popular';
import { isValidSortOption } from '@/utils/type-guards';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

export function usePopularBooksQuery() {
  // Get filter values from atoms
  const categoryParam = useAtomValue(categoryFilterAtom);
  const subcategoryParam = useAtomValue(subcategoryFilterAtom);
  const sortParamRaw = useAtomValue(sortOptionAtom);
  const timeRangeParam = useAtomValue(timeRangeAtom);

  // 프로필 페이지와 동일한 페이지 크기 사용
  const PAGE_SIZE = 12;

  // 타입 가드를 사용하여 안전하게 처리
  const sortParam = isValidSortOption(sortParamRaw)
    ? sortParamRaw
    : PopularBooksSortOptions.RATING_DESC;

  // Parse category and subcategory IDs if they're not 'all'
  const categoryId =
    categoryParam !== 'all' ? parseInt(categoryParam, 10) : undefined;
  const subcategoryId =
    subcategoryParam !== 'all' ? parseInt(subcategoryParam, 10) : undefined;

  // Map legacy sort options to the new enum values if needed
  const getMappedSortParam = (sortValue: string): PopularBooksSortOptions => {
    switch (sortValue) {
      case 'library-desc':
        return PopularBooksSortOptions.LIBRARY_COUNT_DESC;
      case 'rating-desc':
        return PopularBooksSortOptions.RATING_DESC;
      case 'reviews-desc':
        return PopularBooksSortOptions.REVIEWS_DESC;
      case 'publishDate-desc':
        return PopularBooksSortOptions.PUBLISH_DATE_DESC;
      case 'title-asc':
        return PopularBooksSortOptions.TITLE_ASC;
      default:
        return PopularBooksSortOptions.RATING_DESC;
    }
  };

  // Query implementation - 프로필 페이지와 동일한 구조
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery<BookSearchResponse>({
      queryKey: [
        'popular-books',
        categoryId,
        subcategoryId,
        sortParam,
        timeRangeParam,
      ],
      queryFn: async ({ pageParam = 1 }) => {
        const params: PopularBooksParams = {
          categoryId,
          subcategoryId,
          sort: getMappedSortParam(sortParam),
          timeRange: timeRangeParam as TimeRangeOptions,
          page: pageParam as number,
          limit: PAGE_SIZE,
        };

        return getPopularBooks(params);
      },
      getNextPageParam: lastPage => {
        // 프로필 페이지와 동일한 로직
        return lastPage.page < lastPage.totalPages
          ? lastPage.page + 1
          : undefined;
      },
      initialPageParam: 1,
      // 프로필 페이지와 동일한 캐시 설정
      gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
      staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
    });

  // 프로필 페이지와 동일한 데이터 변환
  const books = useMemo(() => {
    return data?.pages.flatMap(page => page.books) || [];
  }, [data?.pages]);

  // 총 데이터 수는 첫 페이지의 total 값을 사용 (프로필 페이지와 동일)
  const total = data?.pages[0]?.total || 0;

  return {
    books,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    total,
  };
}
