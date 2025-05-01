import { createLibrary } from '@/apis/library/library';
import { CreateLibraryDto } from '@/apis/library/types';
import { invalidateUserProfileQueries } from '@/utils/query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

interface UseCreateLibraryResult {
  createLibraryMutation: (data: CreateLibraryDto) => Promise<void>;
  isCreating: boolean;
}

/**
 * 서재 생성 기능을 제공하는 커스텀 훅
 * @param userId 사용자 ID
 * @param onSuccess 생성 성공 시 실행할 콜백
 * @returns 서재 생성 관련 메서드와 상태
 */
export function useCreateLibrary(
  userId: number,
  onSuccess?: () => void
): UseCreateLibraryResult {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: CreateLibraryDto) => createLibrary(data),
    onSuccess: () => {
      // 서재 목록 쿼리 invalidate
      queryClient.invalidateQueries({
        queryKey: ['user-libraries-infinite', userId],
      });

      // 프로필 정보 invalidate
      invalidateUserProfileQueries(queryClient, pathname, userId);

      toast.success('새 서재가 생성되었습니다.');

      // 성공 콜백 실행
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: error => {
      console.error('서재 생성 오류:', error);
      toast.error('서재 생성에 실패했습니다.');
    },
  });

  // 서재 생성 함수
  const createLibraryMutation = async (data: CreateLibraryDto) => {
    try {
      await mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  return {
    createLibraryMutation,
    isCreating: isPending,
  };
}
