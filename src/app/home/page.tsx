'use client';

import { HomeBookPreview } from '@/apis/book/types';
import { selectedBookIdAtom } from '@/atoms/book';
import { useDialogQuery } from '@/hooks';
import { useAtom } from 'jotai';
import { Suspense, useEffect } from 'react';
import {
  DiscoverBooksSection,
  PopularBooksSection,
  PopularLibrariesSection,
  PopularPostsSection,
} from './components';
import { useHomeData } from './hooks';

function HomePageContent() {
  const {
    popularBooks,
    discoverBooks,
    popularLibraries,
    popularPosts,
    isLoading,
  } = useHomeData();
  const { open: openBookDialog } = useDialogQuery({ type: 'book' });
  const [, setSelectedBookId] = useAtom(selectedBookIdAtom);

  // 데이터 디버깅을 위한 콘솔 로그
  useEffect(() => {
    console.log('Home page data:', {
      popularBooks,
      discoverBooks,
      popularLibraries,
      popularPosts,
      isLoading,
    });
  }, [popularBooks, discoverBooks, popularLibraries, popularPosts, isLoading]);

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
          isLoading={isLoading}
          onSelectBook={handleBookSelect}
        />

        {/* 오늘의 발견 섹션 */}
        <DiscoverBooksSection
          discoverData={discoverBooks}
          isLoading={isLoading}
          onSelectBook={handleBookSelect}
        />

        {/* 인기 서재 */}
        <PopularLibrariesSection
          libraries={popularLibraries}
          isLoading={isLoading}
        />

        {/* 커뮤니티 */}
        <PopularPostsSection posts={popularPosts} isLoading={isLoading} />
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
