import { ReviewType } from '@/apis/review/types';
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
import { BookOpen, SendHorizontal } from 'lucide-react';

interface ReviewFormProps {
  content: string;
  setContent: (content: string) => void;
  type: ReviewType;
  setType: (type: ReviewType) => void;
  handleBookDialogOpen: () => void;
  handleSubmitReview: () => Promise<void>;
  isLoading: boolean;
}

export function ReviewForm({
  content,
  setContent,
  type,
  setType,
  handleBookDialogOpen,
  handleSubmitReview,
  isLoading,
}: ReviewFormProps) {
  // 태그 변경 핸들러
  const handleTypeChange = (newType: string) => {
    setType(newType as ReviewType);
  };

  // 태그별 이름 가져오기
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
    <>
      <Textarea
        placeholder="어떤 책에 대해 이야기하고 싶으신가요?"
        className="min-h-[100px] resize-none rounded-xl border-gray-200 bg-[#F9FAFB] text-[15px]"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Select value={type} onValueChange={handleTypeChange}>
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
          onClick={handleBookDialogOpen}
          disabled={type !== 'review'}
        >
          <BookOpen className="mr-1.5 h-4 w-4 text-gray-500" />책 추가
        </Button>

        <Button
          className="ml-auto h-9 rounded-xl bg-gray-900 px-4 font-medium text-white hover:bg-gray-800"
          onClick={handleSubmitReview}
          disabled={!content.trim() || isLoading}
        >
          <SendHorizontal className="mr-1.5 h-4 w-4" />
          제출하기
        </Button>
      </div>
    </>
  );
}
