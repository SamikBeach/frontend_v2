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

export function usePopularBooksQuery(initialPageParam = 1, pageSize = 20) {
  // Get filter values from atoms
  const categoryParam = useAtomValue(categoryFilterAtom);
  const subcategoryParam = useAtomValue(subcategoryFilterAtom);
  const sortParamRaw = useAtomValue(sortOptionAtom);
  const timeRangeParam = useAtomValue(timeRangeAtom);

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

  // Query implementation
  const query = useSuspenseInfiniteQuery<BookSearchResponse>({
    queryKey: [
      'popular-books-infinite',
      categoryId,
      subcategoryId,
      sortParam,
      timeRangeParam,
      pageSize,
    ],
    queryFn: async ({ pageParam }) => {
      const params: PopularBooksParams = {
        categoryId,
        subcategoryId,
        sort: getMappedSortParam(sortParam),
        timeRange: timeRangeParam as TimeRangeOptions,
        page: pageParam as number,
        limit: pageSize,
      };

      return getPopularBooks(params);
    },
    initialPageParam,
    getNextPageParam: lastPage => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
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
  };
}
