import { getAllDiscoverCategories } from '@/apis/discover-category/discover-category';
import { DiscoverCategory } from '@/apis/discover-category/types';
import { useSuspenseQuery } from '@tanstack/react-query';

interface UseDiscoverCategoriesOptions {
  includeInactive?: boolean;
}

/**
 * 모든 발견하기 카테고리 데이터를 가져오는 훅
 */
export function useDiscoverCategories(
  options: UseDiscoverCategoriesOptions = {}
) {
  const { includeInactive = false } = options;

  const { data: categories = [] } = useSuspenseQuery<DiscoverCategory[]>({
    queryKey: ['discover-categories', includeInactive],
    queryFn: getAllDiscoverCategories,
    staleTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
    select: data => {
      // 먼저 displayOrder로 정렬
      const sortedData = data
        .map(category => ({
          ...category,
          subCategories: category.subCategories
            ? [...category.subCategories]
                .filter(sub => includeInactive || sub.isActive) // 서브카테고리도 활성화 필터링
                .sort((a, b) => a.displayOrder - b.displayOrder)
            : [],
        }))
        .sort((a, b) => a.displayOrder - b.displayOrder);

      // includeInactive가 false인 경우 활성 카테고리만 필터링
      if (!includeInactive) {
        return sortedData.filter(category => category.isActive);
      }
      return sortedData;
    },
  });

  return { categories };
}
