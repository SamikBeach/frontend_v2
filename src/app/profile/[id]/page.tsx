'use client';

import { useQueryParams } from '@/hooks';
import { Suspense, useState } from 'react';

import {
  Community,
  CommunitySkeleton,
  ErrorBoundary,
  HeaderSkeleton,
  Libraries,
  LibrariesSkeleton,
  ProfileHeader,
  ProfileSkeleton,
  ProfileStats,
  ProfileSummary,
  ReadBooks,
  ReadBooksSkeleton,
  Reviews,
  ReviewsSkeleton,
  SubscribedLibraries,
  SummarySkeleton,
} from '../components';

export default function ProfilePage() {
  const { getQueryParam, updateQueryParams } = useQueryParams();
  const activeSection = getQueryParam('section') || 'read';

  // 선택한 메뉴 아이템에 기반한 섹션 상태
  const [selectedSection, setSelectedSection] = useState(activeSection);

  // 섹션 변경 핸들러
  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    updateQueryParams({ section: sectionId });
  };

  // 선택된 섹션에 따라 컨텐츠 렌더링
  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'read':
        return (
          <Suspense fallback={<ReadBooksSkeleton />}>
            <ReadBooks />
          </Suspense>
        );
      case 'reviews':
        return (
          <Suspense fallback={<ReviewsSkeleton />}>
            <Reviews />
          </Suspense>
        );
      case 'libraries':
        return (
          <Suspense fallback={<LibrariesSkeleton />}>
            <Libraries />
          </Suspense>
        );
      case 'community':
        return (
          <Suspense fallback={<CommunitySkeleton />}>
            <Community />
          </Suspense>
        );
      case 'subscriptions':
        return (
          <Suspense fallback={<LibrariesSkeleton />}>
            <SubscribedLibraries />
          </Suspense>
        );
      case 'stats':
        return (
          <Suspense fallback={<ProfileSkeleton />}>
            <ProfileStats />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<ReadBooksSkeleton />}>
            <ReadBooks />
          </Suspense>
        );
    }
  };

  return (
    <ErrorBoundary>
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
        <div className="mx-auto w-full">
          {/* 현재 선택된 섹션 컨텐츠 렌더링 */}
          {renderSectionContent()}
        </div>
      </div>
    </ErrorBoundary>
  );
}
