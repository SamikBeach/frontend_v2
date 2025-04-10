import { getAllDiscoverData } from '@/apis/discover-category/discover-category';
import { DiscoverCategory } from '@/apis/discover-category/types';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 모든 발견하기 카테고리 데이터를 가져오는 훅
 */
export function useDiscoverCategories() {
  const { data: categories = [] } = useSuspenseQuery<DiscoverCategory[]>({
    queryKey: ['discover-categories'],
    queryFn: getAllDiscoverData,
    staleTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
  });

  return { categories };
}
