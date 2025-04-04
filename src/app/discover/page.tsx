'use client';

import { useState } from 'react';

import { CategoryFilter } from '@/app/popular/components/CategoryFilter';
import { Book } from '@/components/BookCard';
import { BookDialog } from '@/components/BookDialog';
import { SortDropdown } from '@/components/SortDropdown';
import { useUrlParams } from '@/hooks';

import { BookCarousel, BookGrid, DiscoverBreadcrumb } from './components';
import { allBooks, allCollections, curationCategories } from './data';

export default function DiscoverPage() {
  // URL 파라미터 관리
  const { params, setParam, clearParams } = useUrlParams({
    defaultValues: {
      category: 'all',
      subcategory: '',
      sort: 'reviews-desc',
    },
  });

  const selectedCategory = params.category;
  const selectedSubcategory = params.subcategory;
  const selectedSort = params.sort || 'reviews-desc';

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (categoryId: string) => {
    setParam('category', categoryId);
    setParam('subcategory', '');
  };

  // 서브카테고리 클릭 핸들러
  const handleSubcategoryClick = (subcategoryId: string) => {
    setParam('subcategory', subcategoryId);
  };

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (sortId: string) => {
    setParam('sort', sortId);
  };

  // URL params 초기화
  const handleClearFilters = () => {
    clearParams();
  };

  // 필터링 로직
  let visibleCollections = Object.values(allCollections);

  if (selectedCategory !== 'all') {
    visibleCollections = visibleCollections.filter(
      collection => collection.category === selectedCategory
    );

    if (selectedSubcategory) {
      visibleCollections = visibleCollections.filter(
        collection => collection.id === selectedSubcategory
      );
    }
  }

  return (
    <div className="bg-white">
      {/* 브레드크럼 */}
      <div className="mx-auto w-full px-6 py-2">
        <DiscoverBreadcrumb
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
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
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onCategoryClick={handleCategoryClick}
            onSubcategoryClick={handleSubcategoryClick}
          />

          {selectedSubcategory && (
            <SortDropdown
              selectedSort={selectedSort}
              onSortChange={handleSortChange}
              className="ml-auto"
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
                  {selectedSubcategory ? (
                    // 세부 카테고리가 선택된 경우 그리드 형태로 표시
                    <BookGrid
                      books={collection.books}
                      onSelectBook={setSelectedBook}
                    />
                  ) : (
                    // 세부 카테고리가 선택되지 않은 경우 캐러셀 형태로 표시
                    <BookCarousel
                      books={collection.books}
                      onSelectBook={setSelectedBook}
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
          open={!!selectedBook}
          onOpenChange={open => !open && setSelectedBook(null)}
        />
      )}
    </div>
  );
}
