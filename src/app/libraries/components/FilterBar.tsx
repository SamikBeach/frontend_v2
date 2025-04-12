import { TagResponseDto } from '@/apis/library/types';
import { libraryCategoryFilterAtom } from '@/atoms/library';
import { Skeleton } from '@/components/ui/skeleton';
import { useAtom } from 'jotai';
import { usePopularTags } from '../hooks/usePopularTags';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface FilterBarProps {
  isLoading?: boolean;
}

export function FilterBar({ isLoading = false }: FilterBarProps) {
  const [categoryFilter, setCategoryFilter] = useAtom(
    libraryCategoryFilterAtom
  );
  const { tags: popularTags, isLoading: isLoadingTags } = usePopularTags(10);

  // 카테고리 생성
  const categories: Category[] = [
    // "전체" 카테고리
    {
      id: 'all',
      name: '전체',
      color: '#E2E8F0',
    },
    // 인기 태그 기반 카테고리
    ...(popularTags || []).map((tag: TagResponseDto, index: number) => ({
      id: String(tag.id),
      name: tag.name,
      color: getTagColor(index),
    })),
  ];

  const handleCategoryClick = (categoryId: string) => {
    setCategoryFilter(categoryId);
  };

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading || isLoadingTags) {
    return (
      <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
        <div className="flex gap-2 px-0.5">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
      <div className="flex gap-2 px-0.5">
        {categories.map((category: Category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium transition-all ${
              categoryFilter === category.id
                ? 'bg-gray-900 text-white'
                : 'hover:bg-gray-50'
            }`}
            style={{
              backgroundColor:
                categoryFilter === category.id ? undefined : category.color,
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// 태그 색상 배열 - 파스텔톤
const TAG_COLORS = [
  '#FFF8E2', // 파스텔 옐로우
  '#F2E2FF', // 파스텔 퍼플
  '#FFE2EC', // 파스텔 코럴
  '#E2FFFC', // 파스텔 민트
  '#E2F0FF', // 파스텔 블루
  '#FFECDA', // 파스텔 오렌지
  '#ECFFE2', // 파스텔 그린
  '#FFE2F7', // 파스텔 핑크
];

// 태그 인덱스에 따른 색상 반환
function getTagColor(index: number): string {
  return TAG_COLORS[index % TAG_COLORS.length];
}
