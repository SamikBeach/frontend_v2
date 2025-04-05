'use client';

import { CommandGroup } from '@/components/ui/command';
import { AuthorItem } from './AuthorItem';
import { BookItem } from './BookItem';

interface SearchResultListProps {
  books: any[];
  authors: any[];
  onOpenChange: (open: boolean) => void;
  searchValue: string;
}

export function SearchResultList({
  books,
  authors,
  onOpenChange,
  searchValue,
}: SearchResultListProps) {
  return (
    <>
      {books.length > 0 && (
        <CommandGroup heading="도서">
          {books.map(book => (
            <BookItem
              key={book.id}
              book={book}
              onOpenChange={onOpenChange}
              onClick={() => console.log('책 선택:', book.id)}
              searchValue={searchValue}
            />
          ))}
        </CommandGroup>
      )}

      {authors.length > 0 && (
        <CommandGroup heading="작가">
          {authors.map(author => (
            <AuthorItem
              key={author.id}
              author={author}
              onOpenChange={onOpenChange}
              onClick={() => console.log('작가 선택:', author.id)}
              searchValue={searchValue}
            />
          ))}
        </CommandGroup>
      )}
    </>
  );
}
