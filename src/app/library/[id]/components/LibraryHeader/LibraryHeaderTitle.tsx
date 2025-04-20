import { Library } from '@/apis/library/types';
import { FC } from 'react';
import { LibraryHeaderTags } from './LibraryHeaderTags';
import { LibraryHeaderVisibilityBadge } from './LibraryHeaderVisibilityBadge';

interface LibraryHeaderTitleProps {
  library: Library;
  isOwner: boolean;
  hasTags: boolean | undefined;
}

export const LibraryHeaderTitle: FC<LibraryHeaderTitleProps> = ({
  library,
  isOwner,
  hasTags,
}) => {
  return (
    <div className="mb-2 flex flex-wrap items-center gap-3">
      <h1 className="text-2xl font-bold text-gray-900">{library.name}</h1>

      {/* 서재 태그 */}
      {hasTags && library.tags && <LibraryHeaderTags tags={library.tags} />}

      {/* 공개/비공개 배지는 소유자에게만 표시 */}
      {isOwner && library && (
        <LibraryHeaderVisibilityBadge isPublic={library.isPublic} />
      )}
    </div>
  );
};
