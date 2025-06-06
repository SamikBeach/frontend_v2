import { Book } from '@/apis/book/types';
import { ReadingStatusType } from '@/apis/reading-status/types';

export interface BookDetails extends Book {
  coverImage: string;
  totalRatings?: number;
  toc?: string;
  authorInfo?: string;
  publisherReview?: string;
  pageCount?: number;
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
  reviewDetails?: Array<{
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
    isCurrentUser?: boolean;
    comment?: string;
  }>;
  readingStatus?: {
    currentReaders: number;
    completedReaders: number;
    averageReadingTime: string;
    difficulty: 'easy' | 'medium' | 'hard';
    userReadingStatus?: ReadingStatusType;
    readingStatusCounts?: Record<ReadingStatusType, number>;
  };
  similarBooks?: Array<{
    id: number;
    title: string;
    coverImage: string;
    author: string;
    rating?: number;
  }>;
  libraries?: Array<{
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
