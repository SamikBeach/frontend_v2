import { Book } from '@/apis/book/types';
import { BookCard } from '@/components/BookCard';

interface BookGridProps {
  books: Array<{
    id: number;
    title: string;
    author: string;
    coverImage: string;
    isbn?: string;
    isbn13?: string;
    publisher?: string;
    rating?: number;
    reviews?: number;
    totalRatings?: number;
  }>;
  onBookSelect: (book: Book) => void;
}

export function BookGrid({ books, onBookSelect }: BookGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {books.map(book => {
        // BookCard에 필요한 최소한의 필드만 전달
        const bookData: Partial<Book> = {
          id: book.id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage,
          rating: book.rating || 0,
          reviews: book.reviews || 0,
          isbn: book.isbn || '',
          description: '',
          publisher: book.publisher || '',
        };

        // 추가 필드 적용
        if (book.totalRatings !== undefined) {
          (bookData as any).totalRatings = book.totalRatings;
        }

        if (book.isbn13) {
          bookData.isbn13 = book.isbn13;
        }

        return (
          <BookCard
            key={book.id}
            book={bookData as Book}
            onClick={onBookSelect}
          />
        );
      })}
    </div>
  );
}
