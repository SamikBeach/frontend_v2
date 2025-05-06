import {
  addBookToDiscoverCategory,
  getDiscoverBooks,
  removeBookFromDiscoverCategory,
} from '@/apis/book/book';
import { getAllDiscoverCategories } from '@/apis/discover-category/discover-category';
import { searchBooks } from '@/apis/search';
import { SearchResult } from '@/apis/search/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  BookOpen,
  Loader2,
  MessageSquare,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface ManageDiscoverBooksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageDiscoverBooksDialog({
  open,
  onOpenChange,
}: ManageDiscoverBooksDialogProps) {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // 상태 관리
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    useState<string>('all');

  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchScrollContainerRef = useRef<HTMLDivElement>(null);

  // 카테고리 데이터 가져오기 - 다이얼로그가 열렸을 때만 호출
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['discover-categories-management'],
    queryFn: getAllDiscoverCategories,
    enabled: open, // 다이얼로그가 열렸을 때만 API 호출
  });

  // 카테고리 통계 대신 기본 상태 제공
  const [categoryStats, setcategoryStats] = useState(null);
  const isStatsLoading = false;

  // 선택이 완료되었는지 확인하는 함수
  const isSelectionComplete = useCallback(() => {
    if (!selectedCategoryId) return false;

    // 선택된 카테고리가 서브카테고리를 가지고 있는지 확인
    const category = categories.find(
      c => c.id.toString() === selectedCategoryId
    );
    if (!category) return false;

    // 서브카테고리가 있는 경우, 서브카테고리도 선택되어야 함
    if (category.subCategories && category.subCategories.length > 0) {
      // 서브카테고리가 선택되었는지 확인 (숫자 형태의 ID인지 확인)
      return (
        selectedSubcategoryId !== '' &&
        selectedSubcategoryId !== 'none' &&
        !isNaN(parseInt(selectedSubcategoryId))
      );
    }

    // 서브카테고리가 없는 경우, 카테고리만 선택되어도 완료
    return true;
  }, [selectedCategoryId, selectedSubcategoryId, categories]);

  // 카테고리가 로드되면 첫 번째 카테고리 선택
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id.toString());

      // 첫 번째 카테고리에 서브카테고리가 있는 경우, 첫 번째 서브카테고리 선택
      const firstCategory = categories[0];
      if (
        firstCategory.subCategories &&
        firstCategory.subCategories.length > 0
      ) {
        setSelectedSubcategoryId(firstCategory.subCategories[0].id.toString());
      } else {
        setSelectedSubcategoryId('');
      }
    }
  }, [categories, selectedCategoryId]);

  // 카테고리 도서 목록 가져오기
  const { data: booksResponse, isLoading: isBooksLoading } = useQuery({
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

      // API 호출 로직
      return getDiscoverBooks({
        discoverCategoryId: categoryId,
        discoverSubCategoryId: subcategoryId,
        limit: 100, // 관리 페이지에서는 많은 결과를 한번에 로드
      });
    },
    enabled: open && isSelectionComplete(), // 다이얼로그가 열린 상태이고 카테고리 선택이 완료된 경우만 호출
  });

  // books 데이터 처리
  const booksData = booksResponse?.books || [];

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
    enabled: open && debouncedSearchQuery.trim() !== '', // 다이얼로그가 열린 상태이고 검색어가 있는 경우만 호출
  });

  // 검색 결과 처리
  const searchResults = searchData?.pages.flatMap(page => page.books) || [];
  const totalSearchResults = searchData?.pages[0]?.total || 0;

  // 도서 제거 뮤테이션
  const { mutate: removeBookMutation, isPending: isRemoving } = useMutation({
    mutationFn: (bookId: number) => removeBookFromDiscoverCategory(bookId),
    onSuccess: () => {
      toast.success('도서가 발견하기 카테고리에서 제거되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['discover-books-management'],
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-discover-category-books'],
      });
    },
    onError: () => {
      toast.error('도서 제거 중 오류가 발생했습니다.');
    },
  });

  // 도서 추가 뮤테이션
  const { mutate: addBookMutation, isPending: isAdding } = useMutation({
    mutationFn: ({
      bookId,
      categoryId,
      subcategoryId,
      isbn,
    }: {
      bookId: number;
      categoryId: number;
      subcategoryId?: number;
      isbn?: string;
    }) => addBookToDiscoverCategory(bookId, categoryId, subcategoryId, isbn),
    onSuccess: () => {
      toast.success('도서가 발견하기 카테고리에 추가되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['discover-books-management'],
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-discover-category-books'],
      });
    },
    onError: () => {
      toast.error('도서 추가 중 오류가 발생했습니다.');
    },
  });

  // 현재 선택된 카테고리
  const selectedCategory = categories.find(
    c => c.id.toString() === selectedCategoryId
  );

  // 현재 선택된 서브카테고리
  const selectedSubcategory = selectedCategory?.subCategories.find(
    s => s.id.toString() === selectedSubcategoryId
  );

  // 무한 스크롤을 위한 이벤트 리스너
  useEffect(() => {
    if (!open || debouncedSearchQuery.trim() === '') return; // 다이얼로그가 닫혀있거나 검색어가 없으면 리턴

    const scrollContainer = searchScrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollHandler = () => {
      if (!hasNextSearchPage || isFetchingNextSearchPage) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        fetchNextSearchPage();
      }
    };

    scrollContainer.addEventListener('scroll', scrollHandler);
    return () => {
      scrollContainer.removeEventListener('scroll', scrollHandler);
    };
  }, [
    open,
    debouncedSearchQuery,
    hasNextSearchPage,
    isFetchingNextSearchPage,
    fetchNextSearchPage,
  ]);

  // 스크롤 이벤트 핸들러
  const handleSearchScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasNextSearchPage || isFetchingNextSearchPage) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // 스크롤이 하단에 가까워지면 다음 페이지 로드
    if (scrollHeight - scrollTop - clientHeight < 200) {
      fetchNextSearchPage();
    }
  };

  // 카테고리 변경 시 서브카테고리 처리 함수
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);

    // 선택된 카테고리의 서브카테고리 정보 확인
    const category = categories.find(c => c.id.toString() === categoryId);
    if (
      category &&
      category.subCategories &&
      category.subCategories.length > 0
    ) {
      // 서브카테고리가 있으면 첫 번째 서브카테고리 선택
      setSelectedSubcategoryId(category.subCategories[0].id.toString());
    } else {
      // 서브카테고리가 없으면 빈 값으로 설정
      setSelectedSubcategoryId('');
    }
  };

  useEffect(() => {
    // 다이얼로그가 열릴 때 검색 입력란에 포커스
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    }
  }, [open]);

  // 다이얼로그가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      // 카테고리 선택은 유지 (다음에 다이얼로그를 열었을 때 이전 카테고리 선택 상태를 보여줌)
    }
  }, [open]);

  // 검색 결과에서 도서를 카테고리에 즉시 추가하는 함수
  const addBookToCategory = (book: SearchResult): void => {
    // 다이얼로그가 닫혀있으면 작업을 수행하지 않음
    if (!open) return;

    // 책의 ID와 ISBN을 추출
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

    // bookId와 isbn 모두 없는 경우에만 에러 메시지 표시
    if ((bookId === undefined || bookId === null) && !isbn) {
      toast.error('도서 ID 또는 ISBN 정보가 없어 추가할 수 없습니다.');
      return;
    }

    // 바로 현재 선택된 카테고리에 추가
    addBookToDiscoverCategory(
      bookId as number,
      parseInt(selectedCategoryId),
      selectedSubcategoryId &&
        selectedSubcategoryId !== 'none' &&
        selectedSubcategoryId !== 'all'
        ? parseInt(selectedSubcategoryId)
        : undefined,
      isbn
    )
      .then(() => {
        toast.success(
          `도서가 ${selectedCategory?.name} 카테고리에 추가되었습니다.`
        );
        queryClient.invalidateQueries({
          queryKey: ['discover-books-management'],
        });
        queryClient.invalidateQueries({
          queryKey: [
            'admin-discover-category-books',
            parseInt(selectedCategoryId),
            selectedSubcategoryId !== 'all'
              ? parseInt(selectedSubcategoryId)
              : undefined,
          ],
        });
      })
      .catch(error => {
        console.error('도서 추가 오류:', error);
        toast.error('도서 추가 중 오류가 발생했습니다.');
      });
  };

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
  const normalizeImageUrl = (url: string): string => {
    if (!url) return '/images/no-image.png';
    return url.replace(/^https?:\/\//, '//');
  };

  // Book 또는 SearchResult 타입의 객체에서 이미지 URL을 안전하게 추출하는 함수
  const getImageUrl = (book: SearchResult): string => {
    return book.coverImage || book.image || '/images/no-image.png';
  };

  // SearchResult의 ID를 안전하게 추출하는 함수
  const getBookId = (book: SearchResult): number => {
    const bookId = book.bookId;
    const id = book.id;

    return bookId !== undefined && bookId !== null
      ? bookId
      : id !== undefined && id !== null
        ? id
        : -1;
  };

  // 책 식별자 생성 헬퍼 함수
  const getBookIdentifier = (book: SearchResult): string => {
    const isbn = book.isbn || '';
    const isbn13 = book.isbn13 || '';
    return `${isbn}-${isbn13}-${book.title}`;
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[95vh] w-[1600px] min-w-[70vw] overflow-hidden rounded-xl p-0 shadow-lg md:p-0">
        <div className="flex h-full flex-col">
          <ResponsiveDialogHeader className="border-b border-gray-100 bg-white p-5">
            <ResponsiveDialogTitle className="text-xl font-semibold text-gray-900">
              발견하기 도서 관리
            </ResponsiveDialogTitle>
          </ResponsiveDialogHeader>

          <div className="grid h-[80vh] grid-cols-1 overflow-hidden lg:grid-cols-2 lg:divide-x lg:divide-gray-100">
            {/* 왼쪽: 현재 카테고리 도서 목록 */}
            <div className="flex h-full flex-col overflow-hidden bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">
                  카테고리 도서 관리
                </h3>
                {booksData.length > 0 && (
                  <div className="rounded-full bg-gray-50 px-3 py-1 text-sm text-gray-500">
                    총{' '}
                    <span className="font-semibold text-gray-700">
                      {booksData.length}권
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-5 flex flex-wrap items-end gap-4">
                <div className="flex-1 space-y-1.5">
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-700"
                  >
                    카테고리
                  </Label>
                  <Select
                    value={selectedCategoryId}
                    onValueChange={value => {
                      handleCategoryChange(value);
                    }}
                  >
                    <SelectTrigger
                      id="category"
                      className="h-10 cursor-pointer border-gray-200 transition-all hover:border-gray-300 focus:ring-2 focus:ring-blue-100"
                    >
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent className="border border-gray-100 shadow-md">
                      {categories.map(category => {
                        return (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                            className="cursor-pointer hover:bg-gray-50"
                          >
                            {category.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory &&
                  selectedCategory.subCategories.length > 0 && (
                    <div className="flex-1 space-y-1.5">
                      <Label
                        htmlFor="subcategory"
                        className="text-sm font-medium text-gray-700"
                      >
                        서브카테고리
                      </Label>
                      <Select
                        value={selectedSubcategoryId}
                        onValueChange={value => {
                          setSelectedSubcategoryId(value);
                        }}
                      >
                        <SelectTrigger
                          id="subcategory"
                          className="h-10 cursor-pointer border-gray-200 transition-all hover:border-gray-300 focus:ring-2 focus:ring-blue-100"
                        >
                          <SelectValue placeholder="서브카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent className="border border-gray-100 shadow-md">
                          {selectedCategory.subCategories.map(subcategory => {
                            return (
                              <SelectItem
                                key={subcategory.id}
                                value={subcategory.id.toString()}
                                className="cursor-pointer hover:bg-gray-50"
                              >
                                {subcategory.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
              </div>

              <ScrollArea className="flex-1 rounded-lg border border-gray-100 shadow-sm">
                {!isSelectionComplete() ? (
                  <div className="flex h-full flex-col items-center justify-center px-4 py-12 text-center">
                    <BookOpen className="mb-3 h-12 w-12 text-gray-200" />
                    <h3 className="mb-1 text-lg font-medium text-gray-800">
                      카테고리 선택이 필요합니다
                    </h3>
                    <p className="max-w-sm text-sm text-gray-500">
                      카테고리 및 서브카테고리를 선택해 주세요.
                    </p>
                  </div>
                ) : isBooksLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : booksData.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center px-4 py-12 text-center">
                    <BookOpen className="mb-3 h-12 w-12 text-gray-200" />
                    <h3 className="mb-1 text-lg font-medium text-gray-800">
                      도서가 없습니다
                    </h3>
                    <p className="max-w-sm text-sm text-gray-500">
                      이 카테고리에 추가된 도서가 없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {booksData.map(book => (
                      <div
                        key={book.id}
                        className="flex items-start gap-4 p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
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
                          <h4 className="line-clamp-1 font-medium text-gray-900">
                            {book.title}
                          </h4>
                          <p className="line-clamp-1 text-sm text-gray-500">
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
                          className="h-8 w-8 flex-shrink-0 cursor-pointer rounded-full text-gray-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                          onClick={() => removeBookMutation(book.id)}
                          disabled={isRemoving}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* 오른쪽: 도서 검색 및 추가 */}
            <div className="flex h-full flex-col overflow-hidden bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">
                  도서 검색 및 추가
                </h3>
                {searchResults.length > 0 && (
                  <div className="rounded-full bg-gray-50 px-3 py-1 text-sm text-gray-500">
                    검색 결과:{' '}
                    <span className="font-semibold text-gray-700">
                      {totalSearchResults}권
                    </span>
                  </div>
                )}
              </div>

              {isSelectionComplete() ? (
                <>
                  <div className="relative mb-5">
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="도서 제목, 저자, ISBN 등으로 검색"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="focus:ring-opacity-50 h-10 rounded-full border-gray-200 pr-10 pl-10 transition-all hover:border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                    />
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    {searchQuery && (
                      <button
                        className="absolute top-1/2 right-3.5 -translate-y-1/2 transform cursor-pointer text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchQuery('')}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div
                    ref={searchScrollContainerRef}
                    className="flex-1 overflow-y-auto rounded-lg border border-gray-100 shadow-sm [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent"
                    onScroll={handleSearchScroll}
                  >
                    {searchQuery.length === 0 ? (
                      <div className="flex h-full items-center justify-center p-8 text-center">
                        <div className="space-y-3">
                          <Search className="mx-auto h-8 w-8 text-gray-200" />
                          <h3 className="text-sm font-medium text-gray-700">
                            도서를 검색하세요
                          </h3>
                          <p className="mx-auto max-w-xs text-xs text-gray-500">
                            도서 제목, 저자, ISBN 등으로 검색할 수 있습니다
                          </p>
                        </div>
                      </div>
                    ) : isSearchLoading ? (
                      <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center px-4 py-12 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                          <span className="text-3xl">📚</span>
                        </div>
                        <h3 className="mb-1 text-lg font-medium text-gray-800">
                          검색 결과가 없습니다
                        </h3>
                        <p className="max-w-sm text-sm text-gray-500">
                          다른 검색어를 입력해보세요
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {searchResults.map(book => {
                          const imageUrl = normalizeImageUrl(getImageUrl(book));
                          const bookId = getBookId(book);

                          return (
                            <div
                              key={getBookIdentifier(book)}
                              className="group relative flex h-auto items-start gap-4 px-4 py-4 transition-colors hover:bg-gray-50"
                            >
                              <div className="relative h-[145px] w-[100px] flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
                                <img
                                  src={imageUrl}
                                  alt={book.title}
                                  className="h-full w-full object-cover"
                                  onError={e => {
                                    e.currentTarget.src =
                                      '/images/no-image.png';
                                  }}
                                  loading="lazy"
                                />
                              </div>

                              <div className="flex min-w-0 flex-1 flex-col justify-start pt-1">
                                <h4 className="line-clamp-2 text-base font-medium text-gray-800 group-hover:text-gray-700">
                                  {highlightText(book.title, searchQuery)}
                                </h4>

                                {book.author && (
                                  <p className="mt-1.5 line-clamp-1 text-sm text-gray-500">
                                    {book.author}
                                  </p>
                                )}

                                <div className="mt-2 flex items-center gap-3">
                                  <div className="flex items-center">
                                    {renderStarRating(book.rating)}
                                    <span className="mx-1.5 text-sm font-medium text-gray-800">
                                      {typeof book.rating === 'number'
                                        ? book.rating.toFixed(1)
                                        : book.rating || '0.0'}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      ({book.totalRatings || 0})
                                    </span>
                                  </div>

                                  <div className="flex items-center border-l border-gray-200 pl-3">
                                    <MessageSquare className="h-4 w-4 text-gray-400" />
                                    <span className="ml-1.5 text-sm text-gray-500">
                                      {book.reviews && book.reviews > 999
                                        ? `${Math.floor(book.reviews / 1000)}k`
                                        : book.reviews || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <Button
                                size="sm"
                                className="ml-auto cursor-pointer self-center bg-blue-500 text-white shadow-sm transition-colors hover:bg-blue-600 hover:shadow"
                                onClick={() => addBookToCategory(book)}
                              >
                                추가
                              </Button>
                            </div>
                          );
                        })}

                        {isFetchingNextSearchPage && (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-4 py-12 text-center">
                  <BookOpen className="mb-3 h-12 w-12 text-gray-200" />
                  <h3 className="mb-1 text-lg font-medium text-gray-800">
                    카테고리 선택이 필요합니다
                  </h3>
                  <p className="max-w-sm text-sm text-gray-500">
                    도서 검색 및 추가를 위해 카테고리 및 서브카테고리를 선택해
                    주세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
