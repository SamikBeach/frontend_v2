import { createOrUpdateRating } from '@/apis/rating/rating';
import {
  ReadingStatusType,
  createOrUpdateReadingStatus,
  deleteReadingStatusByBookId,
} from '@/apis/reading-status';
import { createReview } from '@/apis/review/review';
import { ReviewType } from '@/apis/review/types';
import { SearchResult } from '@/apis/search/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

interface ValidationResult {
  valid: boolean;
  message?: string;
}

interface UseCreateReviewResult {
  content: string;
  setContent: (content: string) => void;
  images: File[];
  handleImageChange: (files: FileList | null) => void;
  removeImage: (index: number) => void;
  handleCreateReview: () => Promise<ValidationResult>;
  isLoading: boolean;
  type: ReviewType;
  setType: (type: ReviewType) => void;
  selectedBook: SearchResult | null;
  setSelectedBook: (book: SearchResult | null) => void;
  rating: number;
  setRating: (rating: number) => void;
  readingStatus: ReadingStatusType | null;
  setReadingStatus: (status: ReadingStatusType | null) => void;
}

export function useCreateReview(): UseCreateReviewResult {
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [type, setType] = useState<ReviewType>('general');
  const [images, setImages] = useState<File[]>([]);
  const [selectedBook, setSelectedBook] = useState<SearchResult | null>(null);
  const [rating, setRating] = useState(0);
  const [readingStatus, setReadingStatus] = useState<ReadingStatusType | null>(
    ReadingStatusType.READ
  );

  // 이미지 변경 핸들러
  const handleImageChange = (files: FileList | null) => {
    if (!files) return;

    // 최대 5개까지만 추가
    const newFiles = Array.from(files).slice(0, 5 - images.length);
    setImages(prev => [...prev, ...newFiles]);
  };

  // 이미지 제거 핸들러
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // 게시물 생성 mutation
  const { mutateAsync: createReviewMutation, isPending: isLoading } =
    useMutation({
      mutationFn: async () => {
        // 책이 선택된 경우에만 bookId와 isbn 처리
        let bookId: number | undefined = undefined;
        let bookIsbn = undefined;
        let isNegativeBookId = false;

        if (selectedBook) {
          // ID 추출 - NaN 방지를 위한 안전한 형변환
          const rawId = selectedBook.bookId ?? selectedBook.id;

          if (typeof rawId === 'number') {
            bookId = rawId;
          } else if (typeof rawId === 'string') {
            const parsedId = parseInt(rawId, 10);
            bookId = isNaN(parsedId) ? -1 : parsedId;
          } else {
            bookId = -1;
          }

          // ISBN 추출
          bookIsbn = selectedBook.isbn13 || selectedBook.isbn || '';

          // 북 ID가 음수인지 확인
          isNegativeBookId = bookId < 0;

          // 음수일 경우 -1로 설정
          if (isNegativeBookId) {
            bookId = -1;
          }
        }

        // 기본 리뷰 데이터 설정
        const reviewData = {
          content,
          type,
          bookId,
          // ISBN은 책이 선택된 경우 항상 전송
          isbn: isNegativeBookId ? bookIsbn : undefined,
        };

        // rating API가 필요한지 확인
        const shouldCallRatingAPI =
          selectedBook && rating > 0 && bookId !== undefined;

        // 별점이 있는 경우에만 별점 API 호출 - rating이 0인 경우 호출 안함
        if (shouldCallRatingAPI && bookId !== undefined) {
          // 별점 등록 API 호출 - isbn 항상 전송
          await createOrUpdateRating(
            bookId,
            { rating },
            isNegativeBookId ? bookIsbn : undefined
          );
        }

        // 읽기 상태 API 호출 - 리뷰 타입이고 책이 선택된 경우에만
        if (type === 'review' && bookId !== undefined) {
          if (readingStatus) {
            // 읽기 상태가 있으면 업데이트
            await createOrUpdateReadingStatus(
              bookId,
              { status: readingStatus },
              isNegativeBookId ? bookIsbn : undefined
            );
          } else {
            // 읽기 상태가 null이면 삭제
            await deleteReadingStatusByBookId(bookId);
          }
        }

        return createReview(reviewData);
      },
      onSuccess: () => {
        // 게시물 목록 새로고침 - 올바른 쿼리 키로 무효화
        queryClient.invalidateQueries({
          queryKey: ['communityReviews'],
          exact: false,
        });

        // 읽기 상태 관련 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: ['reading-status'],
          exact: false,
        });

        // 독서 상태별 도서 수 통계 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: ['user-statistics'],
          exact: false,
        });

        // 입력 필드 초기화
        setContent('');
        setImages([]);
        setSelectedBook(null);
        setRating(0);
        setType('general');
        setReadingStatus(ReadingStatusType.READ);

        toast.success('리뷰가 등록되었습니다.');
      },
      onError: (error: any) => {
        let errorMessage = '리뷰 등록 중 오류가 발생했습니다.';

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
      },
    });

  // 게시물 생성 핸들러
  const handleCreateReview = async (): Promise<ValidationResult> => {
    if (!content.trim()) {
      return { valid: false, message: '내용을 입력해주세요.' };
    }

    // 타입이 리뷰인 경우 책 선택 검증
    if (type === 'review' && !selectedBook) {
      return {
        valid: false,
        message: '리뷰 태그를 선택한 경우, 책을 추가해야 합니다.',
      };
    }

    // 책이 선택되었는데 별점이 없는 경우 검증
    if (selectedBook && rating === 0) {
      return {
        valid: false,
        message: '책을 추가한 경우, 별점을 입력해야 합니다.',
      };
    }

    try {
      await createReviewMutation();
      return { valid: true };
    } catch (error) {
      console.error('Failed to create review:', error);
      return { valid: false, message: '리뷰 등록에 실패했습니다.' };
    }
  };

  return {
    content,
    setContent,
    images,
    handleImageChange,
    removeImage,
    handleCreateReview,
    isLoading,
    type,
    setType,
    selectedBook,
    setSelectedBook,
    rating,
    setRating,
    readingStatus,
    setReadingStatus,
  };
}
