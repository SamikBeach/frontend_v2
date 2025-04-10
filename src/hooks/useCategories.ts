import { getAllCategories } from '@/apis/category/category';
import { pastelColors } from '@/atoms/popular';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface Category {
  id: string;
  name: string;
  color: string;
  subcategories: Array<{
    id: string;
    name: string;
  }>;
}

export function useCategories() {
  // 카테고리 데이터 가져오기
  const { data: rawCategories } = useSuspenseQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  // 카테고리 데이터에 컬러 추가 및 UI 형식으로 변환
  const categories = useMemo<Category[]>(() => {
    if (!rawCategories) return [];

    // formattedCategories 초기화
    const formattedCategories: Category[] = [];

    // API에서 가져온 데이터에 '전체' 카테고리가 있는지 확인
    const hasAllCategory = rawCategories.some(
      category => category.id.toString() === 'all' || category.name === '전체'
    );

    // '전체' 카테고리가 없는 경우에만 추가
    if (!hasAllCategory) {
      formattedCategories.push({
        id: 'all',
        name: '전체',
        color: '#E5E7EB',
        subcategories: [],
      });
    }

    // 각 카테고리에 색상 부여하고 형식 변환
    rawCategories.forEach((category, index) => {
      formattedCategories.push({
        id: category.id.toString(),
        name: category.name,
        color: pastelColors[index % pastelColors.length],
        subcategories: category.subCategories.map(sub => ({
          id: sub.id.toString(),
          name: sub.name,
        })),
      });
    });

    return formattedCategories;
  }, [rawCategories]);

  return categories;
}
