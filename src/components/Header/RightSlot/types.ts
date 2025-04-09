// User 타입은 컴포넌트에서 직접 정의하도록 변경
export interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  user?: {
    name: string;
    avatar: string;
  };
  link?: string;
}
