import {
  deleteAllRecentSearches,
  deleteRecentSearch,
  getRecentSearchTerms,
} from '@/apis/search';
import { RecentSearch } from '@/apis/search/types';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

/**
 * 최근 검색어 조회 훅
 */
export function useRecentSearches(limit: number = 5) {
  return useSuspenseQuery<{
    recentSearches: RecentSearch[];
    count: number;
  }>({
    queryKey: ['search', 'recent', limit],
    queryFn: () => getRecentSearchTerms(limit),
    staleTime: 0, // 항상 최신 데이터를 가져오도록 0으로 설정
  });
}

/**
 * 최근 검색어 전체 삭제 훅
 */
export function useDeleteAllRecentSearches() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllRecentSearches,
    onSuccess: () => {
      // 삭제 성공 시 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['search', 'recent'] });
    },
  });
}

/**
 * 최근 검색어 개별 삭제 훅
 */
export function useDeleteRecentSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecentSearch,
    onSuccess: () => {
      // 삭제 성공 시 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['search', 'recent'] });
    },
  });
}
