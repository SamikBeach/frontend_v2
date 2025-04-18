// 태그 목록 생성
const tags: Tag[] = [
  // "전체" 태그
  createDefaultTag(),
  // 모든 라이브러리 태그 기반으로 변환
  ...(allTags || []).map((tag, index) => ({
    id: String(tag.id),
    name: tag.tagName,
    color: getTagColor(index),
  })),
];
