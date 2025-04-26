import { CommentWithReplies } from '@/apis/comment/types';
import { ReviewResponseDto, ReviewUser } from '@/apis/review/types';

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

// 유저 평점 인터페이스
export interface UserRating {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

// Extend the ReviewBook interface to add the missing properties
export interface ExtendedReviewBook {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  isbn: string;
  publisher: string;
  rating: number;
  reviews: number;
  userRating?: UserRating;
  readingStats?: ReadingStats;
}

// 저자 평점 인터페이스
export interface AuthorRating {
  bookId: number;
  rating: number;
  comment?: string;
}

// Extend the ReviewResponseDto to include rating property
export interface ExtendedReviewResponseDto extends ReviewResponseDto {
  book?: ExtendedReviewBook;
  comments?: Comment[];
  rating?: number;
  mentions?: ReviewUser[];
  likeCount?: number;
  likesCount?: number;
  commentCount?: number;
  commentsCount?: number;
  userLiked?: boolean;
  isLiked?: boolean;
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
  comment: CommentWithReplies;
  formatDate: (date: string | Date) => string;
  currentUser: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
  onLike?: (commentId: number, isLiked: boolean) => Promise<void>;
  onReply?: (commentId: number, content: string) => void;
  onEdit?: (commentId: number, content: string) => void;
  onDelete?: (commentId: number) => Promise<void>;
  isReply?: boolean;
}
