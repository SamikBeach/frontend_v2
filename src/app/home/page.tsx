'use client';

import { HomeBookPreview } from '@/apis/book/types';
import { selectedBookIdAtom } from '@/atoms/book';
import { useDialogQuery } from '@/hooks';
import { useAtom } from 'jotai';
import { Suspense } from 'react';
import {
  DiscoverBooksSection,
  PopularBooksSection,
  PopularLibrariesSection,
  PopularReviewsSection,
} from './components';
import {
  useHomeDiscoverBooksQuery,
  useHomePopularBooksQuery,
  useHomePopularLibrariesQuery,
  useHomePopularReviewsQuery,
} from './hooks';

function HomePageContent() {
  const { books: popularBooks, isLoading: isPopularBooksLoading } =
    useHomePopularBooksQuery();
  const { discoverBooks, isLoading: isDiscoverBooksLoading } =
    useHomeDiscoverBooksQuery();
  const { libraries: popularLibraries, isLoading: isPopularLibrariesLoading } =
    useHomePopularLibrariesQuery();
  const { reviews: popularReviews, isLoading: isPopularReviewsLoading } =
    useHomePopularReviewsQuery();

  const { open: openBookDialog } = useDialogQuery({ type: 'book' });
  const [, setSelectedBookId] = useAtom(selectedBookIdAtom);

  // For debugging purposes
  console.log('Popular Libraries:', popularLibraries);

  // 책 선택 핸들러
  const handleBookSelect = (book: HomeBookPreview) => {
    setSelectedBookId(book.id.toString());
    // isbn13이 있으면 우선 사용하고, 없으면 isbn 사용
    const bookIsbn = book.isbn13 || book.isbn;
    openBookDialog(bookIsbn);
  };

  return (
    <div className="bg-white">
      {/* Main content - 2x2 grid structure*/}
      <div className="grid auto-rows-auto grid-cols-1 gap-2 md:grid-cols-2">
        {/* 인기 있는 책 섹션 */}
        <PopularBooksSection
          books={popularBooks}
          isLoading={isPopularBooksLoading}
          onSelectBook={handleBookSelect}
        />

        {/* 오늘의 발견 섹션 */}
        <DiscoverBooksSection
          discoverData={discoverBooks}
          isLoading={isDiscoverBooksLoading}
          onSelectBook={handleBookSelect}
        />

        {/* 커뮤니티 인기글 */}
        <PopularReviewsSection
          reviews={popularReviews}
          isLoading={isPopularReviewsLoading}
        />

        {/* 인기 서재 */}
        <PopularLibrariesSection
          libraries={popularLibraries}
          isLoading={isPopularLibrariesLoading}
        />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageLoading />}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageLoading() {
  return (
    <div className="grid auto-rows-auto grid-cols-1 gap-2 p-4 md:grid-cols-2">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="h-[350px] animate-pulse rounded-xl bg-gray-100"
        ></div>
      ))}
    </div>
  );
}
