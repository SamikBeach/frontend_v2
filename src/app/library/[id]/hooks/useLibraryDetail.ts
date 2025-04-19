import {
  getLibraryById,
  getLibraryUpdates,
  Library,
  subscribeToLibrary,
  unsubscribeFromLibrary,
  UpdateHistoryItem,
  updateLibrary,
} from '@/apis/library';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseLibraryDetailResult {
  library: Library | null;
  isLoading: boolean;
  isSubscribed: boolean;
  handleSubscriptionToggle: () => Promise<void>;
  updateLibraryVisibility: (id: number, isPublic: boolean) => Promise<void>;
}

export function useLibraryDetail(libraryId: number): UseLibraryDetailResult {
  // 서재 데이터 가져오기
  const {
    data: library,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['library', libraryId],
    queryFn: () => getLibraryById(libraryId),
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 유지
    retry: 1, // 실패 시 1번 재시도
  });

  // 최근 업데이트 가져오기
  const { data: recentUpdates } = useQuery<UpdateHistoryItem[]>({
    queryKey: ['library-updates', libraryId],
    queryFn: () => getLibraryUpdates(libraryId, 5), // 최신 5개 항목만 가져오기
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!library, // 라이브러리 데이터가 있을 때만 실행
  });

  // 구독하기 mutation
  const { mutateAsync: subscribeMutation } = useMutation({
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
  const { mutateAsync: unsubscribeMutation } = useMutation({
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

  // 서재 공개 상태 변경 mutation
  const { mutateAsync: updateLibraryMutation } = useMutation({
    mutationFn: ({ id, isPublic }: { id: number; isPublic: boolean }) =>
      updateLibrary(id, { isPublic }),
    onSuccess: data => {
      const visibility = data.isPublic ? '공개' : '비공개';
      toast.success(`서재를 ${visibility}로 변경했습니다.`);
      refetch(); // 서재 정보 다시 가져오기
    },
    onError: (error: any) => {
      let errorMessage = '서재 설정 변경 중 오류가 발생했습니다';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });

  // 구독 토글 핸들러
  const handleSubscriptionToggle = async () => {
    if (!library) return;

    try {
      if (library.isSubscribed) {
        await unsubscribeMutation(library.id);
      } else {
        await subscribeMutation(library.id);
      }

      // 구독 상태 변경 후 서재 정보 다시 가져오기
      await refetch();
    } catch (error) {
      console.error('구독 상태 변경 중 오류 발생:', error);
      // 에러 핸들링은 mutation 내부에서 처리
    }
  };

  // 서재 공개 상태 변경 핸들러
  const updateLibraryVisibility = async (id: number, isPublic: boolean) => {
    try {
      await updateLibraryMutation({ id, isPublic });
    } catch (error) {
      console.error('서재 공개 상태 변경 중 오류 발생:', error);
      // 에러 핸들링은 mutation 내부에서 처리
    }
  };

  // 라이브러리 객체에 recentUpdates 추가
  const libraryWithUpdates = library
    ? {
        ...library,
        recentUpdates: recentUpdates || [],
      }
    : null;

  return {
    library: libraryWithUpdates as Library | null,
    isLoading,
    isSubscribed: !!library?.isSubscribed,
    handleSubscriptionToggle,
    updateLibraryVisibility,
  };
}
