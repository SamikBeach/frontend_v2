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
import { useCallback, useEffect } from 'react';

interface UseLibraryDetailResult {
  library: Library;
  isLoading: boolean;
  isSubscribed: boolean;
  notificationsEnabled: boolean;
  handleSubscriptionToggle: () => Promise<void>;
  handleNotificationToggle: () => void;
}

export function useLibraryDetail(
  libraryId: number,
  userId?: number
): UseLibraryDetailResult {
  const user = useCurrentUser();
  const [isSubscribed, setIsSubscribed] = useAtom(subscriptionStatusAtom);
  const [notificationsEnabled, setNotificationsEnabled] = useAtom(
    notificationsEnabledAtom
  );

  // 서재 데이터 가져오기 - userId 전달하여 서버 컨트롤러에 일치시킴
  const {
    data: library,
    refetch,
    isLoading,
  } = useSuspenseQuery({
    queryKey: ['library', libraryId, userId],
    queryFn: () => getLibraryById(libraryId, userId || user?.id),
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 유지
    retry: 1, // 실패 시 1번 재시도
  });

  // 데이터가 로드되면 구독 상태 업데이트
  useEffect(() => {
    if (library) {
      setIsSubscribed(!!library.isSubscribed);
    }
  }, [library, setIsSubscribed]);

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
    isLoading,
    isSubscribed,
    notificationsEnabled,
    handleSubscriptionToggle,
    handleNotificationToggle,
  };
}
