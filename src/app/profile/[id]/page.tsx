'use client';

import { getUserProfile } from '@/apis/user';
import { UserDetailResponseDto } from '@/apis/user/types';
import { useQueryParams } from '@/hooks';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import {
  ProfileBooks,
  ProfileHeader,
  ProfileRecentBooks,
  ProfileReviews,
  ProfileStats,
  ProfileSummary,
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

function ProfileContent() {
  const params = useParams();
  const userId = Number(params.id as string);
  const { getQueryParam, updateQueryParams } = useQueryParams();
  const activeSection = getQueryParam('section') || 'books';

  // 선택한 메뉴 아이템에 기반한 섹션 상태
  const [selectedSection, setSelectedSection] = useState(activeSection);

  // API 호출로 프로필 데이터 가져오기
  const { data: profileData } = useSuspenseQuery<UserDetailResponseDto>({
    queryKey: ['profile', userId],
    queryFn: () => getUserProfile(userId),
  });

  // 섹션 변경 핸들러
  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    updateQueryParams({ section: sectionId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 선택된 섹션에 따라 컨텐츠 렌더링
  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'books':
        return <ProfileBooks />;
      case 'subscriptions':
        return <SubscribedLibraries />;
      case 'read':
        return <ProfileRecentBooks />;
      case 'reviews':
        return <ProfileReviews />;
      case 'groups':
        return <ProfileBooks />;
      case 'stats':
        return <ProfileStats />;
      default:
        return <ProfileBooks />;
    }
  };

  return (
    <div className="bg-white">
      {/* 프로필 헤더 */}
      <ProfileHeader profileData={profileData} />

      {/* 독서 정보 개요 */}
      <ProfileSummary
        selectedSection={selectedSection}
        onSectionChange={handleSectionChange}
        profileData={profileData}
      />

      {/* 섹션 컨텐츠 */}
      <div className="mx-auto w-full px-4 pt-6">
        {/* 현재 선택된 섹션 컨텐츠 렌더링 */}
        {renderSectionContent()}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
