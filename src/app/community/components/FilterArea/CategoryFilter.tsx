import { ReviewType } from '@/apis/review/types';
import { communityCategoryColors } from '@/atoms/community';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: ReviewType | 'all';
  onCategoryClick: (categoryId: ReviewType | 'all') => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryClick,
}: CategoryFilterProps) {
  // 카테고리 목록 생성
  const mainCategories = [
    { id: 'all', name: '전체' },
    { id: 'general', name: '일반' },
    { id: 'discussion', name: '토론' },
    { id: 'review', name: '리뷰' },
    { id: 'question', name: '질문' },
    { id: 'meetup', name: '모임' },
  ];

  return (
    <div className="flex gap-2">
      {mainCategories.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryClick(category.id as ReviewType | 'all')}
          className={cn(
            'flex h-9 cursor-pointer items-center rounded-full px-4 text-[14px] font-medium transition-colors',
            selectedCategory === category.id
              ? 'bg-gray-900 text-white'
              : 'text-gray-700 hover:opacity-90'
          )}
          style={{
            backgroundColor:
              selectedCategory === category.id
                ? undefined
                : communityCategoryColors[
                    category.id as keyof typeof communityCategoryColors
                  ] || '#F9FAFB',
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
