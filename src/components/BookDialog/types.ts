export interface BookDetails {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  category?: string;
  rating?: number;
  totalRatings?: number;
  publisher?: string;
  publishDate?: string;
  description?: string;
  toc?: string;
  authorInfo?: string;
  publisherReview?: string;
  pageCount?: number;
  isbn?: string;
  originalTitle?: string;
  translator?: string;
  dimensions?: string;
  weight?: string;
  tags?: string[];
  series?: {
    name: string;
    volume: number;
    totalVolumes: number;
  };
  awards?: Array<{
    name: string;
    year: string;
  }>;
  quotes?: Array<{
    id: number;
    content: string;
    page: number;
    likes: number;
  }>;
  reviews?: Array<{
    id: number;
    user: {
      name: string;
      avatar: string;
      readCount?: number;
    };
    rating: number;
    content: string;
    date: string;
    likes: number;
    comments: number;
  }>;
  readingStatus?: {
    currentReaders: number;
    completedReaders: number;
    averageReadingTime: string;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  similarBooks?: Array<{
    id: number;
    title: string;
    coverImage: string;
    author: string;
    rating?: number;
  }>;
  bookshelves?: Array<{
    id: number;
    name: string;
    owner: string;
    bookCount: number;
    followers: number;
    thumbnail?: string;
  }>;
  readingGroups?: Array<{
    id: number;
    name: string;
    memberCount: number;
    description?: string;
    thumbnail?: string;
  }>;
}
