import {
  getAllDiscoverBooks,
  getBooksByDiscoverCategoryId,
} from '@/apis/book/book';
import {
  Book,
  PopularBooksParams,
  SortOption,
  TimeRange,
} from '@/apis/book/types';
import {
  discoverCategoryFilterAtom,
  discoverSortOptionAtom,
  discoverSubcategoryFilterAtom,
  discoverTimeRangeAtom,
} from '@/atoms/discover';
import { isValidSortOption, isValidTimeRange } from '@/utils/type-guards';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

/**
 * 발견하기 도서 목록을 가져오는 훅
 */
export function useDiscoverBooks() {
  const categoryParam = useAtomValue(discoverCategoryFilterAtom);
  const subcategoryParam = useAtomValue(discoverSubcategoryFilterAtom);
  const sortParamRaw = useAtomValue(discoverSortOptionAtom);
  const timeRangeParam = useAtomValue(discoverTimeRangeAtom);

  // 타입 가드를 사용하여 안전하게 처리
  const sortParam: SortOption = isValidSortOption(sortParamRaw)
    ? sortParamRaw
    : 'reviews-desc';

  // 도서 데이터 가져오기
  const { data: books } = useSuspenseQuery<Book[]>({
    queryKey: [
      'discover-books',
      categoryParam,
      subcategoryParam,
      sortParam,
      timeRangeParam,
    ],
    queryFn: async () => {
      // API 요청 시 필요한 파라미터 구성
      const timeRange: TimeRange = isValidTimeRange(timeRangeParam)
        ? timeRangeParam
        : 'all';

      // 카테고리가 선택되지 않은 경우 (all)
      if (categoryParam === 'all') {
        const params: PopularBooksParams = {
          sort: sortParam,
          timeRange,
        };
        return getAllDiscoverBooks(params);
      }

      // 카테고리만 선택된 경우
      const categoryId = parseInt(categoryParam);
      if (subcategoryParam === 'all') {
        return getBooksByDiscoverCategoryId(
          categoryId,
          undefined,
          sortParam,
          timeRange
        );
      }

      // 카테고리와 서브카테고리 모두 선택된 경우
      const subcategoryId = parseInt(subcategoryParam);
      return getBooksByDiscoverCategoryId(
        categoryId,
        subcategoryId,
        sortParam,
        timeRange
      );
    },
    staleTime: 1000 * 60 * 2, // 2분 동안 캐시 유지
  });

  return { books: books || [] };
}
