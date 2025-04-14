export type ReviewType =
  | 'general'
  | 'discussion'
  | 'review'
  | 'question'
  | 'meetup';

export interface Author {
  id: number;
  username: string;
  email: string;
}

export interface ReviewImage {
  id: number;
  url: string;
  caption?: string;
}

export interface ReviewBook {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  publisher: string;
}

export interface ReviewResponseDto {
  id: number;
  content: string;
  type: ReviewType;
  author: Author;
  images: ReviewImage[];
  books: ReviewBook[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Comment {
  id: number;
  content: string;
  author: Author;
  createdAt: Date | string;
  updatedAt: Date | string;
  replies?: Comment[];
}

export interface CreateReviewDto {
  content: string;
  type: ReviewType;
  bookIds?: number[];
}

export interface UpdateReviewDto {
  content?: string;
  type?: ReviewType;
  bookIds?: number[];
}

export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface ReviewsResponse {
  data: Review[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// 홈화면용 인기 리뷰 프리뷰 타입
export interface HomeReviewPreview {
  id: number;
  content: string;
  type: ReviewType;
  authorName: string;
  previewImage?: string;
  likeCount: number;
  commentCount: number;
  books?: {
    id: number;
    title: string;
    author: string;
    coverImage: string;
  }[];
  createdAt: Date | string;
}

// 홈화면용 인기 리뷰 응답 타입
export interface HomePopularReviewsResponse {
  reviews: HomeReviewPreview[];
}

export interface ReviewUser {
  id: number;
  username: string;
  email?: string;
  profileImage?: string | null;
}

export interface ReviewComment {
  id: number;
  content: string;
  author: ReviewUser;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  content: string;
  type: string;
  author: ReviewUser;
  book?: {
    id: number;
    title: string;
    author: string;
    coverImage: string;
    isbn: string;
  };
  books?: ReviewBook[];
  images: ReviewImage[];
  likeCount?: number;
  likesCount?: number;
  commentCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  userLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponse {
  comments: ReviewComment[];
}
