import {
  getLibraryById,
  Library,
  subscribeToLibrary,
  unsubscribeFromLibrary,
} from '@/apis/library';
import {
  notificationsEnabledAtom,
  subscriptionStatusAtom,
} from '@/atoms/library';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

interface UseLibraryDetailResult {
  library: Library;
  isSubscribed: boolean;
  notificationsEnabled: boolean;
  handleSubscriptionToggle: () => Promise<void>;
  handleNotificationToggle: () => void;
}

export function useLibraryDetail(libraryId: number): UseLibraryDetailResult {
  const [isSubscribed, setIsSubscribed] = useAtom(subscriptionStatusAtom);
  const [notificationsEnabled, setNotificationsEnabled] = useAtom(
    notificationsEnabledAtom
  );

  // 서재 데이터 가져오기
  const { data: library, refetch } = useSuspenseQuery({
    queryKey: ['library', libraryId],
    queryFn: () => getLibraryById(libraryId),
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 유지
    retry: 1, // 실패 시 1번 재시도
  });

  // 구독 상태 업데이트 - useEffect 대신 직접 업데이트
  if (library && library.isSubscribed !== isSubscribed) {
    setIsSubscribed(!!library.isSubscribed);
  }

  // 구독 토글 핸들러
  const handleSubscriptionToggle = useCallback(async () => {
    if (!library) return;

    try {
      if (isSubscribed) {
        await unsubscribeFromLibrary(library.id);
        setIsSubscribed(false);
        setNotificationsEnabled(false);
      } else {
        await subscribeToLibrary(library.id);
        setIsSubscribed(true);
      }

      // 구독 상태 변경 후 서재 정보 다시 가져오기
      refetch();
    } catch (error) {
      console.error('구독 상태 변경 중 오류 발생:', error);
    }
  }, [
    library,
    isSubscribed,
    refetch,
    setIsSubscribed,
    setNotificationsEnabled,
  ]);

  // 알림 설정 토글 핸들러
  const handleNotificationToggle = useCallback(() => {
    setNotificationsEnabled(prev => !prev);
  }, [setNotificationsEnabled]);

  return {
    library,
    isSubscribed,
    notificationsEnabled,
    handleSubscriptionToggle,
    handleNotificationToggle,
  };
}
