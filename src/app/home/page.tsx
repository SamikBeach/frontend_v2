'use client';

import { HomeBookPreview } from '@/apis/book/types';
import { selectedBookAtom } from '@/atoms/book';
import { BookDialog } from '@/components/BookDialog/BookDialog';
import { useAtom } from 'jotai';
import { Suspense, useEffect, useState } from 'react';
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

  // 선택된 책 및 다이얼로그 상태 관리
  const [selectedBookState, setSelectedBookState] =
    useState<HomeBookPreview | null>(null);
  const [, setSelectedBookId] = useAtom(selectedBookAtom);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 책 선택 핸들러
  const handleBookSelect = (book: HomeBookPreview) => {
    setSelectedBookState(book);
    setSelectedBookId(book.id.toString());
    setIsDialogOpen(true);
  };

  // 다이얼로그 상태 변경 핸들러
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedBookState(null);
      setSelectedBookId('');
    }
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

      {/* Book detail Dialog */}
      {selectedBookState && (
        <BookDialog
          book={selectedBookState as any}
          open={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
        />
      )}
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
