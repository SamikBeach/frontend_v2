import { BooksManagementTabProps } from '../types';
import { BookSearchSection } from './BookSearchSection';
import { CategoryBooksSection } from './CategoryBooksSection';

export function BooksManagementTab({ open }: BooksManagementTabProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden lg:grid lg:grid-cols-2 lg:divide-x lg:divide-gray-100">
      <CategoryBooksSection open={open} />
      <BookSearchSection open={open} />
    </div>
  );
}
