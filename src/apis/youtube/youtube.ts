import api from '../axios';
import { GetBookVideosParams, YouTubeBookVideosResponse } from './types';

/**
 * 특정 책에 대한 YouTube 영상 목록을 조회합니다.
 */
export const getBookVideos = async (
  params: GetBookVideosParams
): Promise<YouTubeBookVideosResponse> => {
  const { bookId, maxResults, isbn } = params;

  const response = await api.get<YouTubeBookVideosResponse>(
    `/youtube/book/${bookId}`,
    {
      params: {
        maxResults,
        isbn,
      },
    }
  );

  return response.data;
};
