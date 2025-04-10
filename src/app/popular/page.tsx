'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getAllPopularBooks } from '@/apis/book/book';
import { TimeRange as ApiTimeRange, Book } from '@/apis/book/types';
import { getAllCategories } from '@/apis/category/category';
import { BookCard } from '@/components/BookCard';
import { BookDialog } from '@/components/BookDialog';
import { SortDropdown, TimeRange } from '@/components/SortDropdown';
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

// UI 컴포넌트에서 사용할 카테고리 타입
interface UICategory {
  id: string;
  name: string;
  color: string;
  subcategories: Array<{ id: string; name: string }>;
}

export default function PopularPage() {
  const { updateQueryParams, getQueryParam } = useQueryParams();
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();

  // URL 파라미터 가져오기
  const categoryParam = getQueryParam('category') || 'all';
  const subcategoryParam = getQueryParam('subcategory') || '';
  const sortParam = getQueryParam('sort') || 'reviews-desc';
  const timeRangeParam = (getQueryParam('timeRange') as ApiTimeRange) || 'all';
  const bookIdParam = getQueryParam('book');

  // 카테고리 데이터 가져오기
  const { data: rawCategories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  // 도서 데이터 가져오기
  const { data: books, isLoading: isBooksLoading } = useQuery({
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

  // 카테고리 데이터에 컬러 추가 및 UI 형식으로 변환
  const categories = useMemo<UICategory[]>(() => {
    if (!rawCategories) return [];

    // 전체 카테고리 옵션 추가
    const formattedCategories: UICategory[] = [
      {
        id: 'all',
        name: '전체',
        color: '#E5E7EB',
        subcategories: [],
      },
    ];

    // 각 카테고리에 색상 부여하고 형식 변환
    rawCategories.forEach((category, index) => {
      formattedCategories.push({
        id: category.id.toString(),
        name: category.name,
        color: pastelColors[index % pastelColors.length],
        subcategories: category.subCategories.map(sub => ({
          id: sub.id.toString(),
          name: sub.name,
        })),
      });
    });

    return formattedCategories;
  }, [rawCategories]);

  // 선택된 책 상태 관리 - 북 카드 클릭시 설정됨
  const [selectedBookState, setSelectedBookState] = useState<Book | null>(null);

  // URL 파라미터에서 책 ID를 가져와 해당 책 찾기
  const selectedBook = useMemo(() => {
    if (!bookIdParam || !books) return null;

    const bookId = parseInt(bookIdParam);
    return books.find(book => book.id === bookId) || selectedBookState;
  }, [bookIdParam, books, selectedBookState]);

  // 카테고리 클릭 핸들러
  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      updateQueryParams({
        category: categoryId,
        subcategory: undefined,
      });
    },
    [updateQueryParams]
  );

  // 서브카테고리 클릭 핸들러
  const handleSubcategoryClick = useCallback(
    (subcategoryId: string) => {
      updateQueryParams({ subcategory: subcategoryId });
    },
    [updateQueryParams]
  );

  // 정렬 옵션 변경 핸들러
  const handleSortChange = useCallback(
    (sortId: string) => {
      updateQueryParams({ sort: sortId });
    },
    [updateQueryParams]
  );

  // 기간 필터 변경 핸들러
  const handleTimeRangeChange = useCallback(
    (timeRange: TimeRange) => {
      // UI TimeRange를 API TimeRange로 변환
      let apiTimeRange: ApiTimeRange;

      // UI TimeRange가 API TimeRange와 호환되는 경우만 사용
      if (
        timeRange === 'all' ||
        timeRange === 'month' ||
        timeRange === 'year'
      ) {
        apiTimeRange = timeRange;
      } else {
        // 호환되지 않는 값은 기본값으로 설정
        apiTimeRange = 'all';
      }

      updateQueryParams({ timeRange: apiTimeRange });
    },
    [updateQueryParams]
  );

  // URL params 초기화
  const handleClearFilters = useCallback(() => {
    updateQueryParams({
      category: undefined,
      subcategory: undefined,
      sort: undefined,
      timeRange: undefined,
    });
  }, [updateQueryParams]);

  // 책 선택 핸들러
  const handleBookSelect = useCallback(
    (book: Book) => {
      setSelectedBookState(book);
      updateQueryParams({ book: book.id.toString() });
    },
    [updateQueryParams]
  );

  // 다이얼로그 상태 변경 핸들러
  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      // 다이얼로그가 닫히면 URL에서 book 파라미터 제거
      if (!open) {
        console.log('dialog closing, removing book param');
        setSelectedBookState(null); // 선택된 책 상태도 초기화
        updateQueryParams({ book: undefined });
      }
    },
    [updateQueryParams]
  );

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
          {books && books.length > 0 ? (
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
          book={selectedBook}
          open={!!selectedBook}
          onOpenChange={handleDialogOpenChange}
        />
      )}
    </div>
  );
}
