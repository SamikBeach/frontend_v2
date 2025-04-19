'use client';

import { addBookToLibrary, addBookToLibraryWithIsbn } from '@/apis/library';
import { searchBooks } from '@/apis/search';
import { SearchResult } from '@/apis/search/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { CheckCircle2, Loader2, Search, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface AddBookDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  libraryId: number;
}

export function AddBookDialog({
  isOpen,
  onOpenChange,
  libraryId,
}: AddBookDialogProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [selectedBook, setSelectedBook] = useState<SearchResult | null>(null);
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
      enabled: debouncedQuery !== undefined,
    });

  // 서재에 책 추가 mutation
  const { mutate: addBookMutation, isPending } = useMutation({
    mutationFn: async ({
      libraryId,
      bookId,
      isbn,
    }: {
      libraryId: number;
      bookId: number;
      isbn?: string;
    }) => {
      // bookId가 -1인 경우에는 반드시 ISBN이 필요
      if (bookId === -1 && !isbn) {
        throw new Error('ISBN이 필요합니다');
      }

      // ISBN이 있는 경우 addBookToLibraryWithIsbn 사용
      if (isbn) {
        return addBookToLibraryWithIsbn({
          libraryId,
          bookId: bookId,
          isbn,
        });
      } else {
        return addBookToLibrary(libraryId, { bookId });
      }
    },
    onSuccess: data => {
      toast.success('책이 서재에 추가되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['library', libraryId] });
      queryClient.invalidateQueries({
        queryKey: ['library-updates', libraryId],
      });
      onOpenChange(false);
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
  const handleAddBook = () => {
    if (!selectedBook) {
      return;
    }

    // bookId가 없는 경우 id를 대신 사용하고, 둘 다 없으면 -1 사용
    const bookId = selectedBook.bookId || selectedBook.id || -1;
    const isbn = selectedBook.isbn13 || selectedBook.isbn || '';

    // ISBN이 없는데 bookId가 -1인 경우
    if (bookId === -1 && !isbn) {
      toast.error('ISBN 정보가 없어 책을 추가할 수 없습니다.');
      return;
    }

    addBookMutation({
      libraryId,
      bookId: bookId,
      isbn: isbn,
    });
  };

  // 검색 결과 리스트 (전체 페이지 병합)
  const searchResults = data?.pages.flatMap(page => page.books) || [];
  const totalResults = data?.pages[0]?.total || 0;

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
    if (!isPending) {
      onOpenChange(false);
      setQuery('');
      setSelectedBook(null);
    }
  };

  const isDebouncing =
    query.trim() !== debouncedQuery.trim() && query.trim() !== '';

  // 평점 렌더링 함수
  const renderStarRating = (rating?: number) => {
    const ratingValue = rating || 0;
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < Math.floor(ratingValue)
                ? 'fill-yellow-400 text-yellow-400'
                : i + 0.5 <= ratingValue
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // 검색 실행 핸들러
  const handleSearch = () => {
    // 검색은 이미 디바운스로 실행되므로 추가 작업 필요 없음
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="h-[800px] min-w-[800px] p-6">
        <DialogHeader>
          <DialogTitle>서재에 책 추가</DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="h-10 w-full rounded-lg pr-10"
              placeholder="도서 제목, 저자, ISBN 등으로 검색"
            />
            <button
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={handleSearch} className="h-10 rounded-lg">
            검색
          </Button>
        </div>

        <div
          className="mt-4 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent"
          onScroll={handleScroll}
          style={{ height: 'calc(100% - 170px)' }}
        >
          {query.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center p-8 text-sm text-gray-500">
              검색어를 입력해주세요.
            </div>
          ) : isLoading || isDebouncing ? (
            <div className="flex h-[300px] w-full items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex h-[300px] w-full items-center justify-center">
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-4xl">📚</span>
                </div>
                <p className="mb-3 text-xl font-medium text-gray-800">
                  검색 결과가 없습니다
                </p>
                <p className="text-sm text-gray-500">
                  다른 검색어로 시도해보세요
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-700">
                &ldquo;{query}&rdquo; 검색 결과
                {totalResults ? ` (${totalResults})` : ''}
              </h3>
              <div className="space-y-2">
                {searchResults.map(book => {
                  const bookKey = `${book.bookId || book.id || ''}-${
                    book.isbn || book.isbn13 || ''
                  }`;
                  const isSelected =
                    selectedBook?.bookId === book.bookId ||
                    selectedBook?.id === book.id;

                  return (
                    <div
                      key={bookKey}
                      className={`flex cursor-pointer rounded-lg p-3 transition-colors ${
                        isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedBook(book)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedBook(book);
                        }
                      }}
                    >
                      <div className="mr-4 h-[70px] w-[50px] flex-shrink-0 overflow-hidden rounded-md border bg-gray-50">
                        {book.coverImage || book.image ? (
                          <img
                            src={(book.coverImage || book.image || '').replace(
                              /^https?:\/\//,
                              '//'
                            )}
                            alt={book.title}
                            className="h-full w-full object-cover"
                            onError={e => {
                              e.currentTarget.src = '/book-placeholder.png';
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="line-clamp-1 text-sm font-medium text-gray-900">
                            {book.title}
                            {book.subtitle && (
                              <span className="ml-1 text-xs font-normal text-gray-500">
                                ({book.subtitle})
                              </span>
                            )}
                          </h3>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                          )}
                        </div>

                        <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                          {book.author || '저자 정보 없음'}
                        </p>

                        {book.rating && book.rating > 0 && (
                          <div className="mt-2 flex items-center gap-1">
                            {renderStarRating(book.rating)}
                            <span className="ml-1 text-xs text-gray-500">
                              {book.rating.toFixed(1)}
                              {book.totalRatings && ` (${book.totalRatings})`}
                            </span>
                          </div>
                        )}

                        <div className="mt-1.5 flex items-center text-xs text-gray-500">
                          <span className="line-clamp-1">
                            {book.publisher && `${book.publisher} · `}
                            {book.isbn13 || book.isbn || ''}
                          </span>
                        </div>

                        {book.highlight && (
                          <div className="mt-2 line-clamp-2 rounded bg-yellow-50 p-1 text-xs text-gray-600">
                            {book.highlight}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isFetchingNextPage && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="absolute right-0 bottom-0 left-0 flex justify-end gap-2 rounded-xl border-t border-gray-200 bg-white p-4">
          <Button
            variant="outline"
            onClick={handleCloseDialog}
            disabled={isPending}
          >
            취소
          </Button>
          <Button onClick={handleAddBook} disabled={!selectedBook || isPending}>
            {isPending ? '추가 중...' : '서재에 추가하기'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
