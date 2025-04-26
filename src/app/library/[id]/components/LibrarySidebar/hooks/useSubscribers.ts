import { Library } from '@/apis/library/types';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export function useSubscribers(library: Library) {
  const currentUser = useCurrentUser();

  // 현재 사용자가 구독자인지 확인하는 함수
  const isCurrentUserSubscriber = (subscriberId: number) => {
    return currentUser?.id === subscriberId;
  };

  // 구독자 미리보기 (최대 3명)
  const previewSubscribers = library.subscribers?.slice(0, 3) || [];

  return {
    previewSubscribers,
    isCurrentUserSubscriber,
  };
}
