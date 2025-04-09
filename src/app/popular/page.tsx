'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Book as ApiBook, Category as ApiCategory } from '@/apis';
import { getAllPopularBooks, getBookById } from '@/apis/book/book';
import { getAllCategories } from '@/apis/category/category';
import { Book, BookCard } from '@/components/BookCard';
import { BookDialog } from '@/components/BookDialog';
import {
  SortDropdown,
  TimeRange as UITimeRange,
} from '@/components/SortDropdown';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryParams } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';

import { CategoryFilter, PopularBreadcrumb } from './components';

// 스크롤바 숨기는 CSS 추가
const noScrollbarStyles = `
  /* 스크롤바 숨김 */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// 파스텔 색상 목록
const pastelColors = [
  '#FFD6E0', // 연한 분홍색
  '#FFEFB5', // 연한 노란색
  '#D1F0C2', // 연한 녹색
  '#C7CEEA', // 연한 파란색
  '#F1DEDE', // 연한 보라색
  '#E2F0CB', // 연한 민트색
  '#FFCBC1', // 연한 주황색
  '#CFE5F2', // 연한 하늘색
  '#FFDAC1', // 연한 살구색
  '#E2CFC4', // 연한 베이지색
];

// API Category를 UI Category로 변환하는 함수 (파스텔톤 컬러 적용)
const mapApiCategoriesToUiCategories = (
  apiCategories: ApiCategory[]
): {
  id: string;
  name: string;
  color: string;
  subcategories: Array<{ id: string; name: string }>;
}[] => {
  return [
    {
      id: 'all',
      name: '전체',
      color: '#E5E7EB',
      subcategories: [],
    },
    ...apiCategories.map((category, index) => ({
      id: category.id.toString(),
      name: category.name,
      // 서버에서 온 컬러가 있으면 사용, 없으면 파스텔 컬러 배열에서 선택
      color: category.color || pastelColors[index % pastelColors.length],
      subcategories: category.subCategories.map(sub => ({
        id: sub.id.toString(),
        name: sub.name,
      })),
    })),
  ];
};

// API Book을 UI Book으로 변환하는 함수
const mapApiBookToUiBook = (apiBook: ApiBook): Book => {
  return {
    id: apiBook.id,
    title: apiBook.title,
    author: apiBook.author,
    coverImage:
      apiBook.coverImage || `https://picsum.photos/seed/${apiBook.id}/240/360`,
    category: apiBook.category.id.toString(),
    subcategory: apiBook.subcategory?.id.toString() || '',
    rating:
      typeof apiBook.rating === 'string'
        ? parseFloat(apiBook.rating)
        : apiBook.rating || 0,
    reviews:
      typeof apiBook.reviews === 'string'
        ? parseInt(apiBook.reviews)
        : apiBook.reviews || 0,
    description: apiBook.description,
    publishDate: new Date(apiBook.publishDate).toISOString().split('T')[0],
    publisher: apiBook.publisher,
  };
};

export default function PopularPage() {
  const { updateQueryParams, getQueryParam } = useQueryParams();
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();

  // URL에서 현재 선택된 필터/정렬 값 및 책 정보 가져오기
  const categoryParam = getQueryParam('category') || 'all';
  const subcategoryParam = getQueryParam('subcategory') || '';
  const sortParam = getQueryParam('sort') || 'reviews-desc';
  const timeRangeParam = (getQueryParam('timeRange') as UITimeRange) || 'all';
  const bookIdParam = getQueryParam('book');

  // 카테고리 데이터 가져오기
  const { data: apiCategories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  // API 타입과 UI 타입 호환성 확보

  // 도서 데이터 가져오기
  const { data: apiBooks, isLoading: isBooksLoading } = useQuery({
    queryKey: [
      'popular-books',
      categoryParam,
      subcategoryParam,
      sortParam,
      timeRangeParam,
    ],
    queryFn: async () => {
      // API 요청 시 필요한 파라미터 구성
      const params: {
        sort?: string;
        timeRange?: string;
        category?: string;
        subcategory?: string;
      } = {};

      if (sortParam) params.sort = sortParam;
      if (timeRangeParam) params.timeRange = timeRangeParam;

      if (categoryParam !== 'all') {
        params.category = categoryParam;
      }

      if (subcategoryParam) {
        params.subcategory = subcategoryParam;
      }

      return getAllPopularBooks(params as any);
    },
    staleTime: 1000 * 60 * 2, // 2분 동안 캐시 유지
  });

  // 선택된 책 데이터 가져오기
  const { data: selectedApiBook } = useQuery({
    queryKey: ['book', bookIdParam],
    queryFn: () => (bookIdParam ? getBookById(parseInt(bookIdParam)) : null),
    enabled: !!bookIdParam,
    placeholderData: keepPreviousData,
  });

  // API 데이터 또는 폴백 데이터 사용
  const categories = apiCategories
    ? mapApiCategoriesToUiCategories(apiCategories)
    : [];

  const books = apiBooks ? apiBooks.map(mapApiBookToUiBook) : [];

  // selectedBook 상태 관리 - URL 파라미터 우선
  const [selectedBookState, setSelectedBookState] = useState<Book | null>(null);

  // URL이나 API에서 가져온 도서 정보 사용
  const bookFromUrl = React.useMemo(() => {
    if (selectedApiBook) {
      return mapApiBookToUiBook(selectedApiBook);
    }
    if (bookIdParam) {
      const bookId = parseInt(bookIdParam);
      return books.find(b => b.id === bookId) || null;
    }
    return null;
  }, [bookIdParam, selectedApiBook, books]);

  const selectedBook = bookFromUrl || selectedBookState;

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (categoryId: string) => {
    updateQueryParams({
      category: categoryId,
      subcategory: undefined,
    });
  };

  // 서브카테고리 클릭 핸들러
  const handleSubcategoryClick = (subcategoryId: string) => {
    updateQueryParams({ subcategory: subcategoryId });
  };

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (sortId: string) => {
    updateQueryParams({ sort: sortId });
  };

  // 기간 필터 변경 핸들러
  const handleTimeRangeChange = (timeRange: UITimeRange) => {
    updateQueryParams({ timeRange });
  };

  // URL params 초기화
  const handleClearFilters = () => {
    updateQueryParams({
      category: undefined,
      subcategory: undefined,
      sort: undefined,
      timeRange: undefined,
    });
  };

  // 책 선택 핸들러
  const handleBookSelect = (book: Book) => {
    setSelectedBookState(book);
    updateQueryParams({ book: book.id.toString() });
  };

  // 다이얼로그 상태 변경 핸들러
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedBookState(null);
      updateQueryParams({ book: undefined });
    }
  };

  // 다이얼로그가 열려있는지 여부
  const isDialogOpen = selectedBook !== null;

  // 로딩 상태 처리
  const isLoading = isCategoriesLoading || isBooksLoading;

  // URL 파라미터에서 필터 상태 초기화
  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    const subcategory = searchParams.get('subcategory') || '';
    const sort = searchParams.get('sort') || 'popular';

    updateQueryParams({
      category,
      subcategory,
      sort,
    });
  }, [searchParams, updateQueryParams]);

  return (
    <div className="bg-white pb-6">
      {/* CSS 스타일 추가 */}
      <style dangerouslySetInnerHTML={{ __html: noScrollbarStyles }} />

      {/* 브레드크럼 */}
      <div className="mx-auto w-full px-4 py-2">
        <PopularBreadcrumb
          selectedCategory={categoryParam}
          selectedSubcategory={subcategoryParam}
          categories={categories}
          onCategoryClick={handleCategoryClick}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* 필터 영역 - 스크롤 시 상단에 고정 */}
      <div className={`sticky top-[56px] z-30 bg-white`}>
        {/* 카테고리 필터와 정렬 옵션 */}
        <div className={`mx-auto w-full ${isMobile ? 'px-1' : 'px-4'} py-2`}>
          <div className="relative">
            {/* xl 이상 화면에서만 보이는 정렬 버튼 (오른쪽 위치) */}
            <div className="hidden xl:absolute xl:top-0 xl:right-0 xl:block">
              <SortDropdown
                selectedSort={sortParam}
                onSortChange={handleSortChange}
                selectedTimeRange={timeRangeParam}
                onTimeRangeChange={handleTimeRangeChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              {/* 카테고리 필터 - 로딩 상태일 때 스켈레톤 표시 */}
              {isCategoriesLoading ? (
                <div className="w-full">
                  <div
                    className={`no-scrollbar flex w-full overflow-x-auto ${isMobile ? 'mb-2 py-1' : 'mb-3 py-1'}`}
                  >
                    <div className="flex gap-2 px-0.5">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-9 w-20 rounded-full" />
                      ))}
                    </div>
                  </div>

                  {/* 서브카테고리 스켈레톤 */}
                  <div
                    className={`no-scrollbar flex w-full overflow-x-auto ${isMobile ? 'mb-2 py-1' : 'mb-4 py-1'}`}
                  >
                    <div className="flex gap-2 px-0.5">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-16 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <CategoryFilter
                  categories={categories}
                  selectedCategory={categoryParam}
                  selectedSubcategory={subcategoryParam}
                  onCategoryClick={handleCategoryClick}
                  onSubcategoryClick={handleSubcategoryClick}
                  className="w-full"
                />
              )}

              {/* xl 미만 화면에서 보이는 정렬 버튼 */}
              <div className="w-full xl:hidden">
                <SortDropdown
                  selectedSort={sortParam}
                  onSortChange={handleSortChange}
                  selectedTimeRange={timeRangeParam}
                  onTimeRangeChange={handleTimeRangeChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex h-[calc(100vh-250px)] w-full items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
        </div>
      ) : (
        <div className={`mx-auto w-full ${isMobile ? 'px-1' : 'px-4'} pt-4`}>
          {books.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {books.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={handleBookSelect}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-gray-50 py-12 text-center">
              <div className="text-3xl">📚</div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                검색 결과가 없습니다
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                다른 카테고리를 선택하거나 필터를 초기화해보세요.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleClearFilters}
              >
                필터 초기화
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 책 상세 정보 Dialog */}
      {selectedBook && (
        <BookDialog
          book={{
            ...selectedBook,
            coverImage:
              selectedBook.coverImage ||
              `https://picsum.photos/seed/${selectedBook.id}/400/600`,
            toc: `제1장 도입부\n제2장 본론\n  제2.1절 첫 번째 주제\n  제2.2절 두 번째 주제\n제3장 결론`,
            authorInfo: `${selectedBook.author}는 해당 분야에서 20년 이상의 경력을 가진 저명한 작가입니다. 여러 저서를 통해 독자들에게 새로운 시각과 통찰을 제공해왔습니다.`,
            tags: [
              '베스트셀러',
              selectedBook.category,
              selectedBook.subcategory,
            ],
            publisher: selectedBook.publisher,
            publishDate: selectedBook.publishDate,
            description: selectedBook.description,
            reviews: [
              {
                id: 1,
                user: {
                  name: '김독서',
                  avatar: `https://i.pravatar.cc/150?u=user1`,
                },
                rating: 4.5,
                content:
                  '정말 좋은 책이었습니다. 깊이 있는 통찰과 함께 현대적 해석이 인상적이었습니다.',
                date: '2024-03-15',
                likes: 24,
                comments: 8,
              },
              {
                id: 2,
                user: {
                  name: '이책벌레',
                  avatar: `https://i.pravatar.cc/150?u=user2`,
                },
                rating: 5,
                content:
                  '필독서입니다. 이 분야에 관심이 있는 분들이라면 꼭 읽어보세요.',
                date: '2024-02-28',
                likes: 32,
                comments: 12,
              },
            ],
            similarBooks: books.slice(0, 3).map(book => ({
              ...book,
              coverImage:
                book.coverImage ||
                `https://picsum.photos/seed/${book.id}/240/360`,
            })),
          }}
          open={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
        />
      )}
    </div>
  );
}
