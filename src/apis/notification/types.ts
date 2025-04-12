export enum NotificationType {
  COMMENT = 'comment',
  LIBRARY_UPDATE = 'library_update',
  LIKE = 'like',
  FOLLOW = 'follow',
  SYSTEM = 'system',
}

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
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAsReadRequest {
  isRead: boolean;
}
