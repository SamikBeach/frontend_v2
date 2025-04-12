import { NotificationType } from '@/apis/notification';

// API 모델을 기반으로 프론트엔드 필드만 확장한 알림 타입
export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  sourceId?: number;
  sourceType?: string;
  actorId?: number;
  imageUrl?: string;
  linkUrl?: string;
  createdAt: string;
  updatedAt: string;

  // 프론트엔드 전용 필드 (UI 표시용)
  timestamp?: string; // createdAt을 포맷팅한 값
  user?: {
    name: string;
    avatar: string;
  };
}
