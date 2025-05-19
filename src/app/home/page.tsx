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
              <div className="mb-2 flex items-center gap-1.5 sm:gap-2">
                <svg
                  className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2h5m6 0v-2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2m6 0h-6"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                  커뮤니티 인기글
                </h2>
              </div>
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
