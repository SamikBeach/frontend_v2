import { SearchResult } from '@/apis/search/types';
import { Button } from '@/components/ui/button';
import { Star, X } from 'lucide-react';

interface SelectedBookProps {
  selectedBook: SearchResult;
  rating: number;
  handleRatingChange: (rating: number) => void;
  handleRemoveSelectedBook: () => void;
}

export function SelectedBook({
  selectedBook,
  rating,
  handleRatingChange,
  handleRemoveSelectedBook,
}: SelectedBookProps) {
  return (
    <div className="mt-3 space-y-3">
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

      <div className="flex items-center gap-1 px-2">
        <span className="text-sm font-medium text-gray-700">별점:</span>
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
    </div>
  );
}
