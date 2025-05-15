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
import { BookOpen, SendHorizontal } from 'lucide-react';
import { ReactNode, useMemo } from 'react';

interface ReviewFormProps {
  content: string;
  setContent: (content: string) => void;
  type: ReviewType;
  setType: (type: ReviewType) => void;
  handleBookDialogOpen: () => void;
  handleSubmitReview: () => Promise<void>;
  isLoading: boolean;
  isMobile?: boolean;
  children?: ReactNode;
}

export function ReviewForm({
  content,
  setContent,
  type,
  setType,
  handleBookDialogOpen,
  handleSubmitReview,
  isLoading,
  isMobile = false,
  children,
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

  // 현재 선택된 태그 정보
  const tagInfo = useMemo(() => {
    return {
      name: getTagName(type),
      color:
        communityCategoryColors[type as keyof typeof communityCategoryColors] ||
        '#F9FAFB',
    };
  }, [type]);

  // 모바일 환경에 따른 버튼 크기 및 텍스트 조정
  const buttonHeight = isMobile ? 'h-8' : 'h-9';
  const buttonRadius = isMobile ? 'rounded-lg' : 'rounded-xl';
  const selectWidth = isMobile ? 'w-[120px]' : 'w-[130px]';
  const textareaHeight = isMobile ? 'min-h-[90px]' : 'min-h-[100px]';
  const selectTriggerHeight = isMobile ? 'h-8' : 'h-9';
  const selectTriggerRadius = isMobile ? 'rounded-lg' : 'rounded-xl';
  const buttonPadding = isMobile ? 'px-3' : 'px-4';
  const iconSize = isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <>
      <Textarea
        placeholder="어떤 책에 대해 이야기하고 싶으신가요?"
        className={`${textareaHeight} resize-none rounded-xl border-gray-200 bg-[#F9FAFB] text-[15px]`}
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      {/* 선택된 책 정보 및 별점/읽기 상태 표시 (children으로 받음) */}
      {children}

      <div
        className={`mt-${isMobile ? '2' : '3'} flex flex-wrap items-center gap-${isMobile ? '1.5' : '2'}`}
      >
        <ResponsiveSelect value={type} onValueChange={handleTypeChange}>
          <ResponsiveSelectTrigger
            className={`${selectTriggerHeight} ${selectWidth} cursor-pointer ${selectTriggerRadius} border-gray-200 bg-white font-medium text-gray-700`}
          >
            <div className="flex items-center">
              <span
                className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: tagInfo.color }}
              />
              {tagInfo.name}
            </div>
          </ResponsiveSelectTrigger>
          <ResponsiveSelectContent className="rounded-lg">
            <ResponsiveSelectItem value="general" className="cursor-pointer">
              <div className="flex items-center">
                <span
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
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
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
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
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
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
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
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
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
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
          className={`${buttonHeight} ${buttonRadius} border-gray-200 bg-white font-medium text-gray-700`}
          onClick={handleBookDialogOpen}
          disabled={type !== 'review'}
        >
          <BookOpen className={`mr-1.5 ${iconSize} text-gray-500`} />책 추가
        </Button>

        <Button
          className={`ml-auto ${buttonHeight} ${buttonRadius} bg-gray-900 ${buttonPadding} font-medium text-white hover:bg-gray-800`}
          onClick={handleSubmitReview}
          disabled={!content.trim() || isLoading}
        >
          <SendHorizontal className={`mr-1.5 ${iconSize}`} />
          제출하기
        </Button>
      </div>
    </>
  );
}
