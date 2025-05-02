import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
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

import { CommunityActivityResponse } from '@/apis/user/types';
import { getCommunityActivity } from '@/apis/user/user';
import { cn } from '@/lib/utils';
import { NoDataMessage, PrivateDataMessage } from '../components';
import {
  CustomLegendProps,
  CustomTooltipProps,
} from '../utils/chartFormatters';

interface CommunityActivityChartProps {
  userId?: number;
}

type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

// 커뮤니티 활동 데이터 항목 타입
interface CommunityActivityDataItem {
  year?: string;
  month?: string;
  week?: string;
  date?: string;
  general: number;
  discussion: number;
  question: number;
  meetup: number;
  [key: string]: any; // 동적 필드 처리를 위한 인덱스 시그니처
}

// API 응답 확장 타입
interface ExtendedCommunityActivityResponse extends CommunityActivityResponse {
  yearly?: CommunityActivityDataItem[];
  monthly?: CommunityActivityDataItem[];
  weekly?: CommunityActivityDataItem[];
  daily?: CommunityActivityDataItem[];
}

// 리뷰 타입별 색상 정의 (리뷰 타입 제외)
const REVIEW_TYPE_COLORS = {
  general: '#93c5fd', // blue-300 (파스텔)
  discussion: '#a7f3d0', // green-200 (파스텔)
  question: '#f9a8d4', // pink-300 (파스텔)
  meetup: '#c4b5fd', // violet-300 (파스텔)
};

// 리뷰 타입별 한글 이름 (리뷰 타입 제외)
const REVIEW_TYPE_NAMES = {
  general: '일반',
  discussion: '토론',
  question: '질문',
  meetup: '모임',
};

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-gray-800">{label}</p>
        <div className="mt-1 space-y-1">
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              <p className="text-xs">
                <span className="text-gray-700">
                  {REVIEW_TYPE_NAMES[
                    entry.dataKey as keyof typeof REVIEW_TYPE_NAMES
                  ] || entry.name}
                  :{' '}
                </span>
                <span>{entry.value}개</span>
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
const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="flex justify-center gap-4 pb-1">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-900">
            {REVIEW_TYPE_NAMES[
              entry.dataKey as keyof typeof REVIEW_TYPE_NAMES
            ] || entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const CommunityActivityChart = ({ userId }: CommunityActivityChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);
  const [activePeriod, setActivePeriod] = useState<PeriodType>('monthly');

  const { data } = useSuspenseQuery<ExtendedCommunityActivityResponse>({
    queryKey: ['communityActivity', id],
    queryFn: () => getCommunityActivity(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return (
      <PrivateDataMessage
        message="이 통계는 비공개 설정되어 있습니다."
        title="커뮤니티 활동"
      />
    );
  }

  // 기간별 데이터 선택
  let chartData: CommunityActivityDataItem[] = [];
  let dataKey = '';

  switch (activePeriod) {
    case 'yearly':
      chartData = [...(data.yearly || [])].sort(
        (a, b) => a.year?.localeCompare(b.year || '') || 0
      );
      dataKey = 'year';
      break;
    case 'monthly':
      chartData = [...(data.monthly || [])].sort(
        (a, b) => a.month?.localeCompare(b.month || '') || 0
      );
      dataKey = 'month';
      break;
    case 'weekly':
      // 주별 데이터 정렬 (n월 m째주 형식)
      chartData = [...(data.weekly || [])].sort((a, b) => {
        if (!a.week || !b.week) return 0;

        // 월이 다르면 월로 비교
        const aMonth = parseInt(a.week.split('월')[0]);
        const bMonth = parseInt(b.week.split('월')[0]);
        if (aMonth !== bMonth) return aMonth - bMonth;

        // 월이 같으면 주차로 비교
        const aWeek = parseInt(a.week.split('째주')[0].split('월 ')[1]);
        const bWeek = parseInt(b.week.split('째주')[0].split('월 ')[1]);
        return aWeek - bWeek;
      });
      dataKey = 'week';
      break;
    case 'daily':
      chartData = [...(data.daily || [])].sort(
        (a, b) => a.date?.localeCompare(b.date || '') || 0
      );
      dataKey = 'date';
      break;
    default:
      chartData = [...(data.monthly || [])].sort(
        (a, b) => a.month?.localeCompare(b.month || '') || 0
      );
      dataKey = 'month';
  }

  // X축 레이블 포맷터
  const formatXAxisLabel = (label: string) => {
    if (activePeriod === 'yearly') {
      return label;
    } else if (activePeriod === 'monthly') {
      const [_, month] = label.split('-');
      return `${parseInt(month)}월`;
    } else if (activePeriod === 'weekly') {
      return label;
    } else if (activePeriod === 'daily') {
      const [_, month, day] = label.split('-');
      return `${parseInt(month)}/${parseInt(day)}`;
    }
    return label;
  };

  // 데이터가 없는 경우
  const hasNoData =
    !chartData || chartData.length === 0 || data.totalReviews === 0;

  if (hasNoData) {
    return <NoDataMessage message="커뮤니티 활동 데이터가 없습니다." />;
  }

  // 기간 옵션
  const periodOptions = [
    { id: 'daily' as PeriodType, name: '일별' },
    { id: 'weekly' as PeriodType, name: '주별' },
    { id: 'monthly' as PeriodType, name: '월별' },
    { id: 'yearly' as PeriodType, name: '연도별' },
  ];

  return (
    <div className="h-[340px] w-full rounded-lg bg-white p-3">
      <div className="flex h-full flex-col">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-700">
              커뮤니티 활동
            </h3>
            <p className="text-xs text-gray-500">
              활동 수: {data.totalReviews}개
            </p>
          </div>
          <div className="flex gap-1">
            {periodOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setActivePeriod(option.id)}
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
        </div>

        <div className="h-[calc(100%-2rem)]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              barGap={0}
              barSize={8}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey={dataKey}
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
                width={30}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              <Bar
                dataKey="general"
                name="일반"
                stackId="a"
                fill={REVIEW_TYPE_COLORS.general}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="discussion"
                name="토론"
                stackId="a"
                fill={REVIEW_TYPE_COLORS.discussion}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="question"
                name="질문"
                stackId="a"
                fill={REVIEW_TYPE_COLORS.question}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="meetup"
                name="모임"
                stackId="a"
                fill={REVIEW_TYPE_COLORS.meetup}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CommunityActivityChart;
