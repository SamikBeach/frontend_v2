import { useRecentBooks } from '@/app/profile/hooks';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

// 독서 상태 정의
const readingStatuses = [
  { id: 'finished', name: '읽었어요', count: 42 },
  { id: 'reading', name: '읽고 있어요', count: 8 },
  { id: 'want', name: '읽고 싶어요', count: 23 },
];

export default function ProfileRecentBooks() {
  const { recentBooks = [], isLoading } = useRecentBooks();
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleStatusChange = (statusId: string) => {
    setSelectedStatus(statusId);
  };

  if (isLoading) {
    return <div>책 목록을 불러오는 중...</div>;
  }

  return (
    <div>
      {/* 독서 상태 필터 */}
      <div className="mb-6 flex gap-3">
        {readingStatuses.map(status => (
          <button
            key={status.id}
            className={cn(
              'flex h-8 cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium transition-all',
              selectedStatus === status.id
                ? 'border-blue-200 bg-blue-50 text-blue-600'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            )}
            onClick={() => handleStatusChange(status.id)}
          >
            <span>{status.name}</span>
            <span className="ml-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700">
              {status.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {recentBooks.map(book => (
          <div key={book.id} className="group cursor-pointer">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div className="mt-3">
              <h3 className="line-clamp-1 text-[15px] font-medium text-gray-900 group-hover:text-blue-600">
                {book.title}
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">{book.author}</p>
              <div className="mt-1 flex items-center">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(book.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-xs text-gray-500">
                  ({book.rating?.toFixed(1) || '0.0'})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
