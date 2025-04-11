import { LibraryTag } from '@/apis/library/types';
import { Badge } from '@/components/ui/badge';

export interface TagListProps {
  tags?: LibraryTag[];
}

export function TagList({ tags }: TagListProps) {
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map(tag => (
        <Badge
          key={tag.id}
          variant="outline"
          className="border-gray-200 bg-white text-xs font-normal text-gray-600"
        >
          {tag.tagName}
        </Badge>
      ))}
    </div>
  );
}
