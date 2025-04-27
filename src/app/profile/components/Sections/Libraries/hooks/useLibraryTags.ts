import { LibraryPreviewDto } from '@/apis/user/types';
import { Tag, getTagColor } from '@/utils/tags';
import { useMemo } from 'react';

/**
 * 라이브러리 목록에서 태그를 추출하고 색상을 부여하는 훅
 * @param libraries 라이브러리 목록
 * @returns 포맷팅된 태그 목록
 */
export function useLibraryTags(libraries: LibraryPreviewDto[]): Tag[] {
  return useMemo(() => {
    // 모든 라이브러리에서 태그를 추출해 중복을 제거한 후 색상 추가
    const tagMap = new Map<string, Tag>();

    libraries.forEach(library => {
      if (!library.tags) return;

      library.tags.forEach((tag, index) => {
        if (!tagMap.has(String(tag.tagId))) {
          tagMap.set(String(tag.tagId), {
            id: String(tag.tagId),
            name: tag.tagName,
            color: getTagColor(index),
          });
        }
      });
    });

    return Array.from(tagMap.values());
  }, [libraries]);
}
