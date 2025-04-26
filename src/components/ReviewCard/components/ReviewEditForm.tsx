import { ReviewType } from '@/apis/review/types';
import { SearchResult } from '@/apis/search/types';
import { communityCategoryColors } from '@/atoms/community';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, SendHorizontal, Star, X } from 'lucide-react';

interface ReviewEditFormProps {
  content: string;
  setContent: (content: string) => void;
  type: ReviewType;
  setType: (type: ReviewType) => void;
  selectedBook: SearchResult | null;
  rating: number;
  setRating: (rating: number) => void;
  onSave: () => void;
  onCancel: () => void;
  onBookDialogOpen: () => void;
  onRemoveSelectedBook: () => void;
  originalType: ReviewType;
}

export function ReviewEditForm({
  content,
  setContent,
  type,
  setType,
  selectedBook,
  rating,
  setRating,
  onSave,
  onCancel,
  onBookDialogOpen,
  onRemoveSelectedBook,
  originalType,
}: ReviewEditFormProps) {
  const getTagName = (tagType: string) => {
    switch (tagType) {
      case 'discussion':
        return '토론';
      case 'review':
        return '리뷰';
      case 'question':
        return '질문';
      case 'meetup':
        return '모임';
      default:
        return '일반';
    }
  };

  return (
    <div className="flex-1">
      <Textarea
        placeholder="어떤 책에 대해 이야기하고 싶으신가요?"
        className="min-h-[100px] resize-none rounded-xl border-gray-200 bg-[#F9FAFB] text-[15px]"
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setContent(e.target.value)
        }
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Select value={type} onValueChange={setType as any}>
          <SelectTrigger className="h-9 w-[130px] cursor-pointer rounded-xl border-gray-200 bg-white font-medium text-gray-700">
            <SelectValue>
              <div className="flex items-center">
                <span
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      communityCategoryColors[
                        type as keyof typeof communityCategoryColors
                      ] || '#F9FAFB',
                  }}
                ></span>
                {getTagName(type)}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general" className="cursor-pointer">
              <div className="flex items-center">
                <span
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      communityCategoryColors.general || '#F9FAFB',
                  }}
                ></span>
                일반
              </div>
            </SelectItem>
            <SelectItem value="discussion" className="cursor-pointer">
              <div className="flex items-center">
                <span
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      communityCategoryColors.discussion || '#F9FAFB',
                  }}
                ></span>
                토론
              </div>
            </SelectItem>
            {/* 원본 타입이 'review'인 경우에만 리뷰 옵션 표시 */}
            {originalType === 'review' && (
              <SelectItem value="review" className="cursor-pointer">
                <div className="flex items-center">
                  <span
                    className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        communityCategoryColors.review || '#F9FAFB',
                    }}
                  ></span>
                  리뷰
                </div>
              </SelectItem>
            )}
            <SelectItem value="question" className="cursor-pointer">
              <div className="flex items-center">
                <span
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      communityCategoryColors.question || '#F9FAFB',
                  }}
                ></span>
                질문
              </div>
            </SelectItem>
            <SelectItem value="meetup" className="cursor-pointer">
              <div className="flex items-center">
                <span
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      communityCategoryColors.meetup || '#F9FAFB',
                  }}
                ></span>
                모임
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-xl border-gray-200 bg-white font-medium text-gray-700"
          onClick={onBookDialogOpen}
          disabled={type !== 'review'}
        >
          <BookOpen className="mr-1.5 h-4 w-4 text-gray-500" />
          {selectedBook ? '책 변경' : '책 추가'}
        </Button>

        {selectedBook && (
          <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5">
            <img
              src={selectedBook.image}
              alt={selectedBook.title}
              className="h-5 w-4 rounded object-cover"
            />
            <span className="max-w-[150px] truncate text-sm font-medium text-gray-800">
              {selectedBook.title}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-1.5 h-5 w-5 rounded-full p-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              onClick={e => {
                e.stopPropagation();
                onRemoveSelectedBook();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {type === 'review' && selectedBook && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`h-5 w-5 cursor-pointer ${
                  star <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        )}

        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            className="h-9 rounded-xl border-gray-200 bg-white font-medium text-gray-700"
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            className="h-9 rounded-xl bg-gray-900 px-4 font-medium text-white hover:bg-gray-800"
            onClick={onSave}
            disabled={!content.trim()}
          >
            <SendHorizontal className="mr-1.5 h-4 w-4" />
            저장
          </Button>
        </div>
      </div>

      {selectedBook && type === 'review' && (
        <div className="mt-3 flex items-center rounded-lg border border-gray-200 bg-gray-50 p-3">
          <img
            src={selectedBook.image}
            alt={selectedBook.title}
            className="h-16 w-12 rounded object-cover"
          />
          <div className="ml-3">
            <h3 className="font-medium text-gray-900">{selectedBook.title}</h3>
            <p className="text-sm text-gray-500">{selectedBook.author}</p>
          </div>
        </div>
      )}
    </div>
  );
}
