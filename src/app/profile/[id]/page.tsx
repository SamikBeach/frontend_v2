'use client';

import { useQueryParams } from '@/hooks';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { authUtils } from '@/apis/axios';
import { LibraryCardSkeleton } from '@/components/LibraryCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Libraries,
  ProfileHeader,
  ProfileSummary,
  ReadBooks,
  Reviews,
  Stats,
  SubscribedLibraries,
} from '../components';
import { ReadBooksSkeleton } from '../components/Sections/ReadBooks';

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

// 섹션 스켈레톤 - 읽은 책 스켈레톤을 기본으로 사용
function SectionSkeleton() {
  return <ReadBooksSkeleton />;
}

// 헤더 스켈레톤
function HeaderSkeleton() {
  return (
    <div className="bg-white">
      <div className="mx-auto w-full px-4 pb-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="mt-2 flex gap-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
          <Skeleton className="mt-4 h-10 w-32 rounded-full sm:mt-0" />
        </div>
      </div>
    </div>
  );
}

// 서재 스켈레톤
function LibrariesSkeleton() {
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
      <div className="mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="flex h-[133px] w-full flex-col items-center rounded-lg p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full">
                <Skeleton className="h-5 w-5" />
              </div>
              <div className="mt-2 w-full">
                <Skeleton className="mx-auto mb-1 h-6 w-1/2" />
                <Skeleton className="mx-auto h-4 w-2/3" />
              </div>
            </Skeleton>
          ))}
        </div>
      </div>
    </div>
  );
}

// 페이지 로딩 스켈레톤
function PageSkeleton() {
  return (
    <div className="bg-white">
      <HeaderSkeleton />
      <SummarySkeleton />
      <div className="mx-auto w-full px-4">
        <SectionSkeleton />
      </div>
    </div>
  );
}

// 로그인 필요 상태 컴포넌트
function LoginRequired() {
  const router = useRouter();

  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center bg-gray-50 p-8 text-center">
      <h2 className="mb-3 text-2xl font-semibold text-gray-800">
        로그인이 필요합니다
      </h2>
      <p className="mb-6 max-w-md text-gray-600">
        프로필 정보를 보려면 로그인이 필요합니다. 계정이 없으시면 회원가입을
        해주세요.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => router.push('/auth/login')}>로그인</Button>
        <Button variant="outline" onClick={() => router.push('/auth/signup')}>
          회원가입
        </Button>
      </div>
    </div>
  );
}

// 오류 상태 컴포넌트
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center bg-gray-50 p-8 text-center">
      <h2 className="mb-3 text-2xl font-semibold text-gray-800">
        정보를 불러올 수 없습니다
      </h2>
      <p className="mb-6 max-w-md text-gray-600">
        프로필 정보를 불러오는 중 문제가 발생했습니다.
      </p>
      <Button onClick={onRetry}>다시 시도</Button>
    </div>
  );
}

// 에러 바운더리 역할을 하는 컴포넌트 (런타임에서만 사용됨)
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 전역 에러 핸들러 등록
    const handleError = () => {
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (hasError) {
    return (
      <ErrorState
        onRetry={() => {
          setHasError(false);
          router.refresh();
        }}
      />
    );
  }

  return <>{children}</>;
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

  // 선택한 메뉴 아이템에 기반한 섹션 상태
  const [selectedSection, setSelectedSection] = useState(activeSection);

  // 클라이언트 사이드에서만 인증 상태 확인
  useEffect(() => {
    setIsClient(true);
    const checkAuth = () => {
      try {
        const isAuth = authUtils.isAuthenticated();
        setIsAuthenticated(isAuth);
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

  // 클라이언트 사이드이고, 인증되지 않았으면 로그인 필요 상태 표시
  if (isClient && !isAuthenticated) {
    return <LoginRequired />;
  }

  // 오류 상태면 오류 컴포넌트 표시
  if (hasError) {
    return <ErrorState onRetry={handleRetry} />;
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
