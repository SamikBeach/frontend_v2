import {
  getAllDiscoverBooks,
  getBooksByDiscoverCategoryId,
} from '@/apis/book/book';
import {
  Book,
  PopularBooksParams,
  PopularBooksSortOptions,
  TimeRangeOptions,
} from '@/apis/book/types';
import { isValidSortOption, isValidTimeRange } from '@/utils/type-guards';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 숫자로 안전하게 파싱하는 헬퍼 함수
 * 숫자로 변환될 수 없는 경우 undefined 반환
 */
const safeParseInt = (value: string): number | undefined => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
};

interface UseDiscoverBooksParams {
  category?: string;
  subcategory?: string;
  sort?: string;
  timeRange?: string;
}

/**
 * 발견하기 도서 목록을 가져오는 훅
 */
export function useDiscoverBooks(params?: UseDiscoverBooksParams) {
  const categoryParam = params?.category || 'all';
  const subcategoryParam = params?.subcategory || 'all';
  const sortParamRaw = params?.sort || 'reviews-desc';
  const timeRangeParam = params?.timeRange || 'all';

  // 타입 가드를 사용하여 안전하게 처리
  const sortParam = isValidSortOption(sortParamRaw)
    ? sortParamRaw
    : PopularBooksSortOptions.REVIEWS_DESC;

  // 도서 데이터 가져오기
  const { data: books = [] } = useSuspenseQuery<Book[]>({
    queryKey: [
      'discover-books',
      categoryParam,
      subcategoryParam,
      sortParam,
      timeRangeParam,
    ],
    queryFn: async () => {
      // API 요청 시 필요한 파라미터 구성
      const timeRange = isValidTimeRange(timeRangeParam)
        ? timeRangeParam
        : TimeRangeOptions.ALL;

      // 카테고리가 선택되지 않은 경우 (all)
      if (categoryParam === 'all') {
        const params: PopularBooksParams = {
          sort: sortParam,
          timeRange,
        };
        return getAllDiscoverBooks(params);
      }

      // 카테고리 ID 파싱
      const categoryId = safeParseInt(categoryParam);
      if (!categoryId) {
        // 잘못된 카테고리 ID인 경우 전체 도서 반환
        return getAllDiscoverBooks({ sort: sortParam, timeRange });
      }

      // 서브카테고리가 'all'이거나 없는 경우
      if (subcategoryParam === 'all') {
        return getBooksByDiscoverCategoryId(
          categoryId,
          undefined,
          sortParam,
          timeRange
        );
      }

      // 서브카테고리 ID 파싱
      const subcategoryId = safeParseInt(subcategoryParam);

      // 카테고리와 서브카테고리 모두 선택된 경우
      return getBooksByDiscoverCategoryId(
        categoryId,
        subcategoryId,
        sortParam,
        timeRange
      );
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });

  return { books };
}
