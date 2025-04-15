import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useBookDetails } from './hooks';

// BookInfo 스켈레톤 컴포넌트
export function BookInfoSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Skeleton className="h-5 w-24 rounded" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Skeleton className="h-5 w-24 rounded" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>
    </div>
  );
}

export function BookInfo() {
  const { book } = useBookDetails();
  const [expanded, setExpanded] = useState(false);

  if (!book) return null;

  const bookDescription = book.description || '책 설명이 없습니다.';
  const authorDescription = book.authorInfo || '저자 정보가 없습니다.';

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-800">책 소개</h3>
        <div
          className={`mt-1 text-sm whitespace-pre-line text-gray-700 ${expanded ? '' : 'line-clamp-4'}`}
        >
          {bookDescription}
        </div>
        {bookDescription.split('\n').length > 4 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 h-auto p-0 text-xs text-gray-500 hover:bg-transparent hover:text-gray-700"
            onClick={toggleExpand}
          >
            {expanded ? '접기' : '더 보기'}
            <ChevronDown
              className={`ml-1 h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </Button>
        )}
      </div>

      {authorDescription && (
        <div>
          <h3 className="text-sm font-medium text-gray-800">저자 소개</h3>
          <p className="mt-1 text-sm whitespace-pre-line text-gray-700">
            {authorDescription}
          </p>
        </div>
      )}
    </div>
  );
}
