import api from '../axios';
import { RatingDto, RatingResponseDto, UpdateRatingDto } from './types';

/**
 * 책에 대한 평점 생성 또는 업데이트
 */
export const createOrUpdateRating = async (
  bookId: number,
  ratingData: RatingDto
): Promise<RatingResponseDto> => {
  const response = await api.post<RatingResponseDto>(
    `/rating/book/${bookId}`,
    ratingData
  );
  return response.data;
};

/**
 * 특정 사용자의 책에 대한 평점 조회
 */
export const getUserBookRating = async (
  bookId: number
): Promise<RatingResponseDto> => {
  const response = await api.get<RatingResponseDto>(
    `/rating/book/${bookId}/user`
  );
  return response.data;
};

/**
 * 책에 대한 모든 평점 조회
 */
export const getBookRatings = async (
  bookId: number
): Promise<RatingResponseDto[]> => {
  const response = await api.get<RatingResponseDto[]>(`/rating/book/${bookId}`);
  return response.data;
};

/**
 * 평점 삭제
 */
export const deleteRating = async (ratingId: number): Promise<void> => {
  await api.delete(`/rating/${ratingId}`);
};

/**
 * 현재 사용자의 모든 평점 조회
 */
export const getUserRatings = async (): Promise<RatingResponseDto[]> => {
  const response = await api.get<RatingResponseDto[]>(`/rating/user`);
  return response.data;
};

/**
 * 평점 업데이트
 */
export const updateRating = async (
  ratingId: number,
  ratingData: UpdateRatingDto
): Promise<RatingResponseDto> => {
  const response = await api.patch<RatingResponseDto>(
    `/rating/${ratingId}`,
    ratingData
  );
  return response.data;
};
