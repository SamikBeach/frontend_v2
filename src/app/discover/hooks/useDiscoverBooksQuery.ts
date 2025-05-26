import { getDiscoverBooks } from '@/apis/book/book';
import {
  BookSearchResponse,
  DiscoverBooksParams,
  PopularBooksSortOptions,
  TimeRangeOptions,
} from '@/apis/book/types';
import {
  discoverCategoryFilterAtom,
  discoverSortOptionAtom,
  discoverSubcategoryFilterAtom,
  discoverTimeRangeAtom,
} from '@/atoms/discover';
import { isValidSortOption } from '@/utils/type-guards';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

export function useDiscoverBooksQuery(initialPageParam = 1, pageSize = 20) {
  // Get filter values from atoms
  const categoryParam = useAtomValue(discoverCategoryFilterAtom);
  const subcategoryParam = useAtomValue(discoverSubcategoryFilterAtom);
  const sortParamRaw = useAtomValue(discoverSortOptionAtom);
  const timeRangeParam = useAtomValue(discoverTimeRangeAtom);

  // 타입 가드를 사용하여 안전하게 처리
  const sortParam = isValidSortOption(sortParamRaw)
    ? sortParamRaw
    : PopularBooksSortOptions.REVIEWS_DESC;

  // Parse category and subcategory IDs if they're not 'all'
  const discoverCategoryId =
    categoryParam !== 'all' ? parseInt(categoryParam, 10) : undefined;
  const discoverSubCategoryId =
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
        return PopularBooksSortOptions.REVIEWS_DESC;
    }
  };

  // Query implementation
  const query = useInfiniteQuery<BookSearchResponse>({
    queryKey: [
      'discover-books-infinite',
      discoverCategoryId,
      discoverSubCategoryId,
      sortParam,
      timeRangeParam,
      pageSize,
    ],
    queryFn: async ({ pageParam }) => {
      const params: DiscoverBooksParams = {
        discoverCategoryId,
        discoverSubCategoryId,
        sort: getMappedSortParam(sortParam),
        timeRange: timeRangeParam as TimeRangeOptions,
        page: pageParam as number,
        limit: pageSize,
      };

      return getDiscoverBooks(params);
    },
    initialPageParam,
    getNextPageParam: lastPage => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  // Flatten pages into a single array of books
  const books = useMemo(() => {
    return query.data?.pages.flatMap(page => page.books) || [];
  }, [query.data?.pages]);

  // Determine if we have reached the end
  const hasNextPage = query.hasNextPage;

  return {
    ...query,
    books,
    hasNextPage,
    // 캐시된 데이터가 있으면 로딩 상태를 false로 처리
    isLoading: query.isLoading && !query.data,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
