import { Book } from '@/apis/book/types';
import { LibraryListItem } from '@/apis/library/types';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';

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
  return (
    <div className="group relative">
      <BookCard book={book} onClick={() => onBookClick(book)} />
      {isOwner && (
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu
            open={isDropdownOpen}
            onOpenChange={onDropdownOpenChange}
          >
            <DropdownMenuTrigger asChild>
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
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex w-full cursor-pointer items-center">
                  <ExternalLink className="mr-4 h-4 w-4 flex-shrink-0" />
                  <span className="w-full text-left">다른 서재로 옮기기</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="max-h-80 w-48 overflow-y-auto">
                    {isLoadingLibraries ? (
                      <DropdownMenuItem disabled className="flex w-full">
                        <span className="w-full text-left">
                          서재 목록 불러오는 중...
                        </span>
                      </DropdownMenuItem>
                    ) : userLibraries.length === 0 ? (
                      <DropdownMenuItem disabled className="flex w-full">
                        <span className="w-full text-left">
                          이동할 서재가 없습니다
                        </span>
                      </DropdownMenuItem>
                    ) : (
                      userLibraries
                        .filter(lib => lib.id !== libraryId) // 현재 서재 제외
                        .map(lib => (
                          <DropdownMenuItem
                            key={lib.id}
                            onClick={e => {
                              e.stopPropagation();
                              onMoveBook(lib.id);
                            }}
                            className="flex w-full cursor-pointer"
                          >
                            <span className="w-full text-left">{lib.name}</span>
                          </DropdownMenuItem>
                        ))
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem
                onClick={e => {
                  e.stopPropagation();
                  onDeleteBook();
                }}
                className="flex w-full cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4 flex-shrink-0 text-red-600" />
                <span className="w-full text-left text-red-600 hover:text-red-600">
                  삭제하기
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
