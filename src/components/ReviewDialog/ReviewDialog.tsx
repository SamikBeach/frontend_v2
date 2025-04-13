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
}

export function ReviewDialog({
  open,
  onOpenChange,
  bookTitle,
  onSubmit,
  initialRating = 0,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState('');

  // Dialog가 열릴 때마다 initialRating 값으로 rating 업데이트
  useEffect(() => {
    if (open && initialRating > 0) {
      setRating(initialRating);
    }
  }, [open, initialRating]);

  const handleSubmit = () => {
    onSubmit(rating, content);
    // 제출 후 상태 초기화
    setRating(0);
    setContent('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-5 py-4">
          <DialogDescription className="mb-6 text-sm text-gray-600">
            <span className="font-medium text-gray-800">{bookTitle}</span>에
            대한 솔직한 리뷰를 남겨주세요
          </DialogDescription>

          <div className="mb-6 flex flex-col items-center space-y-3">
            <p className="text-sm text-gray-500">별점을 선택해주세요</p>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`h-9 w-9 cursor-pointer ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-200 hover:text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
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
              placeholder="이 책에 대한 솔직한 리뷰를 남겨주세요..."
              className="min-h-[150px] w-full resize-none rounded-2xl border-gray-200 bg-gray-50 p-4 text-sm placeholder:text-gray-400 focus:border-pink-200 focus:bg-white focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div className="mt-2 text-xs text-gray-500">
            최소 10자 이상 작성해주세요
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
          <Button
            variant="outline"
            className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || content.trim().length < 10}
            className="rounded-xl bg-pink-500 text-white hover:bg-pink-600 disabled:bg-pink-100"
          >
            <PenLine className="mr-1.5 h-4 w-4" />
            리뷰 등록하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
