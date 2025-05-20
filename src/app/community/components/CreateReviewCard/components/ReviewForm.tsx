import { ReviewType } from '@/apis/review/types';
import { communityCategoryColors } from '@/atoms/community';
import { Button } from '@/components/ui/button';
import {
  ResponsiveSelect,
  ResponsiveSelectContent,
  ResponsiveSelectItem,
  ResponsiveSelectTrigger,
} from '@/components/ui/responsive-select';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { BookOpen, SendHorizontal } from 'lucide-react';
import { ReactNode, useEffect, useMemo, useRef } from 'react';

interface ReviewFormProps {
  content: string;
  setContent: (content: string) => void;
  type: ReviewType;
  setType: (type: ReviewType) => void;
  handleBookDialogOpen: () => void;
  handleSubmitReview: () => Promise<void>;
  isLoading: boolean;
  children?: ReactNode;
  onTextareaFocus?: () => void;
}

export function ReviewForm({
  content,
  setContent,
  type,
  setType,
  handleBookDialogOpen,
  handleSubmitReview,
  isLoading,
  children,
  onTextareaFocus,
}: ReviewFormProps) {
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 제출 후 content가 비워지면 textarea 높이 초기화
  useEffect(() => {
    if (content === '' && textareaRef.current) {
      textareaRef.current.style.height = '';
    }
  }, [content]);

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

  // 현재 선택된 태그 정보
  const tagInfo = useMemo(() => {
    return {
      name: getTagName(type),
      color:
        communityCategoryColors[type as keyof typeof communityCategoryColors] ||
        '#F9FAFB',
    };
  }, [type]);

  return (
    <>
      <Textarea
        ref={textareaRef}
        placeholder="어떤 책에 대해 이야기하고 싶으신가요?"
        className="min-h-[80px] rounded-lg border-gray-200 bg-[#F9FAFB] text-base sm:min-h-[100px] sm:rounded-xl md:text-[15px]"
        value={content}
        onChange={e => setContent(e.target.value)}
        onInput={e => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = `${target.scrollHeight}px`;
        }}
        onFocus={onTextareaFocus}
      />

      {/* 선택된 책 정보 및 별점/읽기 상태 표시 (children으로 받음) */}
      {children}

      <div className="mt-2 flex flex-wrap items-center gap-1 sm:mt-3 sm:gap-2">
        <ResponsiveSelect value={type} onValueChange={handleTypeChange}>
          <ResponsiveSelectTrigger
            size={isMobile ? 'sm' : 'default'}
            className="h-7 w-[110px] cursor-pointer rounded-lg border-gray-200 bg-white text-xs font-medium text-gray-700 sm:h-9 sm:w-[130px] sm:rounded-xl sm:text-sm"
          >
            <div className="flex items-center">
              <span
                className="mr-1 inline-block h-2 w-2 rounded-full sm:mr-1.5 sm:h-2.5 sm:w-2.5"
                style={{ backgroundColor: tagInfo.color }}
              />
              {tagInfo.name}
            </div>
          </ResponsiveSelectTrigger>
          <ResponsiveSelectContent className="rounded-lg">
            <ResponsiveSelectItem value="general" className="cursor-pointer">
              <div className="flex items-center">
                <span
                  className="mr-1 inline-block h-2 w-2 rounded-full sm:mr-1.5 sm:h-2.5 sm:w-2.5"
                  style={{
                    backgroundColor:
                      communityCategoryColors.general || '#F9FAFB',
                  }}
                />
                일반
              </div>
            </ResponsiveSelectItem>
            <ResponsiveSelectItem value="discussion" className="cursor-pointer">
              <div className="flex items-center">
                <span
                  className="mr-1 inline-block h-2 w-2 rounded-full sm:mr-1.5 sm:h-2.5 sm:w-2.5"
                  style={{
                    backgroundColor:
                      communityCategoryColors.discussion || '#F9FAFB',
                  }}
                />
                토론
              </div>
            </ResponsiveSelectItem>
            <ResponsiveSelectItem value="review" className="cursor-pointer">
              <div className="flex items-center">
                <span
                  className="mr-1 inline-block h-2 w-2 rounded-full sm:mr-1.5 sm:h-2.5 sm:w-2.5"
                  style={{
                    backgroundColor:
                      communityCategoryColors.review || '#F9FAFB',
                  }}
                />
                리뷰
              </div>
            </ResponsiveSelectItem>
            <ResponsiveSelectItem value="question" className="cursor-pointer">
              <div className="flex items-center">
                <span
                  className="mr-1 inline-block h-2 w-2 rounded-full sm:mr-1.5 sm:h-2.5 sm:w-2.5"
                  style={{
                    backgroundColor:
                      communityCategoryColors.question || '#F9FAFB',
                  }}
                />
                질문
              </div>
            </ResponsiveSelectItem>
            <ResponsiveSelectItem value="meetup" className="cursor-pointer">
              <div className="flex items-center">
                <span
                  className="mr-1 inline-block h-2 w-2 rounded-full sm:mr-1.5 sm:h-2.5 sm:w-2.5"
                  style={{
                    backgroundColor:
                      communityCategoryColors.meetup || '#F9FAFB',
                  }}
                />
                모임
              </div>
            </ResponsiveSelectItem>
          </ResponsiveSelectContent>
        </ResponsiveSelect>

        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg border-gray-200 bg-white text-xs font-medium text-gray-700 sm:h-9 sm:rounded-xl sm:text-sm"
          onClick={handleBookDialogOpen}
          disabled={type !== 'review'}
        >
          <BookOpen className="mr-1 h-3 w-3 text-gray-500 sm:mr-1.5 sm:h-4 sm:w-4" />
          책 추가
        </Button>

        <Button
          className="ml-auto h-8 rounded-lg bg-green-600 px-2.5 text-xs font-medium text-white hover:bg-green-700 sm:h-9 sm:rounded-xl sm:px-4 sm:text-sm"
          onClick={handleSubmitReview}
          disabled={!content.trim() || isLoading}
        >
          <SendHorizontal className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-4 sm:w-4" />
          제출하기
        </Button>
      </div>
    </>
  );
}
