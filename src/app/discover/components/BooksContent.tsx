import { Book } from '@/apis/book/types';
import { useDiscoverBooks } from '@/app/discover/hooks';
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

export function BooksContent() {
  const { clearQueryParams } = useQueryParams();
  const categoryParam = useAtomValue(discoverCategoryFilterAtom);
  const subcategoryParam = useAtomValue(discoverSubcategoryFilterAtom);
  const sortParam = useAtomValue(discoverSortOptionAtom);
  const timeRangeParam = useAtomValue(discoverTimeRangeAtom);
  const [selectedBookId, setSelectedBookId] = useAtom(selectedBookIdAtom);

  // 도서 데이터 가져오기
  const { books } = useDiscoverBooks();

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
