import { ReadingStatusType } from '@/apis/reading-status/types';
import { BookOpen, UserCheck, Users } from 'lucide-react';
import { useBookDetails } from '../hooks';

export function BookReadingStats() {
  const { book } = useBookDetails();

  // 서버 응답 데이터에서 값 가져오기 - readingStats가 없어도 기본값 사용
  const readingStatusCounts = book?.readingStats?.readingStatusCounts || {};

  // 읽기 상태별 카운트 - 서버 응답 데이터와 연동
  const wantToReadCount =
    (readingStatusCounts as Record<ReadingStatusType, number>)[
      ReadingStatusType.WANT_TO_READ
    ] || 0;
  const readingCount =
    (readingStatusCounts as Record<ReadingStatusType, number>)[
      ReadingStatusType.READING
    ] || 0;
  const readCount =
    (readingStatusCounts as Record<ReadingStatusType, number>)[
      ReadingStatusType.READ
    ] || 0;

  // 읽기 상태 라벨
  const readingStatusLabels = {
    [ReadingStatusType.WANT_TO_READ]: '읽고 싶어요',
    [ReadingStatusType.READING]: '읽는 중',
    [ReadingStatusType.READ]: '읽었어요',
  };

  // 통계 아이템 렌더링 함수
  const StatItem = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full ${color}`}
      >
        <Icon className="h-3.5 w-3.5 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium" suppressHydrationWarning>
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="grid grid-cols-3 gap-4">
        <StatItem
          icon={BookOpen}
          label={readingStatusLabels[ReadingStatusType.WANT_TO_READ]}
          value={wantToReadCount}
          color="bg-purple-500"
        />

        <StatItem
          icon={Users}
          label={readingStatusLabels[ReadingStatusType.READING]}
          value={readingCount}
          color="bg-blue-500"
        />

        <StatItem
          icon={UserCheck}
          label={readingStatusLabels[ReadingStatusType.READ]}
          value={readCount}
          color="bg-green-500"
        />
      </div>
    </div>
  );
}
