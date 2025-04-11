import api from '../axios';
import {
  Comment,
  CreateCommentDto,
  CreatePostDto,
  PostResponseDto,
  PostsResponse,
  PostType,
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
  createPostDto: CreatePostDto,
  images?: FileList | File[]
): Promise<PostResponseDto> => {
  // FormData 객체 생성하여 이미지와 함께 전송
  const formData = new FormData();

  // JSON 데이터는 블롭으로 변환하여 추가
  formData.append(
    'createPostDto',
    new Blob([JSON.stringify(createPostDto)], { type: 'application/json' })
  );

  // 이미지가 있으면 추가
  if (images) {
    Array.from(images).forEach(file => {
      formData.append('images', file);
    });
  }

  const response = await api.post<PostResponseDto>('/post', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
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
 * 게시물 삭제
 */
export const deletePost = async (postId: number): Promise<void> => {
  await api.delete(`/post/${postId}`);
};

/**
 * 게시물의 댓글 목록 조회
 */
export const getPostComments = async (postId: number): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(`/post/${postId}/comment`);
  return response.data;
};

/**
 * 댓글 작성
 */
export const createComment = async (
  postId: number,
  createCommentDto: CreateCommentDto
): Promise<Comment> => {
  const response = await api.post<Comment>(
    `/post/${postId}/comment`,
    createCommentDto
  );
  return response.data;
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (commentId: number): Promise<void> => {
  await api.delete(`/post/comment/${commentId}`);
};
