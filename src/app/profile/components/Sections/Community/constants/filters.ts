import { ReviewType } from '@/apis/review/types';

// 리뷰 타입 필터 정의 (review 타입 제외)
export const reviewTypeFilters = [
  { id: 'all', name: '전체', type: undefined },
  { id: 'general', name: '일반', type: 'general' as ReviewType },
  { id: 'discussion', name: '토론', type: 'discussion' as ReviewType },
  { id: 'question', name: '질문', type: 'question' as ReviewType },
  { id: 'meetup', name: '모임', type: 'meetup' as ReviewType },
];

// 전체 리뷰 타입 배열
export const allReviewTypes = [
  'general',
  'discussion',
  'question',
  'meetup',
] as ReviewType[];
