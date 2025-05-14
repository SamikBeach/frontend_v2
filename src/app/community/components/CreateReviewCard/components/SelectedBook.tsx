import { ReadingStatusType } from '@/apis/reading-status';
import { SearchResult } from '@/apis/search/types';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { cn } from '@/lib/utils';
import { ChevronDown, Star, X } from 'lucide-react';

// 읽기 상태 텍스트 및 아이콘 정의
const statusTexts = {
  [ReadingStatusType.WANT_TO_READ]: '읽고 싶어요',
  [ReadingStatusType.READING]: '읽는 중',
  [ReadingStatusType.READ]: '읽었어요',
  NONE: '선택 안함',
};

// 읽기 상태 아이콘
const statusIcons = {
  [ReadingStatusType.WANT_TO_READ]: '📚',
  [ReadingStatusType.READING]: '📖',
  [ReadingStatusType.READ]: '✅',
  NONE: '❌',
};

interface SelectedBookProps {
  selectedBook: SearchResult;
  rating: number;
  handleRatingChange: (rating: number) => void;
  handleRemoveSelectedBook: () => void;
  readingStatus: ReadingStatusType | null;
  setReadingStatus: (status: ReadingStatusType | null) => void;
}

export function SelectedBook({
  selectedBook,
  rating,
  handleRatingChange,
  handleRemoveSelectedBook,
  readingStatus,
  setReadingStatus,
}: SelectedBookProps) {
  // 읽기 상태별 스타일 반환
  const getReadingStatusStyle = (status: ReadingStatusType | null) => {
    if (!status) {
      return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
    }

    switch (status) {
      case ReadingStatusType.WANT_TO_READ:
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      case ReadingStatusType.READING:
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case ReadingStatusType.READ:
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="mt-3 mb-3 space-y-3">
      <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-3">
        <img
          src={selectedBook.image || selectedBook.coverImage}
          alt={selectedBook.title}
          className="h-16 w-12 rounded object-cover"
        />
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">{selectedBook.title}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full p-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              onClick={handleRemoveSelectedBook}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500">{selectedBook.author}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-2">
        <div className="flex flex-grow items-center">
          <span className="mr-1 text-sm font-medium text-gray-700">별점:</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`h-5 w-5 cursor-pointer ${
                  star <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
                onClick={() => handleRatingChange(star)}
              />
            ))}
          </div>
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              {rating === 1
                ? '별로예요'
                : rating === 2
                  ? '아쉬워요'
                  : rating === 3
                    ? '보통이에요'
                    : rating === 4
                      ? '좋아요'
                      : '최고예요'}
            </span>
          )}
        </div>

        {/* 읽기 상태 드롭다운 버튼 */}
        <ResponsiveDropdownMenu>
          <ResponsiveDropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'h-8 rounded-full border-gray-300 px-3 text-xs',
                getReadingStatusStyle(readingStatus)
              )}
            >
              <span className="mr-1">
                {readingStatus ? statusIcons[readingStatus] : statusIcons.NONE}
              </span>
              {readingStatus ? statusTexts[readingStatus] : statusTexts.NONE}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </ResponsiveDropdownMenuTrigger>
          <ResponsiveDropdownMenuContent className="min-w-48 rounded-xl">
            {Object.values(ReadingStatusType).map(status => (
              <ResponsiveDropdownMenuItem
                key={status}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2',
                  readingStatus === status ? 'bg-gray-100' : '',
                  status === ReadingStatusType.WANT_TO_READ &&
                    'hover:bg-purple-50',
                  status === ReadingStatusType.READING && 'hover:bg-blue-50',
                  status === ReadingStatusType.READ && 'hover:bg-green-50'
                )}
                onSelect={() => setReadingStatus(status)}
              >
                <span className="text-base">{statusIcons[status]}</span>
                <span
                  className={cn(
                    status === ReadingStatusType.WANT_TO_READ &&
                      'text-purple-600',
                    status === ReadingStatusType.READING && 'text-blue-600',
                    status === ReadingStatusType.READ && 'text-green-600'
                  )}
                >
                  {statusTexts[status]}
                </span>
              </ResponsiveDropdownMenuItem>
            ))}

            {/* 선택 안함 옵션 */}
            <ResponsiveDropdownMenuItem
              key="none"
              className={cn(
                'mt-1 flex cursor-pointer items-center gap-2 rounded-lg border-t px-3 py-2',
                readingStatus === null ? 'bg-gray-100' : '',
                'hover:bg-red-50'
              )}
              onSelect={() => setReadingStatus(null)}
            >
              <span className="text-base">{statusIcons.NONE}</span>
              <span className="text-red-600">{statusTexts.NONE}</span>
            </ResponsiveDropdownMenuItem>
          </ResponsiveDropdownMenuContent>
        </ResponsiveDropdownMenu>
      </div>
    </div>
  );
}
