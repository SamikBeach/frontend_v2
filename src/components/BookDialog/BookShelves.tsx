import { BookOpen, Users } from 'lucide-react';

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
            className="cursor-pointer overflow-hidden rounded-xl bg-[#F9FAFB] p-4 transition-all duration-200 hover:bg-[#F2F4F6]"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="h-8 w-8 overflow-hidden rounded-lg">
                <img
                  src={shelf.thumbnail}
                  alt={shelf.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-[15px] font-medium text-gray-900 transition-colors duration-150 hover:text-[#3182F6]">
                  {shelf.name}
                </h3>
                <p className="text-xs text-gray-500">{shelf.owner}</p>
              </div>
            </div>

            {/* 책 이미지 샘플 - 5개로 변경 */}
            <div className="mb-3 grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map(index => (
                <div key={index} className="overflow-hidden rounded-lg">
                  <div className="relative aspect-[2/3] w-full">
                    <img
                      src={`https://picsum.photos/seed/book${shelf.id}${index}/120/180`}
                      alt="책 이미지"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-gray-400" />
                  <span>{shelf.followers}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                  <span>{shelf.bookCount}권</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
