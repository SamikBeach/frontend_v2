'use client';

import { useQueryParams } from '@/hooks';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import {
  Community,
  CommunitySkeleton,
  ErrorBoundary,
  ErrorView,
  HeaderSkeleton,
  Libraries,
  LibrariesSkeleton,
  PageSkeleton,
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
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // 선택한 메뉴 아이템에 기반한 섹션 상태
  const [selectedSection, setSelectedSection] = useState(activeSection);

  // 간단한 로딩 처리 (비로그인 사용자도 프로필 페이지 접근 가능)
  useEffect(() => {
    // 로딩 지연 시간을 짧게 추가하여 상태 전환 안정화
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // 섹션 변경 핸들러
  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    updateQueryParams({ section: sectionId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 다시 시도 핸들러
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    // 약간의 지연 후 다시 로드
    setTimeout(() => {
      setIsLoading(false);
      router.refresh();
    }, 500);
  };

  // 로딩 중이면 스켈레톤 UI 표시
  if (isLoading) {
    return <PageSkeleton />;
  }

  // 오류 상태면 오류 컴포넌트 표시
  if (hasError) {
    return <ErrorView onRetry={handleRetry} />;
  }

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
