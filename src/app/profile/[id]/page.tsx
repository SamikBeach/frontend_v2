'use client';

import { useQueryParams } from '@/hooks';
import { useParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { LibraryCardSkeleton } from '@/components/LibraryCard';
import {
  Libraries,
  ProfileHeader,
  ProfileSummary,
  ReadBooks,
  Reviews,
  Stats,
  SubscribedLibraries,
} from '../components';

// 로딩 컴포넌트
function SectionLoading() {
  return (
    <div className="flex h-[300px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

// 헤더 로딩 스켈레톤
function HeaderSkeleton() {
  return (
    <div className="bg-white">
      <div className="mx-auto w-full px-4 pt-8 pb-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200"></div>
            <div>
              <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200"></div>
              <div className="mt-2 h-4 w-64 animate-pulse rounded-md bg-gray-200"></div>
              <div className="mt-2 flex gap-3">
                <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200"></div>
                <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200"></div>
              </div>
            </div>
          </div>
          <div className="mt-4 h-10 w-32 animate-pulse rounded-full bg-gray-200 sm:mt-0"></div>
        </div>
      </div>
    </div>
  );
}

// 북스 섹션 스켈레톤
function BooksSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <LibraryCardSkeleton key={index} />
      ))}
    </div>
  );
}

// 서머리 스켈레톤
function SummarySkeleton() {
  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="mx-auto w-full px-4 py-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-lg bg-gray-100"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const userId = Number(params.id as string);
  const { getQueryParam, updateQueryParams } = useQueryParams();
  const activeSection = getQueryParam('section') || 'libraries';

  // 선택한 메뉴 아이템에 기반한 섹션 상태
  const [selectedSection, setSelectedSection] = useState(activeSection);

  // 섹션 변경 핸들러
  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    updateQueryParams({ section: sectionId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 선택된 섹션에 따라 컨텐츠 렌더링
  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'libraries':
        return (
          <Suspense fallback={<BooksSkeleton />}>
            <Libraries />
          </Suspense>
        );
      case 'subscriptions':
        return (
          <Suspense fallback={<BooksSkeleton />}>
            <SubscribedLibraries />
          </Suspense>
        );
      case 'read':
        return (
          <Suspense fallback={<SectionLoading />}>
            <ReadBooks />
          </Suspense>
        );
      case 'reviews':
        return (
          <Suspense fallback={<SectionLoading />}>
            <Reviews />
          </Suspense>
        );
      case 'groups':
        return (
          <Suspense fallback={<BooksSkeleton />}>
            <Libraries />
          </Suspense>
        );
      case 'stats':
        return (
          <Suspense fallback={<SectionLoading />}>
            <Stats />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<BooksSkeleton />}>
            <Libraries />
          </Suspense>
        );
    }
  };

  return (
    <div className="bg-white">
      {/* 프로필 헤더 */}
      <Suspense fallback={<HeaderSkeleton />}>
        <ProfileHeader />
      </Suspense>

      {/* 독서 정보 개요 */}
      <Suspense fallback={<SummarySkeleton />}>
        <ProfileSummary
          selectedSection={selectedSection}
          onSectionChange={handleSectionChange}
        />
      </Suspense>

      {/* 섹션 컨텐츠 */}
      <div className="mx-auto w-full px-4 pt-6">
        {/* 현재 선택된 섹션 컨텐츠 렌더링 */}
        {renderSectionContent()}
      </div>
    </div>
  );
}
