import { useMemo, useState } from 'react';
import { libraries } from '../data';
import { Library } from '../types';

interface UseLibraryReturnType {
  library: Library | undefined;
  isSubscribed: boolean;
  notificationsEnabled: boolean;
  handleSubscriptionToggle: () => void;
  handleNotificationToggle: () => void;
  findLibraryCategory: (category: string) => { name: string; color: string };
}

export function useLibrary(libraryId: number): UseLibraryReturnType {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // 서재 데이터 찾기
  const library = useMemo(() => {
    return libraries.find(lib => lib.id === libraryId);
  }, [libraryId]);

  // 구독 상태 토글
  const handleSubscriptionToggle = () => {
    const newSubscriptionState = !isSubscribed;
    setIsSubscribed(newSubscriptionState);

    // 구독 취소 시 알림도 자동으로 비활성화
    if (!newSubscriptionState) {
      setNotificationsEnabled(false);
    }
  };

  // 알림 설정 토글
  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  // 서재 카테고리 찾기
  const findLibraryCategory = (category: string) => {
    switch (category) {
      case 'philosophy':
        return { name: '철학', color: '#FFF8E2' };
      case 'literature':
        return { name: '문학', color: '#F2E2FF' };
      case 'history':
        return { name: '역사', color: '#FFE2EC' };
      case 'science':
        return { name: '과학', color: '#E2FFFC' };
      default:
        return { name: '기타', color: '#E2E8F0' };
    }
  };

  return {
    library,
    isSubscribed,
    notificationsEnabled,
    handleSubscriptionToggle,
    handleNotificationToggle,
    findLibraryCategory,
  };
}
