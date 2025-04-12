import { getAllPopularBooks } from '@/apis/book/book';
import { Book, PopularBooksParams, SortOption } from '@/apis/book/types';
import { selectedBookIdAtom } from '@/atoms/book';
import {
  categoryFilterAtom,
  sortOptionAtom,
  subcategoryFilterAtom,
  timeRangeAtom,
} from '@/atoms/popular';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { useDialogQuery, useQueryParams } from '@/hooks';
import { isValidSortOption } from '@/utils/type-guards';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';

export function BooksContent() {
  const { clearQueryParams } = useQueryParams();
  const categoryParam = useAtomValue(categoryFilterAtom);
  const subcategoryParam = useAtomValue(subcategoryFilterAtom);
  const sortParamRaw = useAtomValue(sortOptionAtom);
  const timeRangeParam = useAtomValue(timeRangeAtom);
  const [selectedBookId, setSelectedBookId] = useAtom(selectedBookIdAtom);
  const { open: openBookDialog } = useDialogQuery({ type: 'book' });

  // 타입 가드를 사용하여 안전하게 처리
  const sortParam: SortOption = isValidSortOption(sortParamRaw)
    ? sortParamRaw
    : 'reviews-desc';

  // 도서 데이터 가져오기
  const { data: books } = useSuspenseQuery({
    queryKey: [
      'popular-books',
      categoryParam,
      subcategoryParam,
      sortParam,
      timeRangeParam,
    ],
    queryFn: async () => {
      // API 요청 시 필요한 파라미터 구성
      const params: PopularBooksParams = {
        sort: sortParam,
        timeRange: timeRangeParam,
      };

      // 추가 파라미터 (PopularBooksParams에는 없지만 API에서는 지원하는 파라미터)
      type ExtendedParams = PopularBooksParams & {
        category?: string;
        subcategory?: string;
      };

      const extendedParams: ExtendedParams = params;

      if (categoryParam !== 'all') {
        extendedParams.category = categoryParam;
      }

      if (subcategoryParam && subcategoryParam !== 'all') {
        extendedParams.subcategory = subcategoryParam;
      }

      return getAllPopularBooks(extendedParams);
    },
    staleTime: 1000 * 60 * 2, // 2분 동안 캐시 유지
  });

  const handleBookSelect = (book: Book) => {
    setSelectedBookId(book.id.toString());
    openBookDialog(book.id);
  };

  const handleClearFilters = () => {
    clearQueryParams();
  };

  return (
    <>
      {books && books.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {books.map(book => (
            <BookCard key={book.id} book={book} onClick={handleBookSelect} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-gray-50 py-12 text-center">
          <div className="text-3xl">📚</div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            검색 결과가 없습니다
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            다른 카테고리를 선택하거나 필터를 초기화해보세요.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={handleClearFilters}
          >
            필터 초기화
          </Button>
        </div>
      )}
    </>
  );
}
