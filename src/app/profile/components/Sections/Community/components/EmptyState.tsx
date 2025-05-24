import { ReviewType } from '@/apis/review/types';
import {
  Calendar,
  FileText,
  HelpCircle,
  MessageCircle,
  Users,
} from 'lucide-react';
import { EmptyState as CommonEmptyState } from '../../../common';

interface EmptyStateProps {
  type: ReviewType | undefined;
}

/**
 * 선택된 타입별로 다른 메시지를 표시하는 빈 상태 컴포넌트
 */
export function EmptyState({ type }: EmptyStateProps) {
  // 타입별 메시지 및 아이콘 설정
  let title = '커뮤니티 활동이 없습니다';
  let description =
    '아직 커뮤니티 활동이 없습니다. 독서방에 참여하고 다양한 활동을 해보세요.';
  let icon = <Users className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />;

  if (type === 'general') {
    title = '일반 게시글이 없습니다';
    description =
      '아직 일반 게시글이 없습니다. 독서 경험이나 생각을 자유롭게 공유해보세요.';
    icon = <FileText className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />;
  } else if (type === 'discussion') {
    title = '토론 게시글이 없습니다';
    description =
      '아직 토론 게시글이 없습니다. 책에 대한 다양한 토론 주제를 공유하고 의견을 나눠보세요.';
    icon = <MessageCircle className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />;
  } else if (type === 'question') {
    title = '질문 게시글이 없습니다';
    description =
      '아직 질문 게시글이 없습니다. 책에 대한 궁금한 점을 질문하고 다른 독자들의 답변을 들어보세요.';
    icon = <HelpCircle className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />;
  } else if (type === 'meetup') {
    title = '모임 게시글이 없습니다';
    description =
      '아직 모임 게시글이 없습니다. 함께 책을 읽고 이야기 나눌 모임을 만들어보세요.';
    icon = <Calendar className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />;
  }

  return (
    <CommonEmptyState title={title} description={description} icon={icon} />
  );
}
