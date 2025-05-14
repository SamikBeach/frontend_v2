import { Book } from '@/apis/book/types';
import { LibraryListItem } from '@/apis/library/types';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuSub,
  ResponsiveDropdownMenuSubContent,
  ResponsiveDropdownMenuSubTrigger,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { useCallback } from 'react';

interface BookItemProps {
  book: Book;
  isOwner: boolean;
  libraryId: number;
  isDropdownOpen: boolean;
  onDropdownOpenChange: (open: boolean) => void;
  onMoveBook: (targetLibraryId: number) => void;
  onDeleteBook: () => void;
  onBookClick: (book: Book) => void;
  userLibraries: LibraryListItem[];
  isLoadingLibraries: boolean;
}

export function BookItem({
  book,
  isOwner,
  libraryId,
  isDropdownOpen,
  onDropdownOpenChange,
  onMoveBook,
  onDeleteBook,
  onBookClick,
  userLibraries,
  isLoadingLibraries,
}: BookItemProps) {
  // Create a memoized handler for moving books
  const handleMoveBook = useCallback(
    (targetLibraryId: number) => {
      onMoveBook(targetLibraryId);
    },
    [onMoveBook]
  );

  return (
    <div className="group relative">
      <BookCard book={book} onClick={() => onBookClick(book)} />
      {isOwner && (
        <div className="absolute top-2 right-2 z-10">
          <ResponsiveDropdownMenu
            open={isDropdownOpen}
            onOpenChange={onDropdownOpenChange}
          >
            <ResponsiveDropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`bg-opacity-80 hover:bg-opacity-100 h-8 w-8 rounded-full bg-white p-1.5 ${
                  isDropdownOpen
                    ? 'visible'
                    : 'visible md:invisible md:group-hover:visible'
                }`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </ResponsiveDropdownMenuTrigger>
            <ResponsiveDropdownMenuContent align="end" className="w-48">
              <ResponsiveDropdownMenuSub>
                <ResponsiveDropdownMenuSubTrigger>
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                  <span>다른 서재로 옮기기</span>
                </ResponsiveDropdownMenuSubTrigger>
                <ResponsiveDropdownMenuSubContent className="max-h-80 overflow-y-auto">
                  {isLoadingLibraries ? (
                    <ResponsiveDropdownMenuItem disabled>
                      <span className="w-full text-left">
                        서재 목록 불러오는 중...
                      </span>
                    </ResponsiveDropdownMenuItem>
                  ) : userLibraries.length === 0 ? (
                    <ResponsiveDropdownMenuItem disabled>
                      <span className="w-full text-left">
                        이동할 서재가 없습니다
                      </span>
                    </ResponsiveDropdownMenuItem>
                  ) : (
                    userLibraries
                      .filter(lib => lib.id !== libraryId) // 현재 서재 제외
                      .map(lib => (
                        <ResponsiveDropdownMenuItem
                          key={lib.id}
                          onSelect={() => handleMoveBook(lib.id)}
                        >
                          <span className="w-full text-left">{lib.name}</span>
                        </ResponsiveDropdownMenuItem>
                      ))
                  )}
                </ResponsiveDropdownMenuSubContent>
              </ResponsiveDropdownMenuSub>
              <ResponsiveDropdownMenuItem
                onSelect={onDeleteBook}
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 flex-shrink-0" />
                <span>삭제하기</span>
              </ResponsiveDropdownMenuItem>
            </ResponsiveDropdownMenuContent>
          </ResponsiveDropdownMenu>
        </div>
      )}
    </div>
  );
}
