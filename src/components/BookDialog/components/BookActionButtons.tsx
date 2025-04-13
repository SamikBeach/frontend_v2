import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ListPlus } from 'lucide-react';
import { useBookDetails, useBookshelf, useReadingStatus } from '../hooks';

export function BookActionButtons() {
  const { defaultBookshelves } = useBookDetails();
  const { readingStatus, handleReadingStatusChange, getReadingStatusStyle } =
    useReadingStatus();
  const { handleAddToBookshelf } = useBookshelf(null, null, defaultBookshelves);

  return (
    <div className="grid grid-cols-2 gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-between rounded-full border-gray-300 hover:bg-gray-100 hover:text-gray-900 ${getReadingStatusStyle(readingStatus)}`}
          >
            <span>{readingStatus || '책 상태 설정'}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 rounded-xl">
          <DropdownMenuItem
            className="cursor-pointer rounded-lg py-2 hover:bg-blue-50 hover:text-blue-600"
            onClick={() => handleReadingStatusChange('읽고 싶어요')}
          >
            읽고 싶어요
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer rounded-lg py-2 hover:bg-green-50 hover:text-green-600"
            onClick={() => handleReadingStatusChange('읽는 중')}
          >
            읽는 중
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer rounded-lg py-2 hover:bg-purple-50 hover:text-purple-600"
            onClick={() => handleReadingStatusChange('읽었어요')}
          >
            읽었어요
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer rounded-lg py-2"
            onClick={() => handleReadingStatusChange('선택 안함')}
          >
            선택 안함
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full rounded-full border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <ListPlus className="mr-1.5 h-4 w-4" />
            <span className="text-sm">서재에 담기</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 rounded-xl">
          {defaultBookshelves.map(shelf => (
            <DropdownMenuItem
              key={shelf.id}
              className="cursor-pointer rounded-lg py-2"
              onClick={() => handleAddToBookshelf(shelf.id)}
            >
              {shelf.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem className="cursor-pointer rounded-lg py-2">
            + 새 서재 만들기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
