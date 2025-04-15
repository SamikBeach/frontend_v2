import { RatingResponseDto } from '@/apis/rating/types';
import { BookWithRating } from '@/utils/types';

/**
 * 책의 평균 별점을 업데이트하는 유틸 함수
 * @param oldData 기존 책 데이터
 * @param newRating 새로 등록/수정된 별점
 * @returns 업데이트된 책 데이터
 */
export function updateBookRating(
  oldData: BookWithRating | null,
  newRating: RatingResponseDto
): BookWithRating | null {
  if (!oldData) return oldData;

  // 기존에 userRating이 없고 새로 평점을 등록했거나,
  // 기존 평점과 새 평점이 다른 경우 totalRatings와 평균 평점 업데이트
  const hadPreviousRating = !!oldData.userRating;
  const ratingChanged = oldData.userRating?.rating !== newRating.rating;

  // 평균 평점 업데이트 계산
  let newRatingValue = oldData.rating || 0;
  let newTotalRatings = oldData.totalRatings || 0;

  if (!hadPreviousRating) {
    // 새 평점 추가 - 총합에 새 평점 추가하고 카운트 증가
    const totalRatingSum = newRatingValue * newTotalRatings + newRating.rating;
    newTotalRatings += 1;
    newRatingValue = newTotalRatings > 0 ? totalRatingSum / newTotalRatings : 0;
  } else if (ratingChanged) {
    // 평점 변경 - 총합에서 이전 평점 제거하고 새 평점 추가
    const oldRating = oldData.userRating?.rating ?? 0;
    const totalRatingSum =
      newRatingValue * newTotalRatings - oldRating + newRating.rating;
    newRatingValue = newTotalRatings > 0 ? totalRatingSum / newTotalRatings : 0;
  }

  return {
    ...oldData,
    userRating: newRating,
    rating: newRatingValue,
    totalRatings: newTotalRatings,
  };
}

/**
 * 책에서 별점을 삭제할 때 평균 별점을 업데이트하는 유틸 함수
 * @param oldData 기존 책 데이터
 * @returns 업데이트된 책 데이터
 */
export function removeBookRating(
  oldData: BookWithRating | null
): BookWithRating | null {
  if (!oldData) return oldData;

  // 평점을 삭제하는 경우 totalRatings 감소 및 평균 평점 재계산
  let newRatingValue = oldData.rating || 0;
  let newTotalRatings = oldData.totalRatings || 0;

  // 이전에 평점이 있었다면
  if (oldData.userRating) {
    const oldRating = oldData.userRating.rating;
    if (newTotalRatings > 1) {
      // 총합에서 삭제된 평점 제거하고 카운트 감소
      const totalRatingSum = newRatingValue * newTotalRatings - oldRating;
      newTotalRatings -= 1;
      newRatingValue = totalRatingSum / newTotalRatings;
    } else {
      // 마지막 평점이 삭제되면 0으로 설정
      newTotalRatings = 0;
      newRatingValue = 0;
    }
  }

  return {
    ...oldData,
    userRating: null,
    rating: newRatingValue,
    totalRatings: newTotalRatings,
  };
}
