import { Star } from 'lucide-react';

import { BookDetails } from './types';

interface SimilarBooksProps {
  similarBooks: BookDetails['similarBooks'];
}

export function SimilarBooks({ similarBooks = [] }: SimilarBooksProps) {
  if (similarBooks.length === 0) return null;

  return (
    <div className="mt-10 space-y-3">
      <p className="text-sm font-medium text-gray-900">이런 책은 어떠세요?</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {similarBooks.map(book => (
          <div key={book.id} className="group cursor-pointer overflow-hidden">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-gray-50">
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h4 className="mt-2 line-clamp-1 text-sm font-medium group-hover:text-blue-600">
              {book.title}
            </h4>
            <p className="line-clamp-1 text-xs text-gray-500">{book.author}</p>
            {book.rating && (
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                {book.rating.toFixed(1)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
