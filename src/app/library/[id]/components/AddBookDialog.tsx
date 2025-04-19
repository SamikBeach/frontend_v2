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
import { Loader2, MessageSquare, Search, Star } from 'lucide-react';
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
            className={`h-4 w-4 ${
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

  // 하이라이트 텍스트 처리
  const highlightText = (text: string, highlight?: string) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight?.toLowerCase() ? (
            <span key={index} className="font-medium text-gray-900">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // 이미지 URL 정규화
  const normalizeImageUrl = (url?: string) => {
    if (!url) return '/images/no-image.png';
    return url.replace(/^https?:\/\//, '//');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="flex h-[900px] min-w-[800px] flex-col bg-white p-5 pb-2">
        <DialogHeader className="mb-0.5">
          <DialogTitle>서재에 책 추가</DialogTitle>
        </DialogHeader>

        <div className="sticky top-0 z-10 flex w-full items-center gap-2 bg-white pb-0.5">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="h-9 w-full rounded-lg pl-10"
              placeholder="도서 제목, 저자, ISBN 등으로 검색"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {query.length > 0 && (
          <div className="sticky top-[40px] z-10 bg-white py-0">
            <h3 className="px-2 text-xs font-medium text-gray-700">
              &ldquo;{query}&rdquo; 검색 결과
              {totalResults ? ` (${totalResults})` : ''}
            </h3>
          </div>
        )}

        <div
          className="mt-0.5 flex-1 overflow-y-auto bg-white pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent"
          onScroll={handleScroll}
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
            <div className="px-1">
              <div>
                {searchResults.map(book => {
                  const bookKey = `${book.bookId || book.id || ''}-${
                    book.isbn || book.isbn13 || ''
                  }`;
                  const isSelected =
                    selectedBook?.bookId === book.bookId ||
                    selectedBook?.id === book.id;

                  const imageUrl = normalizeImageUrl(
                    book.coverImage || book.image
                  );

                  return (
                    <div
                      key={bookKey}
                      className="group relative flex cursor-pointer items-start gap-4 rounded-md bg-white px-3 py-3.5 transition-colors hover:bg-gray-50"
                      onClick={() => setSelectedBook(book)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedBook(book);
                        }
                      }}
                    >
                      <div className="relative w-[140px] flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                        <img
                          src={imageUrl}
                          alt={book.title}
                          className="h-auto w-full object-contain"
                          onError={e => {
                            e.currentTarget.src = '/images/no-image.png';
                          }}
                          loading="lazy"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-start pt-1">
                        <h4 className="line-clamp-2 text-base font-medium text-gray-900 group-hover:text-gray-800">
                          {highlightText(book.title, query)}
                        </h4>

                        {book.author && (
                          <p className="mt-1.5 line-clamp-1 text-sm text-gray-500">
                            {book.author}
                          </p>
                        )}

                        <div className="mt-2.5 flex items-center gap-3">
                          {book.rating && book.rating > 0 && (
                            <div className="flex items-center">
                              {renderStarRating(book.rating)}
                              <span className="mx-1.5 text-sm font-medium text-gray-800">
                                {typeof book.rating === 'number'
                                  ? book.rating.toFixed(1)
                                  : book.rating}
                              </span>
                              {book.totalRatings && book.totalRatings > 0 && (
                                <span className="text-sm text-gray-500">
                                  ({book.totalRatings})
                                </span>
                              )}
                            </div>
                          )}

                          {book.reviews && book.reviews > 0 && (
                            <div className="flex items-center border-l border-gray-200 pl-3">
                              <MessageSquare className="h-4 w-4 text-gray-400" />
                              <span className="text-md ml-1.5 text-gray-500">
                                {book.reviews > 999
                                  ? `${Math.floor(book.reviews / 1000)}k`
                                  : book.reviews}
                              </span>
                            </div>
                          )}
                        </div>

                        {book.publisher && (
                          <div className="mt-2 text-sm text-gray-500">
                            <span>{book.publisher}</span>
                            {(book.isbn13 || book.isbn) && (
                              <>
                                <span className="mx-1.5">·</span>
                                <span>{book.isbn13 || book.isbn}</span>
                              </>
                            )}
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

        <div className="flex justify-end gap-2 bg-white px-0 py-3">
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
