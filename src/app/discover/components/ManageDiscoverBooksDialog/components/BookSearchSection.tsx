import { addBookToDiscoverCategory } from '@/apis/book/book';
import { searchBooks } from '@/apis/search';
import { SearchResult } from '@/apis/search/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Loader2, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useDiscoverCategories } from '../../../hooks/useDiscoverCategories';
import { useCategorySelection, useSearchState } from '../hooks';
import { CategoryBooksListProps } from '../types';
import {
  getBookIdentifier,
  getImageUrl,
  highlightText,
  normalizeImageUrl,
  renderStarRating,
} from '../utils';

export function BookSearchSection({ open }: CategoryBooksListProps) {
  const queryClient = useQueryClient();
  const { selectedCategoryId, selectedSubcategoryId } = useCategorySelection();
  const { searchQuery, setSearchQuery } = useSearchState();
  const { categories } = useDiscoverCategories({ includeInactive: true });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 선택이 완료되었는지 확인하는 함수
  const isSelectionComplete = useCallback(() => {
    if (!selectedCategoryId) return false;

    const category = categories.find(
      (c: any) => c.id.toString() === selectedCategoryId
    );
    if (!category) return false;

    // 서브카테고리가 있는 경우
    if (category.subCategories && category.subCategories.length > 0) {
      // 서브카테고리가 선택되어야 함 (빈 문자열이나 'none'이 아닌 유효한 값)
      return (
        selectedSubcategoryId &&
        selectedSubcategoryId !== '' &&
        selectedSubcategoryId !== 'none' &&
        !isNaN(parseInt(selectedSubcategoryId))
      );
    }

    // 서브카테고리가 없는 경우는 카테고리만 선택되면 됨
    return true;
  }, [selectedCategoryId, selectedSubcategoryId, categories]);

  // 도서 검색 기능
  const {
    data: searchData,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
    isLoading: isSearchLoading,
  } = useInfiniteQuery({
    queryKey: ['available-books-for-discover', debouncedSearchQuery],
    queryFn: ({ pageParam = 1 }) => {
      return searchBooks(debouncedSearchQuery, pageParam, 10);
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: open && debouncedSearchQuery.trim() !== '',
  });

  const searchResults = searchData?.pages.flatMap(page => page.books) || [];
  const totalSearchResults = searchData?.pages[0]?.total || 0;

  const selectedCategory = categories.find(
    (c: any) => c.id.toString() === selectedCategoryId
  );

  // 다이얼로그 열림 시 검색 입력란에 포커스
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    } else {
      setSearchQuery('');
    }
  }, [open, setSearchQuery]);

  // 스크롤 이벤트 핸들러
  const handleSearchScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!hasNextSearchPage || isFetchingNextSearchPage) return;

      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // 스크롤이 90% 이상 내려갔을 때 다음 페이지 로드
      if (scrollPercentage >= 0.9) {
        fetchNextSearchPage();
      }
    },
    [hasNextSearchPage, isFetchingNextSearchPage, fetchNextSearchPage]
  );

  // 검색 결과에서 도서를 카테고리에 즉시 추가하는 함수
  const addBookToCategory = (book: SearchResult): void => {
    if (!open) return;

    const bookId = book.bookId !== undefined ? book.bookId : book.id;
    const isbn = book.isbn13 || book.isbn || '';

    if (!selectedCategoryId || !isSelectionComplete()) {
      if (!selectedCategoryId) {
        toast.error('카테고리를 선택해주세요.');
      } else if (!isSelectionComplete()) {
        toast.error('서브카테고리를 선택해주세요.');
      }
      return;
    }

    if ((bookId === undefined || bookId === null) && !isbn) {
      toast.error('도서 ID 또는 ISBN 정보가 없어 추가할 수 없습니다.');
      return;
    }

    if (selectedCategory && !selectedCategory.isActive) {
      toast.warning(
        `비활성 카테고리 "${selectedCategory.name}"에 도서를 추가합니다.`
      );
    }

    addBookToDiscoverCategory(
      bookId as number,
      parseInt(selectedCategoryId),
      selectedSubcategoryId &&
        selectedSubcategoryId !== 'none' &&
        selectedSubcategoryId !== 'all' &&
        !isNaN(parseInt(selectedSubcategoryId))
        ? parseInt(selectedSubcategoryId)
        : undefined,
      isbn
    )
      .then(() => {
        const statusText = selectedCategory?.isActive ? '' : ' (비활성)';
        toast.success(
          `도서가 ${selectedCategory?.name}${statusText} 카테고리에 추가되었습니다.`
        );
        queryClient.invalidateQueries({
          queryKey: ['admin-discover-category-books'],
        });
      })
      .catch(error => {
        console.error('도서 추가 오류:', error);
        toast.error('도서 추가 중 오류가 발생했습니다.');
      });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white p-2 md:p-3">
      <div className="mb-1 flex items-center justify-between md:mb-2">
        {searchResults.length > 0 && (
          <div className="rounded-full bg-gray-50 px-2 py-1 text-xs text-gray-500 md:px-3 md:text-sm">
            검색 결과:{' '}
            <span className="font-semibold text-gray-700">
              {totalSearchResults}권
            </span>
          </div>
        )}
      </div>

      {isSelectionComplete() ? (
        <>
          <div className="relative mb-1 md:mb-2">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="도서 제목, 저자, ISBN 등으로 검색"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="focus:ring-opacity-50 h-9 rounded-full border-gray-200 pr-10 pl-10 text-sm transition-all hover:border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 md:h-10 md:text-base"
            />
            <Search className="absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 transform text-gray-400 md:left-3.5 md:h-4 md:w-4" />
            {searchQuery && (
              <button
                className="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-gray-400 hover:text-gray-600 md:right-3.5"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3 md:h-4 md:w-4" />
              </button>
            )}
          </div>

          <div
            className="flex-1 overflow-y-auto rounded-lg border border-gray-100 shadow-sm [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent"
            onScroll={handleSearchScroll}
          >
            {searchQuery.length === 0 ? (
              <div className="flex h-full items-center justify-center p-6 text-center md:p-8">
                <div className="space-y-2 md:space-y-3">
                  <Search className="mx-auto h-6 w-6 text-gray-200 md:h-8 md:w-8" />
                  <h3 className="text-xs font-medium text-gray-700 md:text-sm">
                    도서를 검색하세요
                  </h3>
                  <p className="mx-auto max-w-xs text-xs text-gray-500">
                    도서 제목, 저자, ISBN 등으로 검색할 수 있습니다
                  </p>
                </div>
              </div>
            ) : isSearchLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500 md:h-8 md:w-8" />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-4 py-8 text-center md:py-12">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 md:mb-4 md:h-16 md:w-16">
                  <span className="text-2xl md:text-3xl">📚</span>
                </div>
                <h3 className="mb-1 text-base font-medium text-gray-800 md:text-lg">
                  검색 결과가 없습니다
                </h3>
                <p className="max-w-sm text-xs text-gray-500 md:text-sm">
                  다른 검색어를 입력해보세요
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {searchResults.map(book => {
                  const imageUrl = normalizeImageUrl(getImageUrl(book));

                  return (
                    <div
                      key={getBookIdentifier(book)}
                      className="group relative flex h-auto items-start gap-3 px-3 py-3 transition-colors hover:bg-gray-50 md:gap-4 md:px-4 md:py-4"
                    >
                      <div className="relative h-[120px] w-[80px] flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.1)] md:h-[145px] md:w-[100px]">
                        <img
                          src={imageUrl}
                          alt={book.title}
                          className="h-full w-full object-cover"
                          onError={e => {
                            e.currentTarget.src = '/images/no-image.png';
                          }}
                          loading="lazy"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-start pt-1">
                        <h4 className="line-clamp-3 text-sm font-medium text-gray-800 group-hover:text-gray-700 md:line-clamp-2 md:text-base">
                          {highlightText(book.title, searchQuery)}
                        </h4>

                        {book.author && (
                          <p className="mt-1 line-clamp-1 text-xs text-gray-500 md:mt-1.5 md:text-sm">
                            {book.author}
                          </p>
                        )}

                        {(book.publisher || book.publishDate) && (
                          <p className="mt-1 line-clamp-1 text-xs text-gray-500 md:text-sm">
                            {book.publisher && book.publishDate
                              ? `${book.publisher} · ${new Date(book.publishDate).getFullYear()}`
                              : book.publisher ||
                                (book.publishDate &&
                                  new Date(book.publishDate).getFullYear())}
                          </p>
                        )}

                        <div className="mt-1.5 flex flex-col gap-1 md:mt-2 md:flex-row md:items-center md:gap-3">
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

                          <div className="flex items-center md:border-l md:border-gray-200 md:pl-3">
                            <span className="text-xs text-gray-500 md:ml-1.5 md:text-sm">
                              리뷰{' '}
                              {book.reviews && book.reviews > 999
                                ? `${Math.floor(book.reviews / 1000)}k`
                                : book.reviews || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="ml-auto cursor-pointer self-center bg-blue-500 text-xs text-white shadow-sm transition-colors hover:bg-blue-600 hover:shadow md:text-sm"
                        onClick={() => addBookToCategory(book)}
                      >
                        추가
                      </Button>
                    </div>
                  );
                })}

                {isFetchingNextSearchPage && (
                  <div className="flex justify-center py-3 md:py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500 md:h-6 md:w-6" />
                  </div>
                )}

                {hasNextSearchPage && !isFetchingNextSearchPage && (
                  <div className="flex justify-center py-3 md:py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchNextSearchPage()}
                      className="text-xs md:text-sm"
                    >
                      더 보기
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center px-4 py-8 text-center md:py-12">
          <BookOpen className="mb-2 h-8 w-8 text-gray-200 md:mb-3 md:h-12 md:w-12" />
          <h3 className="mb-1 text-base font-medium text-gray-800 md:text-lg">
            카테고리 선택이 필요합니다
          </h3>
          <p className="max-w-sm text-xs text-gray-500 md:text-sm">
            도서 검색 및 추가를 위해 카테고리 및 서브카테고리를 선택해 주세요.
          </p>
        </div>
      )}
    </div>
  );
}
