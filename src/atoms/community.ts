import { PostType } from '@/apis/post';
import { atom } from 'jotai';

// 카테고리 필터 atom
export const communityTypeFilterAtom = atom<PostType | 'all'>('all');

// 정렬 옵션 atom
export const communitySortOptionAtom = atom<'popular' | 'latest' | 'following'>(
  'popular'
);

// 검색어 atom
export const communitySearchQueryAtom = atom<string>('');

// 선택된 게시물 ID atom
export const selectedPostIdAtom = atom<string | null>(null);

// 커뮤니티 UI 상태 - 게시물 작성 모달 표시 여부
export const postFormVisibleAtom = atom<boolean>(false);

// 파스텔 색상 목록 (커뮤니티 카테고리에서 사용)
export const communityCategoryColors = {
  all: '#E2E8F0', // 연한 그레이
  general: '#E2F0FF', // 연한 블루
  discussion: '#FFF8E2', // 연한 옐로우
  review: '#F2E2FF', // 연한 퍼플
  question: '#FFE2EC', // 연한 코럴
  meetup: '#E2FFFC', // 연한 민트
};

// 정렬 옵션 색상
export const communitySortColors = {
  popular: '#FFE2E2', // 연한 레드
  following: '#E2F0FF', // 연한 블루
  latest: '#E2FFE9', // 연한 그린
};
