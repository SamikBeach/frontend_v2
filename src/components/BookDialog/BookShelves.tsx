import { Bookmark, Users } from 'lucide-react';

import { BookDetails } from './types';

interface BookShelvesProps {
  bookshelves: BookDetails['bookshelves'];
}

export function BookShelves({ bookshelves = [] }: BookShelvesProps) {
  if (bookshelves.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-900">
        이 책이 등록된 서재 ({bookshelves.length})
      </p>
      <div className="grid grid-cols-1 gap-3">
        {bookshelves.map(shelf => (
          <div
            key={shelf.id}
            className="flex cursor-pointer items-center gap-4 rounded-2xl bg-gray-50 p-5 transition-colors hover:bg-gray-100"
          >
            <div className="h-20 w-20 overflow-hidden rounded-lg">
              <img
                src={shelf.thumbnail}
                alt={shelf.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-lg font-medium">{shelf.name}</p>
              <div className="flex items-center text-sm text-gray-500">
                <p>{shelf.owner}</p>
                <span className="mx-1.5">·</span>
                <div className="flex items-center">
                  <Bookmark className="mr-0.5 h-3.5 w-3.5" />
                  <span>{shelf.bookCount}권</span>
                </div>
                <span className="mx-1.5">·</span>
                <div className="flex items-center">
                  <Users className="mr-0.5 h-3.5 w-3.5" />
                  <span>{shelf.followers}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
