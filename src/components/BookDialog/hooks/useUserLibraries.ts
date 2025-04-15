import { createLibrary, getLibrariesByUser } from '@/apis/library/library';
import {
  CreateLibraryDto,
  Library,
  LibrarySummary,
} from '@/apis/library/types';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
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
      } catch {
        return [];
      }
    },
  });

  // 새 서재 생성 뮤테이션
  const { mutateAsync: createLibraryMutation } = useMutation({
    mutationFn: async (
      libraryData: CreateLibraryDto
    ): Promise<LibrarySummary | null> => {
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      // API는 Library 타입을 반환하므로 LibrarySummary로 변환
      const newLibrary = await createLibrary(libraryData);
      return convertToLibrarySummary(newLibrary);
    },
    onSuccess: () => {
      // 서재 목록 리프레시
      refetch();
    },
    onError: error => {
      console.error('서재 생성 오류:', error);
    },
  });

  // 새 서재 생성 함수 (외부에서 사용하기 위한 래퍼)
  const handleCreateLibrary = useCallback(
    async (libraryData: CreateLibraryDto): Promise<LibrarySummary | null> => {
      if (!currentUser) {
        toast.error('로그인이 필요합니다.');
        return null;
      }

      try {
        const newLibrarySummary = await createLibraryMutation(libraryData);
        toast.success('새 서재가 생성되었습니다.');
        return newLibrarySummary;
      } catch (error) {
        toast.error('서재 생성에 실패했습니다.');
        return null;
      }
    },
    [currentUser, createLibraryMutation]
  );

  return {
    libraries,
    isLoggedIn: !!currentUser,
    createLibrary: handleCreateLibrary,
    refetch,
  };
}
