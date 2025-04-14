import api from '../axios';
import {
  BookReadingStatsDto,
  ReadingStatusDto,
  ReadingStatusResponseDto,
} from './types';

/**
 * 독서 상태 생성 또는 업데이트
 */
export const createOrUpdateReadingStatus = async (
  bookId: number,
  readingStatus: ReadingStatusDto
): Promise<ReadingStatusResponseDto> => {
  const response = await api.post<ReadingStatusResponseDto>(
    `/reading-status/book/${bookId}`,
    readingStatus
  );
  return response.data;
};

/**
 * 특정 책에 대한 사용자의 독서 상태 조회
 */
export const getUserBookReadingStatus = async (
  bookId: number
): Promise<ReadingStatusResponseDto> => {
  const response = await api.get<ReadingStatusResponseDto>(
    `/reading-status/book/${bookId}/user`
  );
  return response.data;
};

/**
 * 책의 독서 상태 통계 조회
 */
export const getBookReadingStats = async (
  bookId: number
): Promise<BookReadingStatsDto> => {
  const response = await api.get<BookReadingStatsDto>(
    `/reading-status/book/${bookId}/stats`
  );
  return response.data;
};

/**
 * 독서 상태 삭제
 */
export const deleteReadingStatus = async (id: number): Promise<void> => {
  await api.delete(`/reading-status/${id}`);
};
