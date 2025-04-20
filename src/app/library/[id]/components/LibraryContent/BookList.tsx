import { Book } from '@/apis/book/types';
import { LibraryListItem } from '@/apis/library/types';
import { useState } from 'react';
import { BookItem } from './BookItem';

interface BookListProps {
  books: Book[];
  isOwner: boolean;
  libraryId: number;
  userLibraries: LibraryListItem[];
  isLoadingLibraries: boolean;
  onMoveBook: (bookId: number, targetLibraryId: number) => void;
  onDeleteBook: (bookId: number, title: string) => void;
  onBookClick: (book: Book) => void;
}

export function BookList({
  books,
  isOwner,
  libraryId,
  userLibraries,
  isLoadingLibraries,
  onMoveBook,
  onDeleteBook,
  onBookClick,
}: BookListProps) {
  // 개별 책의 드롭다운 상태를 관리하기 위한 Set
  const [openDropdownIds, setOpenDropdownIds] = useState<Set<number>>(
    new Set()
  );

  if (books.length === 0) {
    return (
      <div className="col-span-full py-8 text-center">
        <p className="text-gray-500">아직 추가된 책이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      {books.map(book => (
        <BookItem
          key={book.id}
          book={book}
          isOwner={isOwner}
          libraryId={libraryId}
          isDropdownOpen={openDropdownIds.has(book.id)}
          onDropdownOpenChange={(open: boolean) => {
            setOpenDropdownIds(prev => {
              const newSet = new Set(prev);
              if (open) {
                newSet.add(book.id);
              } else {
                newSet.delete(book.id);
              }
              return newSet;
            });
          }}
          onMoveBook={(targetLibraryId: number) => {
            onMoveBook(book.id, targetLibraryId);
            // 드롭다운 닫기
            setOpenDropdownIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(book.id);
              return newSet;
            });
          }}
          onDeleteBook={() => {
            onDeleteBook(book.id, book.title);
            // 드롭다운 닫기
            setOpenDropdownIds(prev => {
              const newSet = new Set(prev);
              newSet.delete(book.id);
              return newSet;
            });
          }}
          onBookClick={onBookClick}
          userLibraries={userLibraries}
          isLoadingLibraries={isLoadingLibraries}
        />
      ))}
    </>
  );
}
