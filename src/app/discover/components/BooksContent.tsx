import { Book } from '@/apis/book/types';
import { selectedBookIdAtom } from '@/atoms/book';
import {
  discoverCategoryFilterAtom,
  discoverSortOptionAtom,
  discoverSubcategoryFilterAtom,
  discoverTimeRangeAtom,
} from '@/atoms/discover';
import { BookCard } from '@/components/BookCard';
import { BookDialog } from '@/components/BookDialog/BookDialog';
import { Button } from '@/components/ui/button';
import { useQueryParams } from '@/hooks';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useMemo } from 'react';
import { useDiscoverBooks } from '../hooks/useDiscoverBooks';

export function BooksContent() {
  const { clearQueryParams } = useQueryParams();

  // Atom values
  const categoryFilter = useAtomValue(discoverCategoryFilterAtom);
  const subcategoryFilter = useAtomValue(discoverSubcategoryFilterAtom);
  const sortOption = useAtomValue(discoverSortOptionAtom);
  const timeRange = useAtomValue(discoverTimeRangeAtom);
  const [selectedBookId, setSelectedBookId] = useAtom(selectedBookIdAtom);

  // 도서 데이터 가져오기
  const { books } = useDiscoverBooks({
    category: categoryFilter,
    subcategory: subcategoryFilter,
    sort: sortOption,
    timeRange: timeRange,
  });

  // 도서 선택 핸들러
  const handleBookSelect = useCallback(
    (book: Book) => {
      setSelectedBookId(book.id.toString());
    },
    [setSelectedBookId]
  );

  // 필터 초기화 핸들러
  const handleClearFilters = useCallback(() => {
    clearQueryParams();
  }, [clearQueryParams]);

  // 선택된 도서 찾기 (메모이제이션)
  const selectedBook = useMemo(() => {
    if (!selectedBookId || !books.length) return null;
    return books.find(book => book.id.toString() === selectedBookId) || null;
  }, [books, selectedBookId]);

  // 다이얼로그 상태 변경 핸들러
  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setSelectedBookId(null);
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
          open={!!selectedBookId}
          onOpenChange={handleDialogOpenChange}
        />
      )}
    </>
  );
}
