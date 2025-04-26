import { getLibrariesByUser } from '@/apis/library';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useQuery } from '@tanstack/react-query';

export function useUserLibraries(currentLibraryId?: number) {
  const currentUser = useCurrentUser();

  // 사용자의 서재 목록 불러오기
  const { data: userLibraries = [], isLoading } = useQuery({
    queryKey: ['user-libraries', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      return await getLibrariesByUser(currentUser.id);
    },
    enabled: !!currentUser,
  });

  // 현재 서재를 제외한 서재 목록 반환
  const otherLibraries = currentLibraryId
    ? userLibraries.filter(lib => lib.id !== currentLibraryId)
    : userLibraries;

  return {
    userLibraries,
    otherLibraries,
    isLoading,
  };
}
