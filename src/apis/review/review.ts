import api from '../axios';
import {
  Comment,
  CommentsResponse,
  CreateCommentDto,
  CreateReviewDto,
  HomePopularReviewsResponse,
  Review,
  ReviewResponseDto,
  ReviewsResponse,
  ReviewType,
  UpdateCommentDto,
  UpdateReviewDto,
} from './types';

/**
 * 모든 리뷰 조회 (페이지네이션, 필터링 지원)
 */
export const getAllReviews = async (
  page: number = 1,
  limit: number = 10,
  type?: ReviewType
): Promise<ReviewsResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (type) {
    params.type = type;
  }

  const response = await api.get<ReviewsResponse>('/review', { params });
  return response.data;
};

/**
 * 리뷰 상세 조회
 */
export const getReviewById = async (id: number): Promise<ReviewResponseDto> => {
  const response = await api.get<ReviewResponseDto>(`/review/${id}`);
  return response.data;
};

/**
 * 리뷰 생성
 */
export const createReview = async (
  data: CreateReviewDto
): Promise<ReviewResponseDto> => {
  const payload: {
    content: string;
    type: ReviewType;
    bookId?: number;
    isbn?: string;
  } = {
    content: data.content,
    type: data.type,
  };

  if (data.bookId) {
    payload.bookId = parseInt(String(data.bookId), 10);
  }

  // ISBN이 제공된 경우(특히 bookId가 -1인 경우) 포함
  if (data.isbn) {
    payload.isbn = data.isbn;
  }

  const response = await api.post<ReviewResponseDto>('/review', payload);
  return response.data;
};

/**
 * 이미지와 함께 리뷰 생성
 */
export const createReviewWithImages = async (
  data: CreateReviewDto,
  images: File[]
): Promise<ReviewResponseDto> => {
  const formData = new FormData();
  formData.append('content', data.content);
  formData.append('type', data.type);

  if (data.bookId) {
    const bookIdNumber = parseInt(String(data.bookId), 10);
    formData.append('bookId', bookIdNumber.toString());
  }

  // ISBN이 제공된 경우(특히 bookId가 -1인 경우) 포함
  if (data.isbn) {
    formData.append('isbn', data.isbn);
  }

  images.forEach(image => {
    formData.append('images', image);
  });

  const response = await api.post<ReviewResponseDto>('/review', formData);
  return response.data;
};

/**
 * 리뷰 수정
 */
export const updateReview = async (
  id: number,
  data: UpdateReviewDto
): Promise<ReviewResponseDto> => {
  // 요청 본문 준비
  const payload = { ...data };

  // bookId가 음수이고 isbn이 제공된 경우를 처리
  if (data.bookId && data.bookId < 0 && data.isbn) {
    // ISBN을 포함하여 전송
    payload.bookId = data.bookId;
    payload.isbn = data.isbn;
  }

  const response = await api.put<ReviewResponseDto>(`/review/${id}`, payload);
  return response.data;
};

/**
 * 리뷰 삭제
 */
export const deleteReview = async (id: number): Promise<void> => {
  await api.delete(`/review/${id}`);
};

/**
 * 리뷰 좋아요
 */
export const likeReview = async (reviewId: number): Promise<void> => {
  await api.post(`/review/${reviewId}/like`);
};

/**
 * 리뷰 좋아요 취소
 */
export const unlikeReview = async (reviewId: number): Promise<void> => {
  await api.delete(`/review/${reviewId}/like`);
};

/**
 * 리뷰의 댓글 목록 조회
 */
export const getCommentsByReviewId = async (
  reviewId: number
): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(`/review/${reviewId}/comment`);
  return response.data;
};

/**
 * 댓글 작성
 */
export const createComment = async (
  reviewId: number,
  data: CreateCommentDto
): Promise<Comment> => {
  const response = await api.post<Comment>(`/review/${reviewId}/comment`, data);
  return response.data;
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (commentId: number): Promise<void> => {
  await api.delete(`/review/comment/${commentId}`);
};

/**
 * 홈화면용 인기 리뷰 조회
 */
export const getPopularReviewsForHome = async (
  limit: number = 4
): Promise<HomePopularReviewsResponse> => {
  const response = await api.get<HomePopularReviewsResponse>(
    '/review/popular/home',
    {
      params: { limit },
    }
  );
  return response.data;
};

/**
 * 특정 책에 대한 리뷰 목록 조회
 */
export const getBookReviews = async (
  bookId: number,
  page: number = 1,
  limit: number = 10,
  sort: 'likes' | 'comments' | 'recent' = 'likes'
): Promise<ReviewsResponse> => {
  const response = await api.get<ReviewsResponse>(`/review/book/${bookId}`, {
    params: { page, limit, sort },
  });
  return response.data;
};

/**
 * 리뷰에 댓글 작성
 */
export const addReviewComment = async (
  reviewId: number,
  data: CreateCommentDto
): Promise<Review> => {
  const response = await api.post(`/review/${reviewId}/comment`, data);
  return response.data;
};

/**
 * 리뷰의 댓글 목록 조회
 */
export const getReviewComments = async (
  reviewId: number
): Promise<CommentsResponse> => {
  const response = await api.get<CommentsResponse>(
    `/review/${reviewId}/comment`
  );
  return response.data;
};

/**
 * 댓글 수정
 */
export const updateComment = async (
  commentId: number,
  data: UpdateCommentDto
): Promise<Comment> => {
  const response = await api.patch<Comment>(
    `/review/comment/${commentId}`,
    data
  );
  return response.data;
};
