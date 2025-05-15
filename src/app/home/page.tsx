'use client';

import {
  DiscoverBooksSection,
  PopularBooksSection,
  PopularLibrariesSection,
  PopularReviewsSection,
} from './components';

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Main content - 2x2 grid structure*/}
      <div className="grid auto-rows-auto grid-cols-1 gap-1 sm:gap-2 lg:grid-cols-2 lg:gap-3">
        {/* 인기 있는 책 섹션 */}
        <PopularBooksSection />

        {/* 오늘의 발견 섹션 */}
        <DiscoverBooksSection />

        {/* 커뮤니티 인기글 */}
        <PopularReviewsSection />

        {/* 인기 서재 */}
        <PopularLibrariesSection />
      </div>
    </div>
  );
}
