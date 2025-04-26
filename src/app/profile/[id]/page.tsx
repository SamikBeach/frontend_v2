'use client';

import { useQueryParams } from '@/hooks';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { authUtils } from '@/apis/axios';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import {
  ErrorBoundary,
  ErrorView,
  HeaderSkeleton,
  Libraries,
  LibrariesSkeleton,
  PageSkeleton,
  ProfileHeader,
  ProfileSummary,
  ReadBooks,
  Reviews,
  SectionSkeleton,
  Stats,
  SubscribedLibraries,
  SummarySkeleton,
} from '../components';

// 커뮤니티 활동 컴포넌트
// 임시로 추가한 컴포넌트, 실제로는 해당 컴포넌트 구현 필요
function Community() {
  return (
    <div className="mb-10">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        커뮤니티 활동
      </h2>
      <div className="rounded-lg bg-gray-50 p-10 text-center">
        <p className="text-gray-500">아직 커뮤니티 활동 기록이 없습니다.</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const userId = Number(params.id as string);
  const { getQueryParam, updateQueryParams } = useQueryParams();
  const activeSection = getQueryParam('section') || 'read';
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // 선택한 메뉴 아이템에 기반한 섹션 상태
  const [selectedSection, setSelectedSection] = useState(activeSection);

  // 클라이언트 사이드에서만 인증 상태 확인
  useEffect(() => {
    setIsClient(true);
    const checkAuth = () => {
      try {
        const isAuth = authUtils.isAuthenticated();
        setIsAuthenticated(isAuth);
        if (!isAuth) {
          setShowAuthDialog(true);
        }
      } catch (error) {
        console.error('인증 상태 확인 중 오류 발생:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
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
          <Suspense fallback={<SectionSkeleton />}>
            <ReadBooks />
          </Suspense>
        );
      case 'reviews':
        return (
          <Suspense fallback={<SectionSkeleton />}>
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
          <Suspense fallback={<SectionSkeleton />}>
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
          <Suspense fallback={<SectionSkeleton />}>
            <Stats />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<SectionSkeleton />}>
            <ReadBooks />
          </Suspense>
        );
    }
  };

  return (
    <ErrorBoundary>
      {/* 로그인 다이얼로그 */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={open => {
          setShowAuthDialog(open);
          if (!open) {
            router.push('/');
          }
        }}
      />

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
        <div className="mx-auto w-full px-4">
          {/* 현재 선택된 섹션 컨텐츠 렌더링 */}
          {renderSectionContent()}
        </div>
      </div>
    </ErrorBoundary>
  );
}
