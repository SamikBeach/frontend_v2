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
    <div className="mb-2">
      <div className="mb-1 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{library.name}</h1>

        {/* 공개/비공개 배지는 소유자에게만 표시 - 타이틀 바로 우측에 배치 */}
        {isOwner && library && (
          <LibraryHeaderVisibilityBadge isPublic={library.isPublic} />
        )}
      </div>

      {/* 서재 설명 - 모바일에서 타이틀 바로 아래에 표시 */}
      <div className="mb-3 lg:hidden">
        {library.description ? (
          <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm">
            <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-blue-400 to-indigo-500"></div>
            <p className="pl-2 text-sm leading-relaxed font-medium text-gray-700">
              {library.description}
            </p>
          </div>
        ) : (
          <div className="text-sm text-gray-500">설명이 없습니다</div>
        )}
      </div>

      {/* 서재 태그 */}
      {hasTags && library.tags && (
        <div className="flex flex-wrap items-center gap-3">
          <LibraryHeaderTags tags={library.tags} />
        </div>
      )}
    </div>
  );
};
