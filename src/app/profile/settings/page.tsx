'use client';

import { logout as logoutApi } from '@/apis/auth';
import { authUtils } from '@/apis/axios';
import { useCurrentUser } from '@/hooks';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Import components
import AccountSettings from './components/AccountSettings';
import LanguageSettings from './components/LanguageSettings';
import PrivacySettings from './components/PrivacySettings';
import ProfileSettings from './components/ProfileSettings';
import SecuritySettings from './components/SecuritySettings';
import SettingsSidebar, { settingTabs } from './components/SettingsSidebar';

export default function ProfileSettingsPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  // 로그아웃 mutation
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      return logoutApi();
    },
    onSuccess: () => {
      // 로그아웃 성공 시 사용자 정보 초기화 및 로컬 스토리지 토큰 제거
      authUtils.removeTokens();
      router.push('/');
    },
    onError: error => {
      console.error('로그아웃 실패:', error);
      // 에러가 발생해도 클라이언트에서는 로그아웃 처리
      authUtils.removeTokens();
      router.push('/');
    },
  });

  // 사용자가 로그인하지 않은 경우 홈으로 리다이렉트
  if (!user) {
    router.push('/');
    return null;
  }

  // 설정 저장 핸들러
  const handleSaveSettings = () => {
    // 실제 구현에서는 API 호출로 변경 사항을 저장
    alert('설정이 저장되었습니다.');
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    logout();
  };

  // 탭 변경 핸들러
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // 현재 활성화된 탭에 따라 내용 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings user={user} onSave={handleSaveSettings} />;
      case 'privacy':
        return <PrivacySettings onSave={handleSaveSettings} />;
      case 'security':
        return <SecuritySettings onSave={handleSaveSettings} />;
      case 'account':
        return <AccountSettings onLogout={handleLogout} />;
      case 'language':
        return <LanguageSettings onSave={handleSaveSettings} />;
      default:
        return (
          <div className="bg-white p-6">
            <h2 className="mb-6 text-lg font-semibold text-gray-900">
              {settingTabs.find(tab => tab.id === activeTab)?.label}
            </h2>
            <p className="text-gray-500">이 섹션은 아직 구현되지 않았습니다.</p>
          </div>
        );
    }
  };

  if (isLoggingOut) {
    return (
      <div className="flex h-[calc(100vh-56px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden bg-white">
      {/* 설정 사이드바 */}
      <SettingsSidebar
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        onLogout={handleLogout}
      />

      {/* 설정 콘텐츠 */}
      <div className="flex-1 overflow-auto">{renderTabContent()}</div>
    </div>
  );
}
