import {
  Comment as ApiComment,
  ReviewResponseDto,
  ReviewUser,
} from '@/apis/review/types';

// 읽기 통계 정보 인터페이스
export interface ReadingStats {
  currentReaders: number;
  completedReaders: number;
  readingStatusCounts: {
    planning: number;
    reading: number;
    completed: number;
    dropped: number;
  };
}

// Extend the ReviewResponseDto to include rating property
export interface ExtendedReviewResponseDto
  extends Omit<ReviewResponseDto, 'likeCount' | 'commentCount' | 'isLiked'> {
  comments?: Comment[];
  rating?: number;
  mentions?: ReviewUser[];
  likeCount: number;
  likesCount?: number;
  commentCount: number;
  commentsCount?: number;
  userLiked?: boolean;
  isLiked: boolean;
  activityType?: string;
}

// 로컬에서 사용할 Comment 인터페이스 정의
export interface Comment {
  id: number;
  content: string;
  author: ReviewUser;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  likeCount?: number;
  isLiked?: boolean;
}

export interface ReviewCardProps {
  review: ExtendedReviewResponseDto;
  isDetailed?: boolean;
  onLike?: (reviewId: number) => void;
  onComment?: (reviewId: number) => void;
  onEdit?: (reviewId: number, review: ExtendedReviewResponseDto) => void;
  onDelete?: (reviewId: number) => void;
  onBookmark?: (reviewId: number) => void;
  onShare?: (reviewId: number) => void;
  onUserClick?: (userId: number) => void;
  onBookClick?: (bookId: number) => void;
  showFooter?: boolean;
  hideLikes?: boolean;
  hideComments?: boolean;
  disableMentions?: boolean;
}

export interface CommentItemProps {
  comment: ApiComment & { replies?: ApiComment[] };
  formatDate: (date: string | Date) => string;
  currentUser: {
    id: number;
    username: string;
    avatar?: string;
  };
  onLike?: (commentId: number, isLiked: boolean) => Promise<void>;
  onReply?: (commentId: number, content: string) => void;
  onEdit?: (commentId: number, content: string) => void;
  onDelete?: (commentId: number) => Promise<void>;
  isReply?: boolean;
}
