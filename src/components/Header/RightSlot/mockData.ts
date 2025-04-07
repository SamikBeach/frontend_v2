import { Notification } from './types';

// 가짜 알림 데이터
export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'comment',
    title: '새 댓글',
    content: '김철수님이 당신의 리뷰에 댓글을 남겼습니다.',
    timestamp: '10분 전',
    isRead: false,
    user: {
      name: '김철수',
      avatar: 'https://i.pravatar.cc/150?u=user1',
    },
  },
  {
    id: 2,
    type: 'library',
    title: '서재 업데이트',
    content: '구독 중인 서재 [철학의 시작]에 새 책이 추가되었습니다.',
    timestamp: '30분 전',
    isRead: false,
    user: {
      name: '김철수',
      avatar: 'https://i.pravatar.cc/150?u=user1',
    },
    libraryId: 1,
  },
  {
    id: 3,
    type: 'like',
    title: '새 좋아요',
    content: '이영희님이 당신의 독서 목록을 좋아합니다.',
    timestamp: '2시간 전',
    isRead: false,
    user: {
      name: '이영희',
      avatar: 'https://i.pravatar.cc/150?u=user2',
    },
  },
  {
    id: 4,
    type: 'follow',
    title: '새 팔로워',
    content: '박지민님이 당신을 팔로우합니다.',
    timestamp: '1일 전',
    isRead: true,
    user: {
      name: '박지민',
      avatar: 'https://i.pravatar.cc/150?u=user3',
    },
  },
  {
    id: 5,
    type: 'system',
    title: '시스템 알림',
    content: '보안 설정이 업데이트되었습니다. 확인해보세요.',
    timestamp: '2일 전',
    isRead: true,
  },
];
