import { createLibrary, getLibrariesByUser } from '@/apis/library/library';
import {
  CreateLibraryDto,
  Library,
  LibrarySummary,
} from '@/apis/library/types';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

// Library 타입을 LibrarySummary 타입으로 변환하는 함수
const convertToLibrarySummary = (library: Library): LibrarySummary => {
  return {
    id: library.id,
    name: library.name,
    description: library.description,
    isPublic: library.isPublic,
    subscriberCount: library.subscriberCount,
    bookCount: library.books?.length || 0,
    owner: library.owner,
    tags: library.tags,
    isSubscribed: library.isSubscribed,
    createdAt: library.createdAt,
  };
};

export function useUserLibraries() {
  const currentUser = useCurrentUser();

  // 사용자의 서재 목록 조회
  const { data: libraries = [], refetch } = useSuspenseQuery({
    queryKey: ['user-libraries', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) {
        return [];
      }
      try {
        const librariesData = await getLibrariesByUser(currentUser.id);
        return librariesData;
      } catch (error) {
        console.error('Failed to fetch user libraries:', error);
        return [];
      }
    },
    enabled: !!currentUser?.id,
  });

  // 새 서재 생성 함수
  const handleCreateLibrary = useCallback(
    async (libraryData: CreateLibraryDto): Promise<LibrarySummary | null> => {
      if (!currentUser) {
        toast.error('로그인이 필요합니다.');
        return null;
      }

      try {
        // API는 Library 타입을 반환하므로 LibrarySummary로 변환
        const newLibrary = await createLibrary(libraryData);
        const newLibrarySummary = convertToLibrarySummary(newLibrary);

        toast.success('새 서재가 생성되었습니다.');
        // 서재 목록 리프레시
        await refetch();
        return newLibrarySummary;
      } catch (error) {
        console.error('서재 생성 실패:', error);
        toast.error('서재 생성에 실패했습니다.');
        return null;
      }
    },
    [currentUser, refetch]
  );

  return {
    libraries,
    isLoggedIn: !!currentUser,
    createLibrary: handleCreateLibrary,
    refetch,
  };
}
