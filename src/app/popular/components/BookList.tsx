import { getPopularBooks } from '@/apis/book/book';
import { Book, BookSearchResponse } from '@/apis/book/types';
import { selectedBookIdAtom } from '@/atoms/book';
import {
  categoryFilterAtom,
  sortOptionAtom,
  subcategoryFilterAtom,
  timeRangeAtom,
} from '@/atoms/popular';
import { BookCard } from '@/components/BookCard';
import { useQueryParams } from '@/hooks';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';

interface BookListProps {
  className?: string;
}

export function BookList({ className }: BookListProps) {
  const { updateQueryParams } = useQueryParams();
  const categoryParam = useAtomValue(categoryFilterAtom);
  const subcategoryParam = useAtomValue(subcategoryFilterAtom);
  const sortParam = useAtomValue(sortOptionAtom);
  const timeRangeParam = useAtomValue(timeRangeAtom);
  const setSelectedBookId = useSetAtom(selectedBookIdAtom);

  // 도서 데이터 가져오기
  const { data } = useSuspenseQuery<BookSearchResponse>({
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

      return getPopularBooks(params as any);
    },
    staleTime: 1000 * 60 * 2, // 2분 동안 캐시 유지
  });

  const books = data?.books || [];

  const handleBookSelect = (book: Book) => {
    setSelectedBookId(book.id.toString());
    updateQueryParams({ book: book.id.toString() });
  };

  if (books.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${className || ''}`}
    >
      {books.map((book: Book) => (
        <BookCard key={book.id} book={book} onClick={handleBookSelect} />
      ))}
    </div>
  );
}
