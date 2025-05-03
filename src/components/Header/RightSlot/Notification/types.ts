import { NotificationType, UserInfoDto } from '@/apis/notification';

// API 모델을 기반으로 프론트엔드 필드만 확장한 알림 타입
export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  content?: string;
  isRead: boolean;
  sourceId?: number;
  sourceType?: string;
  imageUrl?: string;
  linkUrl?: string;
  createdAt: string;
  updatedAt: string;

  // 관련 정보
  actor?: UserInfoDto;
  review?: any;
  comment?: any;
  library?: any;
  book?: any;
  details?: any;

  // 프론트엔드 전용 필드 (UI 표시용)
  timestamp?: string; // createdAt을 포맷팅한 값
  user?: {
    name: string;
    avatar?: string;
  };
}

// 각 컴포넌트별 Props 정의
export interface NotificationDropdownProps {
  className?: string;
}

export interface NotificationContentProps {
  onClose: () => void;
  isOpen: boolean;
}

export interface NotificationItemProps {
  notification: Notification;
  onItemClick: (notification: Notification) => void;
}

export interface NotificationBadgeProps {
  count?: number;
}

export interface NotificationTypeBadgeProps {
  type: string;
}

export interface PostTypeBadgeProps {
  sourceType?: string;
}
