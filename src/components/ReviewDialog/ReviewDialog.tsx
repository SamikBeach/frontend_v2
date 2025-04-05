import { PenLine, Star } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookTitle: string;
  onSubmit: (rating: number, content: string) => void;
}

export function ReviewDialog({
  open,
  onOpenChange,
  bookTitle,
  onSubmit,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    onSubmit(rating, content);
    // 제출 후 상태 초기화
    setRating(0);
    setContent('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>리뷰 작성하기</DialogTitle>
          <DialogDescription>
            {bookTitle}에 대한 리뷰를 작성해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-gray-500">별점을 선택해주세요</p>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="이 책에 대한 솔직한 리뷰를 남겨주세요..."
              className="min-h-[150px] w-full resize-none rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || !content.trim()}
            className="bg-gray-900 hover:bg-gray-800"
          >
            <PenLine className="mr-1.5 h-4 w-4" />
            리뷰 등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
