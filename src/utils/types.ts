import { RatingResponseDto } from '@/apis/rating/types';
import { BookDetails } from '@/components/BookDialog/types';

/**
 * 평점 관련 타입을 확장한 도서 타입
 */
export interface BookWithRating extends Omit<BookDetails, 'userRating'> {
  userRating: RatingResponseDto | null;
  rating: number;
  totalRatings: number;
}
