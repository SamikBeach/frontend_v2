import { ReviewType } from '@/apis/review/types';
import { communityCategoryColors } from '@/atoms/community';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: ReviewType | 'all';
  onCategoryClick: (categoryId: ReviewType | 'all') => void;
  className?: string;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryClick,
  className,
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
    <div className={className}>
      <div className="no-scrollbar w-full overflow-x-auto pt-0.5 pb-1 md:pt-1 md:pb-1">
        <div className="flex gap-2 pr-2 pl-2 after:block after:w-1 after:flex-shrink-0 after:content-[''] md:flex-wrap md:gap-3 md:overflow-x-visible md:pr-0 md:pl-0 md:after:content-none">
          {mainCategories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id as ReviewType | 'all')}
              className={cn(
                'flex shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium transition-colors md:px-4 md:text-sm',
                'h-9 md:h-9',
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
        {/* 데스크탑용: md:flex md:flex-wrap ... 필요시 추가 */}
      </div>
    </div>
  );
}
