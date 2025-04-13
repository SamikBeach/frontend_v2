import { createReview } from '@/apis/review/review';
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
}

export function useCreateReview(): UseCreateReviewResult {
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [type, setType] = useState<
    'general' | 'discussion' | 'review' | 'question' | 'meetup'
  >('general');
  const [images, setImages] = useState<File[]>([]);

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
        return createReview(
          {
            content,
            type,
            bookIds: [],
          },
          images
        );
      },
      onSuccess: () => {
        // 게시물 목록 새로고침
        queryClient.invalidateQueries({ queryKey: ['community-reviews'] });

        // 입력 필드 초기화
        setContent('');
        setImages([]);
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
  };
}
