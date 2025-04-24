import { createReview, createReviewWithImages } from '@/apis/review/review';
import { ReviewType } from '@/apis/review/types';
import { SearchResult } from '@/apis/search/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface UseCreateReviewResult {
  content: string;
  setContent: (content: string) => void;
  images: File[];
  handleImageChange: (files: FileList | null) => void;
  removeImage: (index: number) => void;
  handleCreateReview: () => Promise<void>;
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
        };

        // 이미지가 있으면 이미지와 함께 리뷰 생성, 없으면 일반 리뷰 생성
        if (images.length > 0) {
          return createReviewWithImages(reviewData, images);
        } else {
          return createReview(reviewData);
        }
      },
      onSuccess: () => {
        // 게시물 목록 새로고침
        queryClient.invalidateQueries({ queryKey: ['community-reviews'] });

        // 입력 필드 초기화
        setContent('');
        setImages([]);
        setSelectedBook(null);
        setRating(0);
        setType('general');
      },
    });

  // 게시물 생성 핸들러
  const handleCreateReview = async () => {
    if (!content.trim()) return;

    try {
      await createReviewMutation();
    } catch (error) {
      console.error('Failed to create review:', error);
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
