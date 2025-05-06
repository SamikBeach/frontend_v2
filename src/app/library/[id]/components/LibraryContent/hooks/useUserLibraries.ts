import { getLibrariesByUser } from '@/apis/library';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useQuery } from '@tanstack/react-query';

export function useUserLibraries(currentLibraryId?: number, ownerId?: number) {
  const currentUser = useCurrentUser();

  // 현재 사용자가 서재 소유자인지 확인
  const isOwner = currentUser?.id === ownerId;

  // 사용자의 서재 목록 불러오기 - 소유자인 경우에만 API 호출
  const { data: userLibraries = [], isLoading } = useQuery({
    queryKey: ['user-libraries', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      return await getLibrariesByUser(currentUser.id);
    },
    enabled: !!currentUser && isOwner, // 사용자가 존재하고 서재 소유자인 경우에만 활성화
  });

  // 현재 서재를 제외한 서재 목록 반환
  const otherLibraries = currentLibraryId
    ? userLibraries.filter(lib => lib.id !== currentLibraryId)
    : userLibraries;

  return {
    userLibraries,
    otherLibraries,
    isLoading,
    isOwner,
  };
}
