import { User } from '@/apis/types/auth';

export type { User };

export interface Notification {
  id: number;
  type: 'comment' | 'like' | 'follow' | 'mention' | 'system' | 'library';
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  user?: {
    name: string;
    avatar: string;
  };
  libraryId?: number;
}
