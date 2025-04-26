import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';
import { FC } from 'react';

interface LibraryHeaderVisibilityBadgeProps {
  isPublic: boolean | undefined;
}

export const LibraryHeaderVisibilityBadge: FC<
  LibraryHeaderVisibilityBadgeProps
> = ({ isPublic }) => {
  return (
    <Badge
      variant="outline"
      className={
        isPublic !== undefined
          ? isPublic
            ? 'border-green-200 bg-green-50 text-green-600'
            : 'border-yellow-200 bg-yellow-50 text-yellow-600'
          : 'h-6 border-gray-200 bg-gray-50 px-4'
      }
    >
      {isPublic !== undefined &&
        (isPublic ? (
          <>
            <Eye className="mr-1 h-3 w-3" />
            공개
          </>
        ) : (
          <>
            <EyeOff className="mr-1 h-3 w-3" />
            비공개
          </>
        ))}
    </Badge>
  );
};
