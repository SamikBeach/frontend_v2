import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BookListHeaderProps {
  booksCount: number;
  isOwner: boolean;
  onAddBook: () => void;
}

export function BookListHeader({
  booksCount,
  isOwner,
  onAddBook,
}: BookListHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-lg font-medium text-gray-900">담긴 책</h2>
        <div className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-600">
          {booksCount}
        </div>
      </div>
      {isOwner && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 rounded-lg"
          onClick={onAddBook}
        >
          <Plus className="h-4 w-4" />
          <span>책 추가</span>
        </Button>
      )}
    </div>
  );
}
