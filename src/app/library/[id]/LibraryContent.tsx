import { Book as BookType } from '@/apis/book';
import {
  addBookToLibrary,
  getLibrariesByUser,
  removeBookFromLibrary,
} from '@/apis/library';
import { BookCard } from '@/components/BookCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { Separator } from '@/components/ui/separator';
import { useDialogQuery } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { josa } from 'josa';
import { ExternalLink, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { AddBookDialog } from './components/AddBookDialog';
import { useLibraryDetail } from './hooks';

// DeleteBookDialog 컴포넌트: 책 삭제 확인 다이얼로그
interface DeleteBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: number;
  bookTitle: string;
  libraryId: number;
  onDelete: () => void;
}

function DeleteBookDialog({
  open,
  onOpenChange,
  bookId,
  bookTitle,
  libraryId,
  onDelete,
}: DeleteBookDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  // 책 삭제 mutation
  const { mutateAsync } = useMutation({
    mutationFn: () => removeBookFromLibrary(libraryId, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library', libraryId] });
      queryClient.invalidateQueries({
        queryKey: ['library-updates', libraryId],
      });
      toast.success('책이 서재에서 삭제되었습니다.');
      onDelete();
      onOpenChange(false);
    },
    onError: error => {
      console.error('책 삭제 중 오류 발생:', error);
      toast.error('책 삭제 중 오류가 발생했습니다.');
    },
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await mutateAsync();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-medium">
            {josa(`${bookTitle}#{을} 서재에서 삭제하시겠습니까?`)}
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-sm text-gray-500">
            이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer rounded-lg border-gray-200"
            disabled={isDeleting}
          >
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer rounded-lg bg-red-600 hover:bg-red-700 focus:ring-red-600"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function LibraryContent() {
  const params = useParams();
  const router = useRouter();
  const libraryId = parseInt(params.id as string, 10);
  const { library, isLoading } = useLibraryDetail(libraryId);
  const currentUser = useCurrentUser();
  const isMobile = useIsMobile();
  const { open: openBookDialog } = useDialogQuery({
    type: 'book',
    idType: 'id',
  });
  const queryClient = useQueryClient();

  // 삭제 다이얼로그 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [showAddBookDialog, setShowAddBookDialog] = useState(false);
  // 개별 책의 드롭다운 상태를 관리하기 위한 Map
  const [openDropdownIds, setOpenDropdownIds] = useState<Set<number>>(
    new Set()
  );

  // 사용자의 서재 목록 불러오기
  const { data: userLibraries = [], isLoading: isLoadingLibraries } = useQuery({
    queryKey: ['user-libraries', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      return await getLibrariesByUser(currentUser.id);
    },
    enabled: !!currentUser,
  });

  // 책을 다른 서재로 이동하는 mutation
  const { mutate: moveBook } = useMutation({
    mutationFn: async ({
      bookId,
      sourceLibraryId,
      targetLibraryId,
    }: {
      bookId: number;
      sourceLibraryId: number;
      targetLibraryId: number;
    }) => {
      // 1. 먼저 타겟 서재에 책 추가
      await addBookToLibrary(targetLibraryId, { bookId });

      // 2. 소스 서재에서 책 제거
      await removeBookFromLibrary(sourceLibraryId, bookId);
    },
    onSuccess: () => {
      // 양쪽 서재 모두 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['library', libraryId] });
      toast.success('책이 다른 서재로 이동되었습니다.');
    },
    onError: error => {
      console.error('책 이동 중 오류 발생:', error);
      toast.error('책을 이동하는 중 오류가 발생했습니다.');
    },
  });

  if (isLoading || !library) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl bg-white py-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
        </div>
        <Separator className="border-gray-100" />
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-6 w-16 animate-pulse rounded bg-gray-200"></div>
              <div className="ml-2 h-6 w-8 animate-pulse rounded-full bg-gray-200"></div>
            </div>
          </div>
          <div className="3xl:grid-cols-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] animate-pulse rounded-lg bg-gray-200"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 현재 사용자가 서재 소유자인지 확인
  const isOwner = currentUser?.id === library?.owner?.id;

  // 라이브러리 책 형식 변환
  const booksWithDetails =
    library.books?.map(libraryBook => ({
      ...libraryBook.book,
      id: libraryBook.bookId,
      libraryBookId: libraryBook.id,
    })) || [];

  // 책 클릭 핸들러
  const handleBookClick = (book: BookType) => {
    openBookDialog(book.id.toString());
  };

  // 책 삭제 핸들러
  const handleDeleteBook = (bookId: number, title: string) => {
    setBookToDelete({
      id: bookId,
      title: title || '제목 없음',
    });
    setDeleteDialogOpen(true);
    // 드롭다운 닫기
    setOpenDropdownIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(bookId);
      return newSet;
    });
  };

  // 책 다른 서재로 이동 핸들러
  const handleMoveToLibrary = (bookId: number, targetLibraryId: number) => {
    if (targetLibraryId === libraryId) {
      toast.error('같은 서재로 이동할 수 없습니다.');
      return;
    }

    moveBook({
      bookId,
      sourceLibraryId: libraryId,
      targetLibraryId,
    });

    // 드롭다운 닫기
    setOpenDropdownIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(bookId);
      return newSet;
    });
  };

  // 삭제 후 캐시 업데이트
  const handleDeleteSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['library', libraryId] });
  };

  return (
    <div className="space-y-3">
      {/* 서재 설명 */}
      <div className="rounded-xl bg-white py-2">
        <p className="text-gray-700">
          {library.description || '설명이 없습니다.'}
        </p>
      </div>

      <Separator className="border-gray-100" />

      {/* 책 목록 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-medium text-gray-900">담긴 책</h2>
            <div className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-600">
              {booksWithDetails.length}
            </div>
          </div>
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 rounded-lg"
              onClick={() => setShowAddBookDialog(true)}
            >
              <Plus className="h-4 w-4" />
              <span>책 추가</span>
            </Button>
          )}
        </div>

        <div className="3xl:grid-cols-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {booksWithDetails.length > 0 ? (
            booksWithDetails.map(book => (
              <div key={book.id} className="group relative">
                <BookCard
                  book={book as unknown as BookType}
                  onClick={handleBookClick}
                />
                {isOwner && (
                  <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu
                      open={openDropdownIds.has(book.id)}
                      onOpenChange={open => {
                        setOpenDropdownIds(prev => {
                          const newSet = new Set(prev);
                          if (open) {
                            newSet.add(book.id);
                          } else {
                            newSet.delete(book.id);
                          }
                          return newSet;
                        });
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`bg-opacity-80 hover:bg-opacity-100 h-8 w-8 rounded-full bg-white p-1.5 ${
                            openDropdownIds.has(book.id)
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
                            <span className="w-full text-left">
                              다른 서재로 옮기기
                            </span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="max-h-80 w-48 overflow-y-auto">
                              {isLoadingLibraries ? (
                                <DropdownMenuItem
                                  disabled
                                  className="flex w-full"
                                >
                                  <span className="w-full text-left">
                                    서재 목록 불러오는 중...
                                  </span>
                                </DropdownMenuItem>
                              ) : userLibraries.length === 0 ? (
                                <DropdownMenuItem
                                  disabled
                                  className="flex w-full"
                                >
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
                                        handleMoveToLibrary(book.id, lib.id);
                                      }}
                                      className="flex w-full cursor-pointer"
                                    >
                                      <span className="w-full text-left">
                                        {lib.name}
                                      </span>
                                    </DropdownMenuItem>
                                  ))
                              )}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteBook(
                              book.id,
                              book.title || '제목 없음'
                            );
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
            ))
          ) : (
            <div className="col-span-full py-8 text-center">
              <p className="text-gray-500">아직 추가된 책이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 책 삭제 다이얼로그 */}
      {bookToDelete && (
        <DeleteBookDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          bookId={bookToDelete.id}
          bookTitle={bookToDelete.title}
          libraryId={libraryId}
          onDelete={handleDeleteSuccess}
        />
      )}

      {/* 책 추가 다이얼로그 */}
      {showAddBookDialog && (
        <AddBookDialog
          isOpen={showAddBookDialog}
          onOpenChange={setShowAddBookDialog}
          libraryId={libraryId}
        />
      )}
    </div>
  );
}
