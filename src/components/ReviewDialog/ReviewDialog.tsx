import { PenLine, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookTitle: string;
  onSubmit: (rating: number, content: string) => void;
  initialRating?: number;
  isSubmitting?: boolean;
}

export function ReviewDialog({
  open,
  onOpenChange,
  bookTitle,
  onSubmit,
  initialRating = 0,
  isSubmitting = false,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState('');

  // Dialog가 열릴 때마다 initialRating 값으로 rating 업데이트
  useEffect(() => {
    // 다이얼로그가 열려있는 상태에서도 initialRating이 변경되면 업데이트
    setRating(initialRating);
  }, [initialRating]);

  // Dialog가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setContent('');
    }
  }, [open]);

  const handleSubmit = () => {
    onSubmit(rating, content);
  };

  return (
    <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
      <DialogContent className="fixed top-1/2 left-1/2 max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border-none p-0 shadow-lg">
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between rounded-t-2xl bg-white/95 px-5 backdrop-blur-xl">
          <DialogTitle className="text-base font-medium">
            리뷰 작성하기
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-5 py-4">
          <DialogDescription className="mb-6 text-sm text-gray-600">
            <span className="font-medium text-gray-800">{bookTitle}</span>에
            대한 리뷰를 남겨주세요
          </DialogDescription>

          <div className="mb-6 flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`h-9 w-9 cursor-pointer ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-200 hover:text-gray-300'
                  }`}
                  onClick={() => !isSubmitting && setRating(star)}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-gray-900">
              {rating === 0
                ? '별점 선택'
                : rating === 1
                  ? '별로예요'
                  : rating === 2
                    ? '아쉬워요'
                    : rating === 3
                      ? '보통이에요'
                      : rating === 4
                        ? '좋아요'
                        : '최고예요'}
            </p>
          </div>

          <div className="mb-4">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="이 책에 대한 리뷰를 남겨주세요"
              className="min-h-[150px] w-full resize-none rounded-2xl border-gray-200 bg-gray-50 p-4 text-sm placeholder:text-gray-400 focus:border-pink-200 focus:bg-white focus:ring-2 focus:ring-pink-100"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
          <Button
            variant="outline"
            className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-200"
          >
            <PenLine className="mr-1.5 h-4 w-4" />
            {isSubmitting ? '등록 중...' : '리뷰 등록하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
