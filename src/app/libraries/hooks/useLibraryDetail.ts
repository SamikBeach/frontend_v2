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
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface UseLibraryDetailResult {
  library: Library;
  isSubscribed: boolean;
  notificationsEnabled: boolean;
  handleSubscriptionToggle: () => Promise<void>;
  handleNotificationToggle: () => void;
  isSubscribing: boolean;
  isUnsubscribing: boolean;
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

  // 구독하기 mutation
  const { mutateAsync: subscribeMutation, isPending: isSubscribing } =
    useMutation({
      mutationFn: (id: number) => subscribeToLibrary(id),
      onSuccess: () => {
        toast.success(`${library?.name} 서재를 구독했습니다.`);
      },
      onError: (error: any) => {
        let errorMessage = '서재 구독 중 오류가 발생했습니다';

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
      },
    });

  // 구독취소 mutation
  const { mutateAsync: unsubscribeMutation, isPending: isUnsubscribing } =
    useMutation({
      mutationFn: (id: number) => unsubscribeFromLibrary(id),
      onSuccess: () => {
        toast.success(`${library?.name} 서재 구독을 취소했습니다.`);
      },
      onError: (error: any) => {
        let errorMessage = '서재 구독 취소 중 오류가 발생했습니다';

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
      },
    });

  // 구독 토글 핸들러
  const handleSubscriptionToggle = useCallback(async () => {
    if (!library) return;

    try {
      if (isSubscribed) {
        await unsubscribeMutation(library.id);
        setIsSubscribed(false);
        setNotificationsEnabled(false);
      } else {
        await subscribeMutation(library.id);
        setIsSubscribed(true);
      }

      // 구독 상태 변경 후 서재 정보 다시 가져오기
      await refetch();
    } catch (error) {
      console.error('구독 상태 변경 중 오류 발생:', error);
      // 에러 핸들링은 mutation 내부에서 처리
    }
  }, [
    library,
    isSubscribed,
    refetch,
    setIsSubscribed,
    setNotificationsEnabled,
    subscribeMutation,
    unsubscribeMutation,
  ]);

  // 알림 설정 토글 핸들러
  const handleNotificationToggle = useCallback(() => {
    setNotificationsEnabled(prev => !prev);
    if (notificationsEnabled) {
      toast.info(`${library?.name} 서재의 알림을 끕니다.`);
    } else {
      toast.success(`${library?.name} 서재의 알림을 받습니다.`);
    }
  }, [notificationsEnabled, setNotificationsEnabled, library?.name]);

  return {
    library,
    isSubscribed,
    notificationsEnabled,
    handleSubscriptionToggle,
    handleNotificationToggle,
    isSubscribing,
    isUnsubscribing,
  };
}
