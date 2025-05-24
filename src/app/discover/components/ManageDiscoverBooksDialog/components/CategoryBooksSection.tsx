import { getDiscoverBooks } from '@/apis/book/book';
import { Book, BookSearchResponse } from '@/apis/book/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Loader2, Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { useDiscoverCategories } from '../../../hooks/useDiscoverCategories';
import { useBookMutations, useCategorySelection } from '../hooks';
import { CategoryBooksListProps } from '../types';
import { CategorySelector } from './CategorySelector';

export function CategoryBooksSection({ open }: CategoryBooksListProps) {
  const { selectedCategoryId, selectedSubcategoryId } = useCategorySelection();
  const { categories } = useDiscoverCategories({ includeInactive: true });

  const { removeBookMutation } = useBookMutations();

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
          limit: 100,
        });
      },
      enabled: Boolean(open && isSelectionComplete()),
    });

  const booksData = booksResponse?.books || [];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white p-3 md:p-5">
      <div className="mb-2 flex items-center justify-between md:mb-3">
        <h3 className="text-base font-medium text-gray-800 md:text-lg">
          카테고리 도서 관리
        </h3>
        {booksData.length > 0 && (
          <div className="rounded-full bg-gray-50 px-2 py-1 text-xs text-gray-500 md:px-3 md:text-sm">
            총{' '}
            <span className="font-semibold text-gray-700">
              {booksData.length}권
            </span>
          </div>
        )}
      </div>

      <div className="mb-1 md:mb-2">
        <CategorySelector />
      </div>

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
        ) : (
          <div className="divide-y divide-gray-100">
            {booksData.map((book: Book) => (
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
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {book.publisher} ·{' '}
                      {new Date(book.publishDate).getFullYear()}
                    </span>
                  </div>
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
