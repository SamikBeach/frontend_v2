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
    <Link href={`/library/${library.id}`}>
      <div
        className={`cursor-pointer rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:bg-gray-100 ${className}`}
      >
        <div className="mb-2 flex items-center gap-3">
          {library.thumbnail ? (
            <div className="h-10 w-10 overflow-hidden rounded-lg">
              <img
                src={library.thumbnail}
                alt={library.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
              <BookOpen className="h-5 w-5" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900 transition-colors duration-150 hover:text-blue-600">
              {library.name}
            </h3>
            <div className="flex items-center gap-2">
              <Avatar className="h-4 w-4 border-0">
                <AvatarImage
                  src={library.owner.avatar}
                  alt={library.owner.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-[8px]">
                  {library.owner.name[0]}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-gray-500">{library.owner.name}</p>
            </div>
          </div>
        </div>

        {library.description && (
          <p className="mb-2 line-clamp-2 text-sm text-gray-600">
            {library.description}
          </p>
        )}

        {library.tags && library.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {library.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="rounded-full border-gray-200 bg-white px-2 py-0 text-xs font-normal text-gray-600"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-gray-400" />
              <span>{library.subscriberCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-gray-400" />
              <span>{library.bookCount}권</span>
            </div>
          </div>
          {library.isSubscribed && (
            <Badge
              variant="outline"
              className="rounded-full border-blue-200 bg-blue-50 px-2 py-0 text-[10px] font-normal text-blue-600"
            >
              구독 중
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
