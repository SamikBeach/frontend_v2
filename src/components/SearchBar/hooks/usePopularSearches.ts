import { getPopularSearchTerms } from '@/apis/search';
import { PopularSearch } from '@/apis/search/types';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 인기 검색어 조회 훅
 */
export function usePopularSearches(limit: number = 10) {
  return useSuspenseQuery<PopularSearch[]>({
    queryKey: ['search', 'popular', limit],
    queryFn: () => getPopularSearchTerms(limit),
    staleTime: 1000 * 60 * 30, // 30분
  });
}
