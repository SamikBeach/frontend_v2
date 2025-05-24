// 드래그 앤 드롭 타입 정의
export const ItemTypes = {
  CATEGORY: 'category',
  SUBCATEGORY: 'subcategory',
} as const;

// 기본 설정값
export const DEFAULT_SEARCH_LIMIT = 100;
export const DEFAULT_SEARCH_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_DELAY = 300;
export const SCROLL_THRESHOLD = 200;
