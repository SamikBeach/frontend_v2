import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

// 컴팩트 서재 카드를 위한 타입 정의
export interface CompactLibraryProps {
  id: number;
  name: string;
  description?: string;
  thumbnail?: string;
  tags?: string[];
  owner: {
    id: number;
    username: string;
    name: string;
    avatar?: string;
  };
  subscriberCount: number;
  bookCount: number;
  isSubscribed?: boolean;
  books?: {
    id: number;
    title: string;
    author: string;
    coverImage: string;
  }[];
}

export interface CompactLibraryCardProps {
  library: CompactLibraryProps;
  className?: string;
}

export function CompactLibraryCard({
  library,
  className = '',
}: CompactLibraryCardProps) {
  return (
    <Link href={`/library/${library.id}`} className="block w-full">
      <div
        className={`flex h-full cursor-pointer flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-none transition-all duration-200 hover:border-gray-200 ${className}`}
      >
        <div className="mb-2.5 flex items-start gap-3">
          {library.thumbnail ? (
            <div className="h-14 w-14 overflow-hidden rounded-lg border border-gray-100">
              <img
                src={library.thumbnail}
                alt={library.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-400">
              <BookOpen className="h-6 w-6" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900 transition-colors duration-150 hover:text-blue-600">
              {library.name}
            </h3>

            {/* 태그를 제목 아래로 이동, 모든 태그 표시 */}
            {library.tags && library.tags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {library.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="rounded-full bg-gray-50 px-2 py-0.5 text-xs font-normal text-gray-700"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-1.5 flex items-center gap-2">
              <Avatar className="h-5 w-5 border border-gray-50">
                <AvatarImage
                  src={library.owner.avatar}
                  alt={library.owner.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-50 text-[10px] text-gray-700">
                  {library.owner.name[0]}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-500">{library.owner.name}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {library.description && (
            <p className="mb-3 line-clamp-1 text-sm text-gray-600">
              {library.description}
            </p>
          )}

          {library.books && library.books.length === 0 && (
            <div className="mb-3 flex w-full flex-1 items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
              <p className="text-sm text-gray-400">아직 등록된 책이 없어요.</p>
            </div>
          )}
        </div>

        <div className="mt-0 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <span>{library.bookCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gray-400" />
              <span>{library.subscriberCount.toLocaleString()}</span>
            </div>
          </div>
          {library.isSubscribed && (
            <Badge
              variant="outline"
              className="rounded-full border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600"
            >
              구독 중
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
