'use client';

import { useState } from 'react';

import { Book } from '@/components/BookCard';
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
          <div
            key={book.id}
            className="cursor-pointer"
            onClick={() => onSelectBook(book)}
          >
            <div className="group h-full rounded-xl bg-[#F9FAFB] transition-all hover:bg-[#F2F4F6]">
              <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl">
                <img
                  src={`https://picsum.photos/seed/${book.id}/240/360`}
                  alt={book.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <h3 className="line-clamp-1 text-[15px] font-medium text-gray-900 group-hover:text-[#3182F6]">
                  {book.title}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-[13px] text-gray-500">
                  {book.author}
                </p>
              </div>
            </div>
          </div>
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
