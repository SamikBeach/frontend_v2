export type PostType =
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

export interface PostImage {
  id: number;
  url: string;
  caption?: string;
}

export interface PostBook {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  publisher: string;
}

export interface PostResponseDto {
  id: number;
  content: string;
  type: PostType;
  author: Author;
  images: PostImage[];
  books: PostBook[];
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

export interface CreatePostDto {
  content: string;
  type: PostType;
  bookIds?: number[];
}

export interface CreateCommentDto {
  content: string;
  parentCommentId?: number;
}

export interface PostsResponse {
  posts: PostResponseDto[];
  total: number;
  page: number;
  totalPages: number;
}

// 홈화면용 인기 게시물 프리뷰 타입
export interface HomePostPreview {
  id: number;
  content: string;
  type: PostType;
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

// 홈화면용 인기 게시물 응답 타입
export interface HomePopularPostsResponse {
  posts: HomePostPreview[];
}
