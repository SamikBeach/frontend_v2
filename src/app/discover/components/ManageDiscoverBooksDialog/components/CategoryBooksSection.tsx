import { getDiscoverBooks } from '@/apis/book/book';
import { Book, BookSearchResponse } from '@/apis/book/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebounce } from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Loader2, Search, Trash2, X } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useDiscoverCategories } from '../../../hooks/useDiscoverCategories';
import { useBookMutations, useCategorySelection } from '../hooks';
import { CategoryBooksListProps } from '../types';
import { CategorySelector } from './CategorySelector';

// 상수 정의
const DEBOUNCE_DELAY = 300;
const BOOKS_LIMIT = 100;

export function CategoryBooksSection({ open }: CategoryBooksListProps) {
  const { selectedCategoryId, selectedSubcategoryId } = useCategorySelection();
  const { categories } = useDiscoverCategories({ includeInactive: true });
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { removeBookMutation } = useBookMutations();
  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

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

  // 카테고리 도서 목록 가져오기
  const { data: booksResponse, isLoading: isBooksLoading } =
    useQuery<BookSearchResponse>({
      queryKey: [
        'admin-discover-category-books',
        selectedCategoryId ? parseInt(selectedCategoryId) : 0,
        selectedSubcategoryId && selectedSubcategoryId !== 'all'
          ? parseInt(selectedSubcategoryId)
          : undefined,
      ],
      queryFn: () => {
        const categoryId = parseInt(selectedCategoryId);
        const subcategoryId =
          selectedSubcategoryId && selectedSubcategoryId !== 'all'
            ? parseInt(selectedSubcategoryId)
            : undefined;

        return getDiscoverBooks({
          discoverCategoryId: categoryId,
          discoverSubCategoryId: subcategoryId,
          limit: BOOKS_LIMIT,
        });
      },
      enabled: Boolean(open && isSelectionComplete()),
    });

  const booksData = booksResponse?.books || [];

  // 검색 필터링된 도서 목록
  const filteredBooks = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return booksData;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return booksData.filter(
      book =>
        book.title.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.publisher?.toLowerCase().includes(query) ||
        book.isbn?.includes(query) ||
        book.isbn13?.includes(query)
    );
  }, [booksData, debouncedSearchQuery]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white p-2 md:p-3">
      <div className="mb-1 flex items-center justify-between md:mb-2">
        {booksData.length > 0 && (
          <div className="rounded-full bg-gray-50 px-2 py-1 text-xs text-gray-500 md:px-3 md:text-sm">
            {searchQuery ? (
              <>
                검색 결과:{' '}
                <span className="font-semibold text-gray-700">
                  {filteredBooks.length}권
                </span>
                {' / 총 '}
                <span className="font-semibold text-gray-700">
                  {booksData.length}권
                </span>
              </>
            ) : (
              <>
                총{' '}
                <span className="font-semibold text-gray-700">
                  {booksData.length}권
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mb-1 md:mb-2">
        <CategorySelector />
      </div>

      {isSelectionComplete() && booksData.length > 0 && (
        <div className="relative mb-1 md:mb-2">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="도서 제목, 저자, 출판사, ISBN으로 검색"
            value={searchQuery}
            onChange={useCallback(
              (e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value),
              []
            )}
            className="focus:ring-opacity-50 h-9 rounded-full border-gray-200 pr-10 pl-10 text-sm transition-all hover:border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 md:h-10 md:text-base"
          />
          <Search className="absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 transform text-gray-400 md:left-3.5 md:h-4 md:w-4" />
          {searchQuery && (
            <button
              className="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-gray-400 hover:text-gray-600 md:right-3.5"
              onClick={useCallback(() => setSearchQuery(''), [])}
            >
              <X className="h-3 w-3 md:h-4 md:w-4" />
            </button>
          )}
        </div>
      )}

      <ScrollArea className="flex-1 rounded-lg border border-gray-100 shadow-sm">
        {!isSelectionComplete() ? (
          <div className="flex h-full flex-col items-center justify-center px-4 py-8 text-center md:py-12">
            <BookOpen className="mb-2 h-8 w-8 text-gray-200 md:mb-3 md:h-12 md:w-12" />
            <h3 className="mb-1 text-base font-medium text-gray-800 md:text-lg">
              카테고리 선택이 필요합니다
            </h3>
            <p className="max-w-sm text-xs text-gray-500 md:text-sm">
              카테고리 및 서브카테고리를 선택해 주세요.
            </p>
          </div>
        ) : isBooksLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500 md:h-8 md:w-8" />
          </div>
        ) : booksData.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 py-8 text-center md:py-12">
            <BookOpen className="mb-2 h-8 w-8 text-gray-200 md:mb-3 md:h-12 md:w-12" />
            <h3 className="mb-1 text-base font-medium text-gray-800 md:text-lg">
              도서가 없습니다
            </h3>
            <p className="max-w-sm text-xs text-gray-500 md:text-sm">
              이 카테고리에 추가된 도서가 없습니다.
            </p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 py-8 text-center md:py-12">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 md:mb-4 md:h-16 md:w-16">
              <span className="text-2xl md:text-3xl">🔍</span>
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
            {filteredBooks.map((book: Book) => (
              <div
                key={book.id}
                className="flex items-start gap-3 p-3 transition-colors hover:bg-gray-50 md:gap-4 md:p-4"
              >
                <div className="h-16 w-11 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm md:h-20 md:w-14">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-full w-full object-cover"
                    onError={e => {
                      e.currentTarget.src = '/images/no-image.png';
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-sm font-medium text-gray-900 md:line-clamp-1 md:text-base">
                    {book.title}
                  </h4>
                  <p className="line-clamp-1 text-xs text-gray-500 md:text-sm">
                    {book.author}
                  </p>
                  {(book.publisher || book.publishDate) && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {book.publisher && book.publishDate
                          ? `${book.publisher} · ${new Date(book.publishDate).getFullYear()}`
                          : book.publisher ||
                            (book.publishDate &&
                              new Date(book.publishDate).getFullYear())}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 flex-shrink-0 cursor-pointer rounded-full text-gray-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 md:h-8 md:w-8"
                  onClick={() => removeBookMutation.mutate(book.id)}
                  disabled={removeBookMutation.isPending}
                >
                  <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
