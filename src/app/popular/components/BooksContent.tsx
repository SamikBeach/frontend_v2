import { getAllPopularBooks } from '@/apis/book/book';
import { Book } from '@/apis/book/types';
import { selectedBookIdAtom } from '@/atoms/book';
import {
  categoryFilterAtom,
  sortOptionAtom,
  subcategoryFilterAtom,
  timeRangeAtom,
} from '@/atoms/popular';
import { BookCard } from '@/components/BookCard';
import { BookDialog } from '@/components/BookDialog/BookDialog';
import { Button } from '@/components/ui/button';
import { useQueryParams } from '@/hooks';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useMemo } from 'react';

export function BooksContent() {
  const { clearQueryParams } = useQueryParams();
  const categoryParam = useAtomValue(categoryFilterAtom);
  const subcategoryParam = useAtomValue(subcategoryFilterAtom);
  const sortParam = useAtomValue(sortOptionAtom);
  const timeRangeParam = useAtomValue(timeRangeAtom);
  const [selectedBookId, setSelectedBookId] = useAtom(selectedBookIdAtom);

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
      const params: {
        sort?: string;
        timeRange?: string;
        category?: string;
        subcategory?: string;
      } = {};

      if (sortParam) params.sort = sortParam;
      if (timeRangeParam) params.timeRange = timeRangeParam;

      if (categoryParam !== 'all') {
        params.category = categoryParam;
      }

      if (subcategoryParam) {
        params.subcategory = subcategoryParam;
      }

      return getAllPopularBooks(params as any);
    },
    staleTime: 1000 * 60 * 2, // 2분 동안 캐시 유지
  });

  const handleBookSelect = (book: Book) => {
    setSelectedBookId(book.id.toString());
  };

  const handleClearFilters = () => {
    clearQueryParams();
  };

  // 선택된 책 찾기
  const selectedBook = useMemo(() => {
    if (!selectedBookId || !books) return null;

    const bookId = parseInt(selectedBookId);
    return books.find(book => book.id === bookId) || null;
  }, [books, selectedBookId]);

  // 다이얼로그 상태 변경 핸들러
  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      // 다이얼로그가 닫히면 URL에서 book 파라미터 제거
      if (!open) {
        setSelectedBookId(null); // 선택된 책 상태도 초기화
      }
    },
    [setSelectedBookId]
  );

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

      {selectedBook && (
        <BookDialog
          book={selectedBook}
          open={!!selectedBook}
          onOpenChange={handleDialogOpenChange}
        />
      )}
    </>
  );
}
