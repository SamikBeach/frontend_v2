'use client';

import React, { useState } from 'react';

import { CategoryFilter } from '@/app/popular/components/CategoryFilter';
import { Book } from '@/components/BookCard';
import { BookDialog } from '@/components/BookDialog';
import { SortDropdown, TimeRange } from '@/components/SortDropdown';
import { useQueryParams } from '@/hooks';

import { BookCarousel, BookGrid, DiscoverBreadcrumb } from './components';
import { allBooks, allCollections, curationCategories } from './data';

export default function DiscoverPage() {
  const { updateQueryParams, getQueryParam } = useQueryParams();

  // URL에서 현재 선택된 필터/정렬 값 및 책 정보 가져오기
  const categoryParam = getQueryParam('category') || 'all';
  const subcategoryParam = getQueryParam('subcategory') || '';
  const sortParam = getQueryParam('sort') || 'reviews-desc';
  const timeRangeParam = (getQueryParam('timeRange') as TimeRange) || 'all';
  const bookIdParam = getQueryParam('book');

  // URL의 book ID에 해당하는 책 찾기
  const bookFromUrl = React.useMemo(() => {
    if (bookIdParam) {
      const bookId = parseInt(bookIdParam);
      return allBooks.find(b => b.id === bookId) || null;
    }
    return null;
  }, [bookIdParam]);

  // selectedBook 상태 관리 - URL 파라미터 우선
  const [selectedBookState, setSelectedBookState] = useState<Book | null>(null);
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
  const handleTimeRangeChange = (timeRange: TimeRange) => {
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

  // 필터링 로직
  let visibleCollections = Object.values(allCollections);

  if (categoryParam !== 'all') {
    visibleCollections = visibleCollections.filter(
      collection => collection.category === categoryParam
    );

    if (subcategoryParam) {
      visibleCollections = visibleCollections.filter(
        collection => collection.id === subcategoryParam
      );
    }
  }

  return (
    <div className="bg-white">
      {/* 브레드크럼 */}
      <div className="mx-auto w-full px-6 py-2">
        <DiscoverBreadcrumb
          selectedCategory={categoryParam}
          selectedSubcategory={subcategoryParam}
          categories={curationCategories}
          onCategoryClick={handleCategoryClick}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* 카테고리 필터와 정렬 옵션 */}
      <div className="mx-auto w-full px-6 pt-3 pb-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <CategoryFilter
            categories={curationCategories}
            selectedCategory={categoryParam}
            selectedSubcategory={subcategoryParam}
            onCategoryClick={handleCategoryClick}
            onSubcategoryClick={handleSubcategoryClick}
          />

          {subcategoryParam && (
            <SortDropdown
              selectedSort={sortParam}
              onSortChange={handleSortChange}
              className="ml-auto"
              selectedTimeRange={timeRangeParam}
              onTimeRangeChange={handleTimeRangeChange}
            />
          )}
        </div>

        {/* 컬렉션 리스트 */}
        <div className="mt-6">
          {visibleCollections.length > 0 ? (
            <>
              {visibleCollections.map(collection => (
                <div key={collection.id} className="mb-10">
                  <h2 className="mb-4 text-[17px] font-semibold text-gray-900">
                    {collection.title}
                  </h2>
                  {subcategoryParam ? (
                    // 세부 카테고리가 선택된 경우 그리드 형태로 표시
                    <BookGrid
                      books={collection.books}
                      onSelectBook={handleBookSelect}
                      selectedSort={sortParam}
                      selectedTimeRange={timeRangeParam}
                    />
                  ) : (
                    // 세부 카테고리가 선택되지 않은 경우 캐러셀 형태로 표시
                    <BookCarousel
                      books={collection.books}
                      onSelectBook={handleBookSelect}
                    />
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50">
              <p className="text-gray-500">
                선택한 카테고리에 해당하는 큐레이션이 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 책 상세 정보 Dialog */}
      {selectedBook && (
        <BookDialog
          book={{
            ...selectedBook,
            coverImage: `https://picsum.photos/seed/${selectedBook.id}/400/600`,
            toc: `제1장 도입부\n제2장 본론\n  제2.1절 첫 번째 주제\n  제2.2절 두 번째 주제\n제3장 결론`,
            authorInfo: `${selectedBook.author}는 해당 분야에서 20년 이상의 경력을 가진 저명한 작가입니다. 여러 저서를 통해 독자들에게 새로운 시각과 통찰을 제공해왔습니다.`,
            tags: [
              '베스트셀러',
              selectedBook.category,
              selectedBook.subcategory,
            ],
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
            similarBooks: allBooks.slice(0, 3).map(book => ({
              ...book,
              coverImage: `https://picsum.photos/seed/${book.id}/240/360`,
            })),
          }}
          open={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
        />
      )}
    </div>
  );
}
