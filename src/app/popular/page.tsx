'use client';

import { useState } from 'react';

import { Book, BookCard } from '@/components/BookCard';
import { BookDialog } from '@/components/BookDialog';
import { useUrlParams } from '@/hooks';

import { CategoryFilter, PopularBreadcrumb } from './components';
import { books, categories } from './data';

export default function PopularPage() {
  // Use our custom URL params hook
  const { params, setParam, clearParams } = useUrlParams({
    defaultValues: {
      category: 'all',
      subcategory: '',
    },
  });

  const selectedCategory = params.category;
  const selectedSubcategory = params.subcategory;

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

  // URL params 초기화
  const handleClearFilters = () => {
    clearParams();
  };

  // 필터링 로직
  let filteredBooks = books;

  if (selectedCategory !== 'all') {
    filteredBooks = books.filter(book => book.category === selectedCategory);

    if (selectedSubcategory) {
      filteredBooks = filteredBooks.filter(
        book => book.subcategory === selectedSubcategory
      );
    }
  }

  // 정렬 로직
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    // 기본적으로 평점 높은 순
    return b.rating - a.rating;
  });

  return (
    <div className="bg-white">
      {/* 브레드크럼 */}
      <div className="mx-auto w-full px-6 py-2">
        <PopularBreadcrumb
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          categories={categories}
          onCategoryClick={handleCategoryClick}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* 카테고리 필터 */}
      <div className="mx-auto w-full px-6 pt-3 pb-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onCategoryClick={handleCategoryClick}
          onSubcategoryClick={handleSubcategoryClick}
        />

        {/* 도서 그리드 */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {sortedBooks.map(book => (
            <BookCard key={book.id} book={book} onClick={setSelectedBook} />
          ))}
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
