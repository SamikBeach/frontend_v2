import { ReviewType } from '@/apis/review/types';
import { communityCategoryColors } from '@/atoms/community';

interface TagNameProps {
  type: ReviewType | string;
}

export function TagName({ type }: TagNameProps) {
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
    <span
      className="ml-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-700"
      style={{
        backgroundColor:
          communityCategoryColors[
            type as keyof typeof communityCategoryColors
          ] || '#F9FAFB',
      }}
    >
      {getTagName(type)}
    </span>
  );
}
