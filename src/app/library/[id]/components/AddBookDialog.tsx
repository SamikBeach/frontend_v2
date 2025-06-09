import { addBooksToLibrary } from '@/apis/library';
import { ReadingStatusType } from '@/apis/reading-status/types';
import { searchBooks } from '@/apis/search';
import { SearchResult } from '@/apis/search/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  BookOpen,
  Check,
  Clock,
  Loader2,
  MessageSquare,
  Star,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface AddBookDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  libraryId: number;
  onBookSelect?: (book: SearchResult) => void;
}

export function AddBookDialog({
  isOpen,
  onOpenChange,
  libraryId,
  onBookSelect,
}: AddBookDialogProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [selectedBooks, setSelectedBooks] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  // 다이얼로그가 열릴 때 검색 입력창에 포커스
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // 다이얼로그가 닫힐 때 선택된 책 목록 초기화
      setSelectedBooks([]);
      setQuery('');
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
      enabled: debouncedQuery !== undefined && debouncedQuery.trim() !== '',
    });

  // 서재에 책 추가 mutation
  const { mutate: addBooksMutation, isPending } = useMutation({
    mutationFn: async () => {
      if (selectedBooks.length === 0) {
        throw new Error('선택된 책이 없습니다');
      }

      const books = selectedBooks.map(book => {
        const bookId = book.bookId || book.id || -1;
        const isbn = book.isbn13 || book.isbn || '';
        return {
          bookId,
          isbn,
          note: '',
        };
      });

      return addBooksToLibrary(libraryId, { books });
    },
    onSuccess: data => {
      toast.success(
        `${data.success}권의 책이 서재에 추가되었습니다.${data.failed > 0 ? ` (${data.failed}권 실패)` : ''}`
      );
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

  // 책 선택/해제 핸들러
  const toggleBookSelection = (book: SearchResult) => {
    if (onBookSelect) {
      onBookSelect(book);
      return;
    }

    setSelectedBooks(prev => {
      // 고유 식별을 위해 bookId/id와 ISBN을 모두 확인
      const bookIdentifier = getBookIdentifier(book);
      const isSelected = prev.some(
        selectedBook => getBookIdentifier(selectedBook) === bookIdentifier
      );

      if (isSelected) {
        return prev.filter(
          selectedBook => getBookIdentifier(selectedBook) !== bookIdentifier
        );
      } else {
        return [...prev, book];
      }
    });
  };

  // 선택된 책 제거 핸들러
  const removeSelectedBook = (book: SearchResult) => {
    setSelectedBooks(prev =>
      prev.filter(
        selectedBook =>
          getBookIdentifier(selectedBook) !== getBookIdentifier(book)
      )
    );
  };

  // 책 식별자 생성 헬퍼 함수
  const getBookIdentifier = (book: SearchResult): string => {
    return `${book.isbn}-${book.isbn13}-${book.title}`;
  };

  // 서재에 책 추가 핸들러
  const handleAddBooks = () => {
    if (selectedBooks.length === 0) {
      toast.error('적어도 한 권의 책을 선택해주세요.');
      return;
    }

    // ISBN이 없고 bookId가 -1인 책이 있는지 확인
    const invalidBook = selectedBooks.find(
      book =>
        (book.bookId || book.id || -1) === -1 && !(book.isbn13 || book.isbn)
    );

    if (invalidBook) {
      toast.error(
        `"${invalidBook.title}" 책의 ISBN 정보가 없어 추가할 수 없습니다.`
      );
      return;
    }

    addBooksMutation();
  };

  // 검색 결과 리스트 (전체 페이지 병합)
  const searchResults = data?.pages.flatMap(page => page.books) || [];
  const totalResults = data?.pages[0]?.total || 0;

  // useEffect를 사용하여 스크롤 이벤트 리스너 추가 (백업 메커니즘)
  useEffect(() => {
    if (debouncedQuery.trim() === '') return;

    // CommandList 대신 부모 컨테이너 참조
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollHandler = () => {
      if (!hasNextPage || isFetchingNextPage) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        fetchNextPage();
      }
    };

    scrollContainer.addEventListener('scroll', scrollHandler);
    return () => {
      scrollContainer.removeEventListener('scroll', scrollHandler);
    };
  }, [debouncedQuery, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 스크롤 이벤트 핸들러
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // 스크롤이 하단에 가까워지면 다음 페이지 로드
    if (scrollHeight - scrollTop - clientHeight < 200) {
      fetchNextPage();
    }
  };

  // 다이얼로그 닫기 핸들러
  const handleCloseDialog = () => {
    if (!isPending) {
      onOpenChange(false);
      setQuery('');
      setSelectedBooks([]);
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
            className={`h-3 w-3 md:h-4 md:w-4 ${
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

  // 하이라이트 텍스트 처리
  const highlightText = (text: string, highlight?: string) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight?.toLowerCase() ? (
            <span key={index} className="font-medium text-gray-700">
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
    <ResponsiveDialog open={isOpen} onOpenChange={handleCloseDialog}>
      <ResponsiveDialogContent
        className="flex h-[90vh] min-w-[800px] flex-col bg-white p-5 pb-2"
        drawerClassName="flex flex-col bg-white p-0 h-full overflow-hidden z-53"
        drawerOverlayClassName="z-52"
        onOpenAutoFocus={e => {
          e.preventDefault();
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* 헤더 - x버튼이 우측 끝에 오도록 수정 */}
          <ResponsiveDialogHeader
            className="mb-0.5 flex-shrink-0 px-0 pt-0"
            drawerClassName="mb-0.5 flex-shrink-0 px-4 pt-4"
            onClose={handleCloseDialog}
          >
            <ResponsiveDialogTitle
              className="text-lg font-medium"
              drawerClassName="text-lg font-medium"
            >
              책 추가하기
            </ResponsiveDialogTitle>
          </ResponsiveDialogHeader>

          <div className="min-h-0 flex-1 overflow-hidden">
            <Command
              className="flex h-full flex-col overflow-hidden rounded-none border-0 shadow-none"
              shouldFilter={false}
              loop={true}
            >
              <div className="sticky top-0 z-20 flex-shrink-0 border-b border-gray-100 bg-white">
                <CommandInput
                  ref={inputRef}
                  value={query}
                  onValueChange={setQuery}
                  autoFocus
                  className="h-12 rounded-none border-0 py-4 text-base shadow-none focus:ring-0"
                  placeholder="도서 제목, 저자, ISBN 등으로 검색"
                />
              </div>

              <div
                ref={scrollContainerRef}
                className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
                onScroll={handleScroll}
              >
                {query.length > 0 && (
                  <div className="sticky top-0 z-10 bg-white px-4 py-2 text-xs font-medium text-gray-500">
                    &ldquo;{query}&rdquo; 검색 결과
                    {totalResults ? ` (${totalResults})` : ''}
                  </div>
                )}

                {/* 선택된 책 목록 섹션 - 검색 결과 아래, 상단 고정 */}
                {selectedBooks.length > 0 && (
                  <div className="sticky top-8 z-10 mb-2 flex-shrink-0 bg-white px-4 pt-2 pb-2">
                    <h3 className="mb-2 text-xs font-medium text-gray-700">
                      선택된 책 ({selectedBooks.length})
                    </h3>
                    <ScrollArea className="max-h-20 w-full overflow-y-auto rounded-md border border-gray-100 bg-gray-50 p-2">
                      <div className="flex flex-wrap gap-2">
                        {selectedBooks.map(book => (
                          <Badge
                            key={`selected-${getBookIdentifier(book)}`}
                            variant="outline"
                            className="flex items-center gap-1 bg-white py-1 pr-1 pl-2"
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="max-w-[150px] truncate text-xs md:max-w-[200px]">
                                  {book.title}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{book.title}</p>
                              </TooltipContent>
                            </Tooltip>
                            <button
                              onClick={() => removeSelectedBook(book)}
                              className="ml-1 rounded-full p-1 hover:bg-gray-200"
                              aria-label="책 선택 해제"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                <CommandList className="h-full !max-h-none overflow-visible [&>div]:h-full">
                  {query.length === 0 ? (
                    <div
                      className={`flex h-full w-full grow flex-col items-center justify-center p-8 text-sm text-gray-500`}
                    >
                      검색어를 입력해주세요.
                    </div>
                  ) : isLoading || isDebouncing ? (
                    <div
                      className={`flex h-full w-full grow flex-col items-center justify-center`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                      </div>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <CommandEmpty className="py-6 text-center">
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
                    </CommandEmpty>
                  ) : (
                    <CommandGroup className="px-1">
                      <div className="space-y-1">
                        {searchResults.map(book => {
                          const bookKey = getBookIdentifier(book);
                          const isSelected = selectedBooks.some(
                            selectedBook =>
                              getBookIdentifier(selectedBook) === bookKey
                          );

                          const imageUrl = normalizeImageUrl(
                            book.coverImage || book.image
                          );

                          return (
                            <CommandItem
                              key={bookKey}
                              className={cn(
                                'group relative flex h-auto cursor-pointer items-start gap-3 rounded-md p-2 transition-colors hover:bg-gray-50 md:gap-4',
                                isSelected ? 'bg-gray-50' : ''
                              )}
                              onSelect={() => toggleBookSelection(book)}
                            >
                              <div className="relative w-[80px] flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white md:w-[140px]">
                                <img
                                  src={imageUrl}
                                  alt={book.title}
                                  className="h-auto w-full object-contain"
                                  onError={e => {
                                    e.currentTarget.src =
                                      '/images/no-image.png';
                                  }}
                                  loading="lazy"
                                />
                              </div>

                              <div className="flex min-w-0 flex-1 flex-col justify-start pt-0 md:pt-1">
                                <h4 className="line-clamp-2 text-sm font-medium text-gray-800 group-hover:text-gray-700 md:text-base">
                                  {highlightText(book.title, query)}
                                </h4>

                                {book.author && (
                                  <p className="mt-1 line-clamp-1 text-xs text-gray-500 md:mt-1.5 md:text-sm">
                                    {book.author}
                                  </p>
                                )}

                                <div className="mt-1.5 flex flex-wrap items-center gap-2 md:mt-2.5 md:gap-3">
                                  <div className="flex items-center">
                                    {renderStarRating(book.rating)}
                                    <span className="mx-1 text-xs font-medium text-gray-800 md:mx-1.5 md:text-sm">
                                      {typeof book.rating === 'number'
                                        ? book.rating.toFixed(1)
                                        : book.rating || '0.0'}
                                    </span>
                                    <span className="text-xs text-gray-500 md:text-sm">
                                      ({book.totalRatings || 0})
                                    </span>
                                  </div>

                                  <div className="flex items-center border-l border-gray-200 pl-2 md:pl-3">
                                    <MessageSquare className="h-3 w-3 text-gray-400 md:h-4 md:w-4" />
                                    <span className="ml-1 text-xs text-gray-500 md:ml-1.5 md:text-sm">
                                      {book.reviews && book.reviews > 999
                                        ? `${Math.floor(book.reviews / 1000)}k`
                                        : book.reviews || 0}
                                    </span>
                                  </div>
                                </div>

                                {book.userReadingStatus && (
                                  <div className="mt-1.5 md:mt-2.5">
                                    {book.userReadingStatus ===
                                      ReadingStatusType.WANT_TO_READ && (
                                      <div className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600 md:px-2.5 md:py-1">
                                        <span className="flex items-center">
                                          <Clock className="h-3 w-3 text-purple-500 md:h-3.5 md:w-3.5" />
                                        <span className="ml-1">
                                            읽고 싶어요
                                            {(book.readingStats
                                              ?.readingStatusCounts?.[
                                              ReadingStatusType.WANT_TO_READ
                                            ] ?? 0) > 0 &&
                                              ` ${book.readingStats?.readingStatusCounts?.[ReadingStatusType.WANT_TO_READ]}`}
                                          </span>
                                        </span>
                                      </div>
                                    )}
                                    {book.userReadingStatus ===
                                      ReadingStatusType.READING && (
                                      <div className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 md:px-2.5 md:py-1">
                                        <span className="flex items-center">
                                          <BookOpen className="h-3 w-3 text-blue-500 md:h-3.5 md:w-3.5" />
                                          <span className="ml-1">
                                            읽는 중
                                            {(book.readingStats
                                              ?.readingStatusCounts?.[
                                              ReadingStatusType.READING
                                            ] ?? 0) > 0 &&
                                              ` ${book.readingStats?.readingStatusCounts?.[ReadingStatusType.READING]}`}
                                          </span>
                                        </span>
                                      </div>
                                    )}
                                    {book.userReadingStatus ===
                                      ReadingStatusType.READ && (
                                      <div className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600 md:px-2.5 md:py-1">
                                        <span className="flex items-center">
                                          <Check className="h-3 w-3 text-green-500 md:h-3.5 md:w-3.5" />
                                          <span className="ml-1">
                                            읽었어요
                                            {(book.readingStats
                                              ?.readingStatusCounts?.[
                                              ReadingStatusType.READ
                                            ] ?? 0) > 0 &&
                                              ` ${book.readingStats?.readingStatusCounts?.[ReadingStatusType.READ]}`}
                                          </span>
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {!book.userReadingStatus &&
                                  book.readingStats?.readingStatusCounts && (
                                    <div className="mt-1.5 flex flex-wrap gap-1 md:mt-3 md:gap-1.5">
                                      {(book.readingStats
                                        ?.readingStatusCounts?.[
                                        ReadingStatusType.WANT_TO_READ
                                      ] ?? 0) > 0 && (
                                        <div className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600 md:px-2.5 md:py-1">
                                          <span className="flex items-center">
                                            <Clock className="h-3 w-3 text-purple-500 md:h-3.5 md:w-3.5" />
                                            <span className="ml-1">
                                              읽고 싶어요{' '}
                                              {
                                                book.readingStats
                                                  ?.readingStatusCounts?.[
                                                  ReadingStatusType.WANT_TO_READ
                                                ]
                                              }
                                            </span>
                                          </span>
                                        </div>
                                      )}

                                      {(book.readingStats
                                        ?.readingStatusCounts?.[
                                        ReadingStatusType.READING
                                      ] ?? 0) > 0 && (
                                        <div className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 md:px-2.5 md:py-1">
                                          <span className="flex items-center">
                                            <BookOpen className="h-3 w-3 text-blue-500 md:h-3.5 md:w-3.5" />
                                            <span className="ml-1">
                                              읽는 중{' '}
                                              {
                                                book.readingStats
                                                  ?.readingStatusCounts?.[
                                                  ReadingStatusType.READING
                                                ]
                                              }
                                            </span>
                                          </span>
                                        </div>
                                      )}

                                      {(book.readingStats
                                        ?.readingStatusCounts?.[
                                        ReadingStatusType.READ
                                      ] ?? 0) > 0 && (
                                        <div className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600 md:px-2.5 md:py-1">
                                          <span className="flex items-center">
                                            <Check className="h-3 w-3 text-green-500 md:h-3.5 md:w-3.5" />
                                            <span className="ml-1">
                                              읽었어요{' '}
                                              {
                                                book.readingStats
                                                  ?.readingStatusCounts?.[
                                                  ReadingStatusType.READ
                                                ]
                                              }
                                            </span>
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                              </div>

                              {isSelected && (
                                <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </CommandItem>
                          );
                        })}

                        {isFetchingNextPage && (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                          </div>
                        )}
                      </div>
                    </CommandGroup>
                  )}
                </CommandList>
              </div>
            </Command>
          </div>

          <div className="mt-2 flex-shrink-0 border-t border-gray-100 bg-white px-4 py-3 md:px-0">
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleAddBooks}
                disabled={selectedBooks.length === 0 || isPending}
                className="h-9 bg-green-600 px-3 text-sm hover:bg-green-700 md:h-10 md:px-4"
              >
                {isPending ? '추가 중...' : '추가하기'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isPending}
                className="h-9 px-3 text-sm md:h-10 md:px-4"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
