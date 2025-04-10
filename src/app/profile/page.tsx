'use client';

import { useCurrentUser, useQueryParams } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  ProfileBooks,
  ProfileHeader,
  ProfileRecentBooks,
  ProfileReviews,
  ProfileStats,
  ProfileSummary,
} from './components';

export default function ProfilePage() {
  const user = useCurrentUser();
  const router = useRouter();
  const { getQueryParam, updateQueryParams } = useQueryParams();
  const activeSection = getQueryParam('section') || 'books';

  // 선택한 메뉴 아이템에 기반한 섹션 상태
  const [selectedSection, setSelectedSection] = useState(activeSection);

  // 사용자가 로그인하지 않았으면 홈으로 리다이렉트
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // 섹션 변경 핸들러
  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    updateQueryParams({ section: sectionId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 사용자가 없으면 로딩 상태 또는 빈 화면 표시
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        로그인이 필요합니다...
      </div>
    );
  }

  // 선택된 섹션에 따라 컨텐츠 렌더링
  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'books':
        return <ProfileBooks />;
      case 'subscriptions':
        return <ProfileBooks />;
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
      <ProfileHeader />

      {/* 독서 정보 개요 */}
      <ProfileSummary
        selectedSection={selectedSection}
        onSectionChange={handleSectionChange}
      />

      {/* 섹션 컨텐츠 */}
      <div className="mx-auto w-full px-4 pt-6">
        {/* 현재 선택된 섹션 컨텐츠 렌더링 */}
        {renderSectionContent()}
      </div>
    </div>
  );
}
