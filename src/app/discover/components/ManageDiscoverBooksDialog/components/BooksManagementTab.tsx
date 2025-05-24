import { BooksManagementTabProps } from '../types';
import { BookSearchSection } from './BookSearchSection';
import { CategoryBooksSection } from './CategoryBooksSection';

export function BooksManagementTab({ open }: BooksManagementTabProps) {
  return (
    <div className="grid h-full grid-cols-1 overflow-hidden lg:grid-cols-2 lg:divide-x lg:divide-gray-100">
      <CategoryBooksSection open={open} />
      <BookSearchSection open={open} />
    </div>
  );
}
