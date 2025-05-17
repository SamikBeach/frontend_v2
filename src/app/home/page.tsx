'use client';

import { Suspense } from 'react';
import {
  DiscoverBooksSection,
  DiscoverBooksSkeleton,
  PopularBooksSection,
  PopularBooksSkeleton,
  PopularLibrariesSection,
  PopularLibrariesSkeleton,
  PopularReviewsSection,
  PopularReviewsSkeleton,
} from './components';

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Main content - 2x2 grid structure*/}
      <div className="grid auto-rows-auto grid-cols-1 gap-1 sm:gap-2 lg:grid-cols-2 lg:gap-3">
        {/* 인기 있는 책 섹션 */}
        <Suspense
          fallback={
            <section className="h-auto p-2 sm:p-4">
              <h2 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">
                지금 인기 있는 책
              </h2>
              <PopularBooksSkeleton />
            </section>
          }
        >
          <PopularBooksSection />
        </Suspense>

        {/* 오늘의 발견 섹션 */}
        <Suspense
          fallback={
            <section className="h-auto p-2 sm:p-4">
              <h2 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">
                오늘의 발견
              </h2>
              <DiscoverBooksSkeleton />
            </section>
          }
        >
          <DiscoverBooksSection />
        </Suspense>

        {/* 커뮤니티 인기글 */}
        <Suspense
          fallback={
            <section className="h-auto p-2 sm:p-4">
              <h2 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">
                인기 리뷰
              </h2>
              <PopularReviewsSkeleton />
            </section>
          }
        >
          <PopularReviewsSection />
        </Suspense>

        {/* 인기 서재 */}
        <Suspense
          fallback={
            <section className="h-auto p-2 sm:p-4">
              <h2 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">
                인기 서재
              </h2>
              <PopularLibrariesSkeleton />
            </section>
          }
        >
          <PopularLibrariesSection />
        </Suspense>
      </div>
    </div>
  );
}
