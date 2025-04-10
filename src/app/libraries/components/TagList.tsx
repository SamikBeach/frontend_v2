import { Badge } from '@/components/ui/badge';
import { TagListProps } from '../types';

export function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map(tag => (
        <Badge
          key={tag}
          variant="outline"
          className="border-gray-200 bg-white text-xs font-normal text-gray-600"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
