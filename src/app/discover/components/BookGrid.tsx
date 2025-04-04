'use client';

import { useState } from 'react';

import { Book, BookCard } from '@/components/BookCard';
import { useSortedBooks } from '@/components/SortDropdown';

interface BookGridProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export function BookGrid({ books, onSelectBook }: BookGridProps) {
  // 현재 선택된 정렬 상태
  const [selectedSort, setSelectedSort] = useState<string>('reviews-desc');

  // 정렬된 책 목록
  const sortedBooks = useSortedBooks(books, selectedSort);

  return (
    <div>
      {/* 도서 그리드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {sortedBooks.map(book => (
          <BookCard key={book.id} book={book} onClick={onSelectBook} />
        ))}
      </div>

      {/* 결과가 없을 때 */}
      {sortedBooks.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-gray-50 py-16 text-center">
          <div className="text-3xl">📚</div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            도서가 없습니다
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            다른 컬렉션을 선택해보세요.
          </p>
        </div>
      )}
    </div>
  );
}
