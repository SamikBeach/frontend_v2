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
import { useCurrentUser } from '@/hooks/useCurrentUser';
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
  const user = useCurrentUser();
  const [isSubscribed, setIsSubscribed] = useAtom(subscriptionStatusAtom);
  const [notificationsEnabled, setNotificationsEnabled] = useAtom(
    notificationsEnabledAtom
  );

  // 서재 데이터 가져오기
  const { data: library, refetch } = useSuspenseQuery({
    queryKey: ['library', libraryId],
    queryFn: () => getLibraryById(libraryId),
    select: data => {
      // 데이터를 가져온 후 구독 상태 업데이트
      setIsSubscribed(!!data.isSubscribed);
      return data;
    },
  });

  // 구독 토글 핸들러
  const handleSubscriptionToggle = useCallback(async () => {
    if (!library || !user) return;

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
    user,
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
