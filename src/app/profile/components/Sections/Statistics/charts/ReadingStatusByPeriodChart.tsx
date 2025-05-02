import { useSuspenseQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ReadingStatusType } from '@/apis/reading-status/types';
import { getReadingStatusByPeriod } from '@/apis/user/user';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { NoDataMessage } from '../components/NoDataMessage';
import { PrivacyToggle } from '../components/PrivacyToggle';
import { PrivateDataMessage } from '../components/PrivateDataMessage';
import { useStatisticsSettings } from '../hooks/useStatisticsSettings';

interface ReadingStatusByPeriodChartProps {
  userId: number;
}

// 읽기 상태별 컬러 매핑 (파스텔톤으로 변경)
const STATUS_COLORS = {
  [ReadingStatusType.READ]: '#86efac', // green-300 (파스텔)
  [ReadingStatusType.READING]: '#93c5fd', // blue-300 (파스텔)
  [ReadingStatusType.WANT_TO_READ]: '#c4b5fd', // violet-300 (파스텔)
};

// 읽기 상태별 표시 이름 (BookDialog와 일치시킴)
const STATUS_LABELS = {
  [ReadingStatusType.READ]: '읽었어요',
  [ReadingStatusType.READING]: '읽는 중',
  [ReadingStatusType.WANT_TO_READ]: '읽고 싶어요',
};

// 읽기 상태 정렬 순서를 위한 우선순위 설정
const STATUS_ORDER = {
  [STATUS_LABELS[ReadingStatusType.READ]]: 1, // 첫번째로 표시
  [STATUS_LABELS[ReadingStatusType.READING]]: 2, // 두번째로 표시
  [STATUS_LABELS[ReadingStatusType.WANT_TO_READ]]: 3, // 세번째로 표시
};

type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

// 날짜 형식 포맷팅 함수
const formatTooltipDate = (label: string, periodType: PeriodType): string => {
  if (periodType === 'yearly') {
    return `${label}년`;
  } else if (periodType === 'monthly') {
    // YYYY-MM 형식
    const [year, month] = label.split('-');
    return format(new Date(Number(year), Number(month) - 1, 1), 'yyyy년 M월', {
      locale: ko,
    });
  } else if (periodType === 'weekly') {
    // 이미 한글 형식이면 그대로 반환
    if (label.includes('월') && label.includes('주')) {
      return label;
    }
    // 다른 형식이면 주 표시 추가
    return `${label} 주`;
  } else if (periodType === 'daily') {
    // ISO 형식이거나 날짜 형식이면 변환
    try {
      let date;
      if (label.includes('-')) {
        date = parseISO(label);
      } else {
        date = new Date(label);
      }
      return format(date, 'yyyy년 M월 d일', { locale: ko });
    } catch {
      return label;
    }
  }
  return label;
};

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // 현재 활성화된 기간 타입 가져오기
    const activePeriod = payload[0]?.payload?.activePeriod || 'monthly';

    // 툴팁에 표시할 날짜 형식 포맷팅
    const formattedDate = formatTooltipDate(label, activePeriod);

    // 읽기 상태 순서에 따라 항목 정렬
    const sortedPayload = [...payload].sort(
      (a, b) => STATUS_ORDER[a.name] - STATUS_ORDER[b.name]
    );

    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs text-gray-700">{formattedDate}</p>
        <div className="mt-1 space-y-1">
          {sortedPayload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-xs">
                <span className="text-gray-700">{entry.name}: </span>
                <span>{entry.value}권</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// 커스텀 범례 컴포넌트
const CustomLegend = ({ payload }: any) => {
  if (!payload || payload.length === 0) return null;

  // 읽기 상태 순서에 따라 항목 정렬
  const sortedPayload = [...payload].sort(
    (a, b) => STATUS_ORDER[a.value] - STATUS_ORDER[b.value]
  );

  return (
    <ul className="flex items-center justify-center gap-6 pt-1">
      {sortedPayload.map((entry: any, index: number) => (
        <li key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="h-3 w-3 flex-shrink-0 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-700">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const ReadingStatusByPeriodChart = ({
  userId,
}: ReadingStatusByPeriodChartProps) => {
  const [activePeriod, setActivePeriod] = useState<PeriodType>('monthly');
  const CHART_TITLE = '기간별 독서';

  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === userId;
  const { settings, handleUpdateSetting, isUpdating } = isMyProfile
    ? useStatisticsSettings(userId)
    : { settings: null, handleUpdateSetting: () => {}, isUpdating: false };

  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['readingStatusByPeriod', userId],
    queryFn: () => getReadingStatusByPeriod(userId),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic && !isMyProfile) {
    return (
      <PrivateDataMessage
        message="이 통계는 비공개 설정되어 있습니다."
        title={CHART_TITLE}
      />
    );
  }

  // 공개/비공개 토글 핸들러
  const handlePrivacyToggle = (isPublic: boolean) => {
    handleUpdateSetting('isReadingStatusByPeriodPublic', isPublic);
  };

  // 설정 로딩 중 또는 설정 업데이트 중인지 확인
  const showLoading = isLoading || isUpdating || (isMyProfile && !settings);

  // 선택된 기간의 데이터
  const periodData = data[activePeriod]?.map(item => ({
    ...item,
    activePeriod, // 툴팁에서 기간 타입을 식별하기 위해 추가
  }));

  // 데이터가 완전히 없는 경우
  if (
    !data.yearly?.length &&
    !data.monthly?.length &&
    !data.weekly?.length &&
    !data.daily?.length
  ) {
    return <NoDataMessage title={CHART_TITLE} />;
  }

  // X축 라벨 포맷팅 함수
  const formatXAxisLabel = (label: string) => {
    if (activePeriod === 'yearly') {
      return label; // 년도는 그대로 표시
    } else if (activePeriod === 'monthly') {
      // YYYY-MM 형식을 MM월로 변환
      const [year, month] = label.split('-');
      return format(new Date(Number(year), Number(month) - 1, 1), 'M월', {
        locale: ko,
      });
    } else if (activePeriod === 'weekly') {
      // 주간은 그대로 표시 (n월 m째주 형식)
      return label;
    } else if (activePeriod === 'daily') {
      // 날짜 포맷팅
      try {
        const date = new Date(label);
        return format(date, 'M/d', { locale: ko });
      } catch {
        return label;
      }
    }
    return label;
  };

  // 기간 옵션
  const periodOptions = [
    { id: 'daily', name: '일별' },
    { id: 'weekly', name: '주별' },
    { id: 'monthly', name: '월별' },
    { id: 'yearly', name: '연도별' },
  ];

  // 데이터 키 결정
  const getDataKey = () => {
    switch (activePeriod) {
      case 'yearly':
        return 'year';
      case 'monthly':
        return 'month';
      case 'weekly':
        return 'week';
      case 'daily':
        return 'date';
      default:
        return 'month';
    }
  };

  return (
    <div className="h-[340px] w-full rounded-lg bg-white p-3">
      <div className="mb-2 flex items-start justify-between">
        <div className="min-w-[120px]">
          <h3 className="text-base font-medium text-gray-700">{CHART_TITLE}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {periodOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setActivePeriod(option.id as PeriodType)}
                className={cn(
                  'flex h-7 cursor-pointer items-center rounded-full border px-2 text-xs font-medium transition-colors',
                  activePeriod === option.id
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                )}
              >
                {option.name}
              </button>
            ))}
          </div>
          {isMyProfile && (
            <PrivacyToggle
              isPublic={settings?.isReadingStatusByPeriodPublic || false}
              isLoading={showLoading}
              onToggle={handlePrivacyToggle}
            />
          )}
        </div>
      </div>
      <div className="h-[calc(100%-2.5rem)]">
        {periodData && periodData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={periodData}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey={getDataKey()}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={formatXAxisLabel}
                height={30}
                angle={0}
                textAnchor="middle"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={<CustomLegend />}
                verticalAlign="bottom"
                height={36}
              />
              <Bar
                dataKey="wantToReadCount"
                name={STATUS_LABELS[ReadingStatusType.WANT_TO_READ]}
                stackId="status"
                fill={STATUS_COLORS[ReadingStatusType.WANT_TO_READ]}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="readingCount"
                name={STATUS_LABELS[ReadingStatusType.READING]}
                stackId="status"
                fill={STATUS_COLORS[ReadingStatusType.READING]}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="readCount"
                name={STATUS_LABELS[ReadingStatusType.READ]}
                stackId="status"
                fill={STATUS_COLORS[ReadingStatusType.READ]}
                radius={[0, 0, 0, 0]}
                barSize={
                  activePeriod === 'daily'
                    ? 8
                    : activePeriod === 'weekly'
                      ? 14
                      : 20
                }
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-gray-500">
              {activePeriod === 'daily'
                ? '일별 데이터가 없습니다'
                : activePeriod === 'weekly'
                  ? '주별 데이터가 없습니다'
                  : activePeriod === 'monthly'
                    ? '월별 데이터가 없습니다'
                    : '연도별 데이터가 없습니다'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingStatusByPeriodChart;
