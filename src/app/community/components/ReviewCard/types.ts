import { ReadingStatusType } from '@/apis/reading-status/types';
import { ReviewResponseDto } from '@/apis/review/types';

// 읽기 통계 정보 인터페이스
export interface ReadingStats {
  currentReaders?: number;
  completedReaders?: number;
  averageReadingTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  readingStatusCounts?: Record<ReadingStatusType, number>;
}

// 유저 평점 인터페이스
export interface UserRating {
  rating: number;
  comment?: string;
}

// Extend the ReviewBook interface to add the missing properties
export interface ExtendedReviewBook {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  publisher: string;
  isbn?: string;
  isbn13?: string;
  publishDate?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  totalRatings?: number;
  ratingCount?: number;
  readingStats?: ReadingStats;
  userRating?: UserRating;
  userReadingStatus?: ReadingStatusType;
}

// 저자 평점 인터페이스
export interface AuthorRating {
  bookId: number;
  rating: number;
  comment?: string;
}

// Extend the ReviewResponseDto to include rating property
export interface ExtendedReviewResponseDto
  extends Omit<ReviewResponseDto, 'books'> {
  rating?: number;
  books: ExtendedReviewBook[];
  authorRatings?: AuthorRating[];
}

// 로컬에서 사용할 Comment 인터페이스 정의
export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    email?: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
  replies?: Comment[];
  isLiked?: boolean;
  likeCount?: number;
}

export interface ReviewCardProps {
  review: ReviewResponseDto;
  currentUser: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
}

export interface CommentItemProps {
  comment: Comment;
  formatDate: (date: string | Date) => string;
  currentUser: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
  onDelete: (commentId: number) => Promise<void>;
  onLike: (commentId: number, isLiked: boolean) => Promise<void>;
}
