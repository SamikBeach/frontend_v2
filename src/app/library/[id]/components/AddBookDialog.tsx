'use client';

import { addBookToLibrary } from '@/apis/library';
import { searchBooks } from '@/apis/search';
import { SearchResult } from '@/apis/search/types';
import { Button } from '@/components/ui/button';
import { Command, CommandInput } from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Loader2, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface AddBookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  libraryId: number;
}

export function AddBookDialog({
  isOpen,
  onClose,
  libraryId,
}: AddBookDialogProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [selectedBook, setSelectedBook] = useState<SearchResult | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  // 다이얼로그가 열릴 때 검색 입력창에 포커스
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // 책 검색 쿼리
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['book-search', debouncedQuery],
      queryFn: ({ pageParam = 1 }) =>
        searchBooks(debouncedQuery, pageParam, 10),
      initialPageParam: 1,
      getNextPageParam: lastPage => {
        if (lastPage.page < lastPage.totalPages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      enabled: debouncedQuery.length >= 2,
    });

  // 서재에 책 추가 mutation
  const { mutateAsync: addBookMutation } = useMutation({
    mutationFn: ({
      libraryId,
      bookId,
      isbn,
    }: {
      libraryId: number;
      bookId: number;
      isbn?: string;
    }) => addBookToLibrary(libraryId, { bookId, isbn }),
    onSuccess: () => {
      toast.success('책이 서재에 추가되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['library', libraryId] });
      onClose();
    },
    onError: (error: any) => {
      let errorMessage = '책 추가 중 오류가 발생했습니다.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });

  // 서재에 책 추가 핸들러
  const handleAddBook = async () => {
    if (!selectedBook || !selectedBook.bookId) return;

    setIsAdding(true);
    try {
      await addBookMutation({
        libraryId,
        bookId: selectedBook.bookId,
        isbn: selectedBook.isbn13 || selectedBook.isbn,
      });
    } catch (error) {
      console.error('책 추가 중 오류 발생:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // 검색 결과 리스트 (전체 페이지 병합)
  const searchResults = data?.pages.flatMap(page => page.books) || [];

  // 스크롤 이벤트 핸들러
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // 스크롤이 하단에 가까워지면 다음 페이지 로드
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      fetchNextPage();
    }
  };

  // 다이얼로그 닫기 핸들러
  const handleCloseDialog = () => {
    if (!isAdding) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent
        className="fixed top-1/2 left-1/2 z-50 h-[calc(100vh-100px)] w-[800px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border-none p-0"
        closeClassName="hidden"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-xl">
          <DialogHeader className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
            <DialogTitle className="text-lg font-medium">
              서재에 책 추가
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleCloseDialog}
              disabled={isAdding}
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>

          <Command className="flex h-full w-full flex-col overflow-hidden rounded-none border-0 shadow-none">
            <div className="relative border-b border-gray-200 px-4">
              <Search className="absolute top-4 left-7 h-5 w-5 text-gray-400" />
              <CommandInput
                ref={inputRef}
                value={query}
                onValueChange={setQuery}
                className="h-14 w-full rounded-none border-0 py-3 pr-4 pl-12 text-base shadow-none focus-visible:ring-0"
                placeholder="도서 제목, 저자, ISBN 등으로 검색"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4" onScroll={handleScroll}>
              {debouncedQuery.length < 2 ? (
                <div className="flex flex-1 items-center justify-center p-8 text-sm text-gray-500">
                  검색어를 2자 이상 입력해주세요.
                </div>
              ) : isLoading ? (
                <div className="flex flex-1 items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : searchResults.length === 0 ? (
                <div className="flex flex-1 items-center justify-center p-8 text-sm text-gray-500">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <div className="grid gap-4">
                  {searchResults.map(book => (
                    <div
                      key={`${book.bookId}-${book.isbn || book.isbn13}`}
                      className={`flex cursor-pointer items-start gap-4 rounded-lg p-4 transition-colors ${
                        selectedBook?.bookId === book.bookId
                          ? 'border border-blue-200 bg-blue-50'
                          : 'border border-gray-100 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedBook(book)}
                    >
                      <div className="h-24 w-18 flex-shrink-0 overflow-hidden rounded-md border">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-base font-medium text-gray-900">
                          {book.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {book.author || '저자 정보 없음'}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <span className="line-clamp-1">
                            {book.publisher && `${book.publisher} · `}
                            {book.isbn13 || book.isbn || ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isFetchingNextPage && (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Command>

          <div className="flex justify-end gap-2 border-t border-gray-200 p-4">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isAdding}
              className="rounded-lg"
            >
              취소
            </Button>
            <Button
              onClick={handleAddBook}
              disabled={!selectedBook || isAdding}
              className="rounded-lg bg-gray-900 hover:bg-gray-800"
            >
              {isAdding ? '추가 중...' : '서재에 추가하기'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
