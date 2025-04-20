import { LibraryTag } from '@/apis/library/types';
import { Badge } from '@/components/ui/badge';
import { getTagColor } from '@/utils/tags';
import { FC } from 'react';

// 실제 API에서 오는 태그 타입 (LibraryTag 인터페이스와 일치하지 않는 경우를 위한 추가 타입)
interface ApiTag extends Omit<LibraryTag, 'name' | 'tagName'> {
  name?: string;
  tagName?: string;
}

interface LibraryHeaderTagsProps {
  tags: LibraryTag[];
}

export const LibraryHeaderTags: FC<LibraryHeaderTagsProps> = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Badge
          key={tag.id}
          className="rounded-full border-0 px-2.5 py-0.5 text-xs font-medium text-gray-700"
          style={{
            backgroundColor: getTagColor(index % 8),
          }}
        >
          {(tag as ApiTag).tagName || (tag as ApiTag).name}
        </Badge>
      ))}
    </div>
  );
};
