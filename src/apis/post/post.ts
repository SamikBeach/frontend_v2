import api from '../axios';
import {
  Comment,
  CreateCommentDto,
  CreatePostDto,
  HomePopularPostsResponse,
  PostResponseDto,
  PostsResponse,
  PostType,
  UpdatePostDto,
} from './types';

/**
 * 모든 게시물 조회 (페이지네이션, 필터링 지원)
 */
export const getAllPosts = async (
  page: number = 1,
  limit: number = 10,
  type?: PostType
): Promise<PostsResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (type) {
    params.type = type;
  }

  const response = await api.get<PostsResponse>('/post', { params });
  return response.data;
};

/**
 * 게시물 상세 조회
 */
export const getPostById = async (id: number): Promise<PostResponseDto> => {
  const response = await api.get<PostResponseDto>(`/post/${id}`);
  return response.data;
};

/**
 * 게시물 생성
 */
export const createPost = async (
  data: CreatePostDto
): Promise<PostResponseDto> => {
  const formData = new FormData();
  formData.append('content', data.content);
  formData.append('type', data.type);

  if (data.bookIds && data.bookIds.length > 0) {
    data.bookIds.forEach(bookId => {
      formData.append('bookIds', bookId.toString());
    });
  }

  const response = await api.post<PostResponseDto>('/post', formData);
  return response.data;
};

/**
 * 이미지와 함께 게시물 생성
 */
export const createPostWithImages = async (
  data: CreatePostDto,
  images: File[]
): Promise<PostResponseDto> => {
  const formData = new FormData();
  formData.append('content', data.content);
  formData.append('type', data.type);

  if (data.bookIds && data.bookIds.length > 0) {
    data.bookIds.forEach(bookId => {
      formData.append('bookIds', bookId.toString());
    });
  }

  images.forEach(image => {
    formData.append('images', image);
  });

  const response = await api.post<PostResponseDto>('/post', formData);
  return response.data;
};

/**
 * 게시물 수정
 */
export const updatePost = async (
  id: number,
  data: UpdatePostDto
): Promise<PostResponseDto> => {
  const response = await api.put<PostResponseDto>(`/post/${id}`, data);
  return response.data;
};

/**
 * 게시물 삭제
 */
export const deletePost = async (id: number): Promise<void> => {
  await api.delete(`/post/${id}`);
};

/**
 * 게시물 좋아요
 */
export const likePost = async (postId: number): Promise<void> => {
  await api.post(`/post/${postId}/like`);
};

/**
 * 게시물 좋아요 취소
 */
export const unlikePost = async (postId: number): Promise<void> => {
  await api.delete(`/post/${postId}/like`);
};

/**
 * 게시물의 댓글 목록 조회
 */
export const getCommentsByPostId = async (
  postId: number
): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(`/post/${postId}/comment`);
  return response.data;
};

/**
 * 댓글 작성
 */
export const createComment = async (
  postId: number,
  data: CreateCommentDto
): Promise<Comment> => {
  const response = await api.post<Comment>(`/post/${postId}/comment`, data);
  return response.data;
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (commentId: number): Promise<void> => {
  await api.delete(`/post/comment/${commentId}`);
};

/**
 * 홈화면용 인기 게시물 조회
 */
export const getPopularPostsForHome = async (
  limit: number = 4
): Promise<HomePopularPostsResponse> => {
  const response = await api.get<HomePopularPostsResponse>(
    '/post/popular/home',
    {
      params: { limit },
    }
  );
  return response.data;
};
