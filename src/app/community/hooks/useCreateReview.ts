import { createReview, createReviewWithImages } from '@/apis/review/review';
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
}

export function useCreateReview(): UseCreateReviewResult {
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [type, setType] = useState<ReviewType>('general');
  const [images, setImages] = useState<File[]>([]);
  const [selectedBook, setSelectedBook] = useState<SearchResult | null>(null);
  const [rating, setRating] = useState(0);

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
        const reviewData = {
          content,
          type,
          bookId: selectedBook
            ? selectedBook.bookId || selectedBook.id
            : undefined,
          isbn: selectedBook
            ? selectedBook.isbn13 || selectedBook.isbn
            : undefined,
          rating: selectedBook ? rating : undefined, // 책이 있을 때만 별점 전송
        };

        // 이미지가 있으면 이미지와 함께 리뷰 생성, 없으면 일반 리뷰 생성
        if (images.length > 0) {
          return createReviewWithImages(reviewData, images);
        } else {
          return createReview(reviewData);
        }
      },
      onSuccess: () => {
        // 게시물 목록 새로고침 - 올바른 쿼리 키로 무효화
        queryClient.invalidateQueries({
          queryKey: ['communityReviews'],
          exact: false,
        });

        // 입력 필드 초기화
        setContent('');
        setImages([]);
        setSelectedBook(null);
        setRating(0);
        setType('general');

        toast.success('리뷰가 성공적으로 등록되었습니다.');
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
  };
}
