import { createLibrary, getLibrariesByUser } from '@/apis/library/library';
import { CreateLibraryDto, Library } from '@/apis/library/types';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

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
    ): Promise<Library | null> => {
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      // Library 타입 반환
      return await createLibrary(libraryData);
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
    async (libraryData: CreateLibraryDto): Promise<Library | null> => {
      if (!currentUser) {
        toast.error('로그인이 필요합니다.');
        return null;
      }

      try {
        const newLibrary = await createLibraryMutation(libraryData);
        toast.success('새 서재가 생성되었습니다.');
        return newLibrary;
      } catch {
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
