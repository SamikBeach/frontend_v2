export type ReviewType =
  | 'general'
  | 'discussion'
  | 'review'
  | 'question'
  | 'meetup';

// 리뷰 정렬 타입 정의
export type ReviewSortType = 'likes' | 'comments' | 'recent';

export interface Author {
  id: number;
  username: string;
  email: string;
  profileImage?: string;
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
  isbn?: string;
  isbn13?: string;
}

export interface ReviewResponseDto {
  id: number;
  content: string;
  type: ReviewType;
  author: Author;
  images: ReviewImage[];
  books: ReviewBook[];
  userRating?: UserRating;
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
  likeCount?: number;
  isLiked?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  replies?: Comment[];
}

export interface CreateReviewDto {
  content: string;
  type: ReviewType;
  bookId?: number;
  isbn?: string;
}

export interface UpdateReviewDto {
  content?: string;
  type?: ReviewType;
  bookId?: number;
  isbn?: string;
}

export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface ReviewsResponse {
  reviews: ReviewResponseDto[];
  total: number;
  page: number;
  totalPages: number;
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

export interface UserRating {
  bookId: number;
  rating: number;
  comment?: string;
}

export interface AuthorRating {
  bookId: number;
  rating: number;
  comment?: string;
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
  userRating?: UserRating;
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

// 호환성 이슈 해결을 위한 기존 api 응답 형식 타입 정의
export interface BookReviewsResponse {
  data: Review[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    sort?: string;
  };
  book?: any; // 백엔드에서 주는 책 정보
}
