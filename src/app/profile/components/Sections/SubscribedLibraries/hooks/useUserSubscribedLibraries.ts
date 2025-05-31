import api from '@/apis/axios';
import { LibraryPreviewDto } from '@/apis/user/types';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

interface UseUserSubscribedLibrariesProps {
  userId: number;
  pageSize?: number;
}

interface UseUserSubscribedLibrariesResult {
  libraries: LibraryPreviewDto[];
  totalLibraries: number;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

/**
 * 사용자가 구독한 서재 목록을 가져오는 훅 (무한 스크롤 지원)
 */
export function useUserSubscribedLibraries({
  userId,
  pageSize = 6,
}: UseUserSubscribedLibrariesProps): UseUserSubscribedLibrariesResult {
  const fetchUserSubscribedLibraries = async ({ pageParam = 1 }) => {
    const response = await api.get(`/user/${userId}/libraries/subscribed`, {
      params: { page: pageParam, limit: pageSize },
    });

    // hasNextPage 값이 API 응답에 없는 경우 계산
    const data = response.data;
    const total = data.total || 0;
    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      ...data,
      hasNextPage: pageParam < totalPages,
      page: pageParam,
      totalPages,
    };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['user-subscribed-libraries-infinite', userId, pageSize],
      queryFn: fetchUserSubscribedLibraries,
      getNextPageParam: lastPage => {
        // 다음 페이지가 있는 경우 페이지 번호 반환, 없는 경우 undefined
        return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
      },
      initialPageParam: 1,
    });

  // 모든 페이지의 서재 목록을 하나의 배열로 병합
  const libraries = data?.pages.flatMap(page => page.libraries || []) || [];

  // 총 서재 수는 첫 페이지의 total 값을 사용
  const totalLibraries = data?.pages[0]?.total || 0;

  return {
    libraries,
    totalLibraries,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
}
