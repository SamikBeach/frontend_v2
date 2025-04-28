import { LibraryPreviewDto } from '@/apis/user/types';
import { Tag, getTagColor } from '@/utils/tags';

/**
 * 라이브러리 태그 포맷팅 훅
 * 모든 라이브러리에서 태그를 추출하고 중복 제거 및 색상 추가
 */
export function useLibraryTags(libraries: LibraryPreviewDto[]): Tag[] {
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
}
