import {
  getLibraryById,
  getLibraryUpdates,
  Library,
  subscribeToLibrary,
  unsubscribeFromLibrary,
  UpdateHistoryItem,
} from '@/apis/library';
import {
  notificationsEnabledAtom,
  subscriptionStatusAtom,
} from '@/atoms/library';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

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

  // 최근 업데이트 가져오기 (useSuspenseQuery 대신 useQuery 사용)
  const { data: recentUpdates } = useQuery<UpdateHistoryItem[]>({
    queryKey: ['library-updates', libraryId],
    queryFn: () => getLibraryUpdates(libraryId, 5), // 최신 5개 항목만 가져오기
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!library, // useQuery에서는 enabled 옵션 사용 가능
  });

  // 구독 상태 업데이트 - useEffect 대신 직접 업데이트
  if (library && library.isSubscribed !== isSubscribed) {
    setIsSubscribed(!!library.isSubscribed);
  }

  // 최근 업데이트 정보를 library 객체에 추가
  useEffect(() => {
    if (library && recentUpdates && Array.isArray(recentUpdates)) {
      // 명시적으로 타입 확인 후 할당
      (library as any).recentUpdates = recentUpdates;
    }
  }, [library, recentUpdates]);

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
