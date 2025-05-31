'use client';

import { useQueryParams } from '@/hooks';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import {
  Community,
  CommunitySkeleton,
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

// 에러 폴백 컴포넌트
function ErrorFallback({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 p-8">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          정보를 불러올 수 없습니다
        </h2>
        <p className="mb-4 text-gray-600">
          프로필 정보를 불러오는 중 문제가 발생했습니다.
        </p>
        <button
          onClick={resetErrorBoundary}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}

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
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // 페이지 새로고침으로 상태 초기화
        window.location.reload();
      }}
    >
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
