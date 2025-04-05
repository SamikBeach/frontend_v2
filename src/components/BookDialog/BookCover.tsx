import { Share2, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookDetails } from './types';

interface BookCoverProps {
  book: BookDetails;
}

export function BookCover({ book }: BookCoverProps) {
  return (
    <div className="space-y-6">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50">
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-xl font-semibold">{book.rating || 0}</span>
            {book.totalRatings && (
              <span className="text-sm text-gray-500">
                ({book.totalRatings}명)
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-gray-600 hover:bg-gray-50"
          >
            <Share2 className="mr-1.5 h-4 w-4" />
            공유
          </Button>
        </div>
        {book.tags && (
          <div className="flex flex-wrap gap-1.5">
            {book.tags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="rounded-2xl bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
            <p>저자</p>
            <p className="font-medium text-gray-900">{book.author}</p>
            {book.translator && (
              <>
                <p>역자</p>
                <p className="font-medium text-gray-900">{book.translator}</p>
              </>
            )}
            {book.publisher && (
              <>
                <p>출판사</p>
                <p className="font-medium text-gray-900">{book.publisher}</p>
              </>
            )}
            {book.publishDate && (
              <>
                <p>출간일</p>
                <p className="font-medium text-gray-900">{book.publishDate}</p>
              </>
            )}
            {book.pageCount && (
              <>
                <p>페이지</p>
                <p className="font-medium text-gray-900">{book.pageCount}쪽</p>
              </>
            )}
            {book.isbn && (
              <>
                <p>ISBN</p>
                <p className="font-medium text-gray-900">{book.isbn}</p>
              </>
            )}
          </div>
        </div>
        {book.readingStatus && (
          <div className="rounded-2xl bg-blue-50 p-4">
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
              <p>현재 읽는 중</p>
              <p className="font-medium text-gray-900">
                {book.readingStatus.currentReaders}명
              </p>
              <p>완독</p>
              <p className="font-medium text-gray-900">
                {book.readingStatus.completedReaders}명
              </p>
              <p>평균 독서 시간</p>
              <p className="font-medium text-gray-900">
                {book.readingStatus.averageReadingTime}
              </p>
              <p>난이도</p>
              <p className="font-medium text-gray-900">
                {book.readingStatus.difficulty === 'easy'
                  ? '쉬움'
                  : book.readingStatus.difficulty === 'medium'
                    ? '보통'
                    : '어려움'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
