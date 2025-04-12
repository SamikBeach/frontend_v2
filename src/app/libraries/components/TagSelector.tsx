import { getAllTags, getPopularTags } from '@/apis/library/tag';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { useDebounce } from '@/hooks/useDebounce';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface TagSelectorProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  maxTags?: number;
}

export function TagSelector({
  selectedTags,
  onTagSelect,
  onTagRemove,
  maxTags = 5,
}: TagSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  // 인기 태그 가져오기 - useSuspenseQuery 사용
  const { data: popularTags = [] } = useSuspenseQuery({
    queryKey: ['popularTags'],
    queryFn: async () => {
      try {
        return await getPopularTags(10);
      } catch (error) {
        console.error('인기 태그를 가져오는데 실패했습니다:', error);
        return [];
      }
    },
  });

  // 검색어에 따른 태그 가져오기 - useSuspenseQuery 사용
  const { data: searchResult } = useSuspenseQuery({
    queryKey: ['tagSearch', debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm) {
        return { tags: [] };
      }

      try {
        return await getAllTags(1, 10, debouncedSearchTerm);
      } catch (error) {
        console.error('태그 검색 중 오류 발생:', error);
        return { tags: [] };
      }
    },
  });

  const tags = searchResult?.tags || [];

  // 태그 선택 핸들러
  const handleTagSelect = (tagName: string) => {
    if (selectedTags.length >= maxTags) {
      return;
    }
    if (!selectedTags.includes(tagName)) {
      onTagSelect(tagName);
    }
    setSearchQuery('');
  };

  // 새 태그 추가 핸들러
  const handleAddNewTag = () => {
    if (!searchQuery.trim() || selectedTags.includes(searchQuery.trim())) {
      return;
    }

    if (selectedTags.length >= maxTags) {
      return;
    }

    onTagSelect(searchQuery.trim());
    setSearchQuery('');
  };

  // 검색 결과에 표시할 태그 목록
  const filteredTags = tags.filter(tag => !selectedTags.includes(tag.name));

  // 옵션 아이템 형식으로 변환
  const tagOptions = filteredTags.map(tag => ({
    label: tag.name,
    value: tag.name,
    description: `사용 ${tag.usageCount}회`,
  }));

  // 새 태그 추가 옵션
  const newTagOption =
    searchQuery.trim() && !tags.some(tag => tag.name === searchQuery.trim())
      ? [
          {
            label: `"${searchQuery.trim()}" 태그 추가`,
            value: searchQuery.trim(),
            description: '새 태그',
            icon: <Plus className="mr-2 h-4 w-4" />,
          },
        ]
      : [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Combobox
            placeholder="태그 검색..."
            options={[...tagOptions, ...newTagOption]}
            value={searchQuery}
            onChange={setSearchQuery}
            onSelect={handleTagSelect}
            showEmpty={true}
            className="border-input bg-background ring-offset-background h-10 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <Button
          onClick={handleAddNewTag}
          disabled={!searchQuery.trim() || selectedTags.length >= maxTags}
          size="sm"
        >
          추가
        </Button>
      </div>

      {/* 선택된 태그 목록 */}
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <Badge key={tag} variant="secondary" className="group">
            {tag}
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-4 w-4 rounded-full p-0 opacity-70 transition-opacity group-hover:opacity-100"
              onClick={() => onTagRemove(tag)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">태그 제거</span>
            </Button>
          </Badge>
        ))}
        {selectedTags.length === 0 && (
          <p className="text-sm text-gray-500">
            선택된 태그가 없습니다. ({maxTags}개까지 선택 가능)
          </p>
        )}
      </div>

      {/* 인기 태그 섹션 */}
      {popularTags.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-700">인기 태그</h4>
          <div className="flex flex-wrap gap-2">
            {popularTags
              .filter(tag => !selectedTags.includes(tag.name))
              .map(tag => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="cursor-pointer bg-gray-50 px-2 py-1 text-sm hover:bg-gray-100"
                  onClick={() => handleTagSelect(tag.name)}
                >
                  {tag.name}
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
