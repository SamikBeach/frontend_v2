export interface YouTubeVideoResult {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  channelTitle: string;
}

export interface YouTubeBookVideosResponse {
  book: {
    id: number;
    title: string;
    author: string;
    publisher: string;
    coverImage: string;
    isbn: string;
    isbn13: string;
  };
  data: YouTubeVideoResult[];
  meta: {
    total: number;
    maxResults: number;
  };
}

export interface GetBookVideosParams {
  bookId: number;
  maxResults?: number;
  isbn?: string;
}
