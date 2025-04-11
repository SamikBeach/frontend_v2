import { PostType } from '@/apis/post';
import {
  communityCategoryColors,
  communitySortColors,
} from '@/atoms/community';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  selectedCategory: PostType | 'all';
  selectedSort: 'popular' | 'latest' | 'following';
  onCategoryClick: (categoryId: PostType | 'all') => void;
  onSortClick: (sortId: 'popular' | 'latest' | 'following') => void;
}

export function FilterBar({
  selectedCategory,
  selectedSort,
  onCategoryClick,
  onSortClick,
}: FilterBarProps) {
  // 카테고리 목록 생성
  const mainCategories = [
    { id: 'all', name: '전체' },
    { id: 'general', name: '일반' },
    { id: 'discussion', name: '토론' },
    { id: 'review', name: '리뷰' },
    { id: 'question', name: '질문' },
    { id: 'meetup', name: '모임' },
  ];

  // 정렬 옵션
  const sortOptions = [
    { id: 'popular', name: '인기' },
    { id: 'following', name: '팔로잉' },
    { id: 'latest', name: '최신' },
  ];

  return (
    <div className="flex justify-between gap-2 overflow-x-auto py-1">
      {/* 메인 카테고리 버튼 섹션 */}
      <div className="flex gap-2">
        {mainCategories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id as PostType | 'all')}
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

      {/* 정렬 옵션 버튼 섹션 */}
      <div className="flex gap-2">
        {sortOptions.map(option => (
          <button
            key={option.id}
            onClick={() =>
              onSortClick(option.id as 'popular' | 'latest' | 'following')
            }
            className={cn(
              'flex h-9 cursor-pointer items-center rounded-full px-4 text-[14px] font-medium transition-colors',
              selectedSort === option.id
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:opacity-90'
            )}
            style={{
              backgroundColor:
                selectedSort === option.id
                  ? undefined
                  : communitySortColors[
                      option.id as keyof typeof communitySortColors
                    ] || '#F9FAFB',
            }}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}
