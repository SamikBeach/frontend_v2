import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ReviewStatsResponse } from '@/apis/user/types';
import { getReviewStats } from '@/apis/user/user';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { NoDataMessage, PrivateDataMessage } from '../components';

interface ReviewStatsChartProps {
  userId: number;
}

type ChartType = 'distribution' | 'timeline';
type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

// 리뷰 유형별 파스텔톤 색상
const REVIEW_TYPE_COLORS = {
  '짧은 리뷰 (200자 이하)': '#93c5fd', // blue-300
  '중간 리뷰 (201-1000자)': '#a7f3d0', // green-200
  '긴 리뷰 (1000자 초과)': '#fcd34d', // amber-300
  general: '#93c5fd', // blue-300
  discussion: '#a7f3d0', // green-200
  review: '#fcd34d', // amber-300
  question: '#f9a8d4', // pink-300
  meetup: '#c4b5fd', // violet-300
};

// 날짜 형식 포맷팅 함수
const formatDate = (label: string, periodType: PeriodType): string => {
  if (periodType === 'yearly') {
    return `${label}년`;
  } else if (periodType === 'monthly') {
    // YYYY-MM 형식
    const [year, month] = label.split('-');
    if (year && month) {
      return format(
        new Date(Number(year), Number(month) - 1, 1),
        'yyyy년 M월',
        {
          locale: ko,
        }
      );
    }
    return label;
  } else if (periodType === 'weekly') {
    // 이미 한글 형식이면 그대로 반환
    if (label.includes('월') && label.includes('째주')) {
      return label;
    }
    // 다른 형식이면 주 표시 추가
    return `${label} 주`;
  } else if (periodType === 'daily') {
    // ISO 형식이거나 날짜 형식이면 변환
    try {
      if (label.includes('-')) {
        return format(parseISO(label), 'yyyy년 M월 d일', { locale: ko });
      }
      return format(new Date(label), 'yyyy년 M월 d일', { locale: ko });
    } catch {
      return label;
    }
  }
  return label;
};

// X축 라벨 포맷팅 함수
const formatXAxisLabel = (label: string, periodType: PeriodType): string => {
  if (periodType === 'yearly') {
    return label; // 년도는 그대로 표시
  } else if (periodType === 'monthly') {
    // YYYY-MM 형식을 MM월로 변환
    const [year, month] = label.split('-');
    if (year && month) {
      return format(new Date(Number(year), Number(month) - 1, 1), 'M월', {
        locale: ko,
      });
    }
    return label;
  } else if (periodType === 'weekly') {
    // 주간은 그대로 표시 (n월 m째주 형식)
    return label;
  } else if (periodType === 'daily') {
    // 날짜 포맷팅
    try {
      return format(parseISO(label), 'M/d', { locale: ko });
    } catch {
      return label;
    }
  }
  return label;
};

// 커스텀 툴팁 컴포넌트
const CustomTimelineTooltip = ({ active, payload, label, period }: any) => {
  if (active && payload && payload.length) {
    const formattedDate = formatDate(label, period);

    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium">{formattedDate}</p>
        <div className="mt-1">
          <p className="text-xs">
            <span className="font-medium">리뷰 수: </span>
            <span>{payload[0].value}권</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomTypeTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium">{payload[0].name}</p>
        <div className="mt-1 flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: payload[0].color }}
          />
          <p className="text-xs">
            <span className="font-medium">비율: </span>
            <span>{(payload[0].value * 100).toFixed(1)}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const ReviewStatsChart = ({ userId }: ReviewStatsChartProps) => {
  const [activeType, setActiveType] = useState<ChartType>('timeline');
  const [activePeriod, setActivePeriod] = useState<PeriodType>('monthly');
  const CHART_TITLE = '리뷰';

  const { data } = useSuspenseQuery<ReviewStatsResponse>({
    queryKey: ['reviewStats', userId],
    queryFn: () => getReviewStats(userId),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return (
      <PrivateDataMessage
        message="이 통계는 비공개 설정되어 있습니다."
        title={CHART_TITLE}
      />
    );
  }

  // 데이터가 없는 경우
  if (
    data.totalReviews === 0 ||
    ((!data.monthly || data.monthly.length === 0) &&
      (!data.yearly || data.yearly.length === 0) &&
      (!data.weekly || data.weekly.length === 0) &&
      (!data.daily || data.daily.length === 0) &&
      (!data.reviewTypeDistribution ||
        data.reviewTypeDistribution.length === 0))
  ) {
    return <NoDataMessage title={CHART_TITLE} />;
  }

  // 리뷰 유형 분포 데이터 가공
  const distributionData = data.reviewTypeDistribution.map(item => ({
    name: item.type,
    value: item.percentage / 100, // 백분율을 소수로 변환
    color:
      REVIEW_TYPE_COLORS[item.type as keyof typeof REVIEW_TYPE_COLORS] ||
      '#6b7280',
  }));

  // 선택된 기간에 따른 데이터 결정
  const getTimelineData = () => {
    if (activePeriod === 'yearly' && data.yearly) {
      return data.yearly;
    } else if (activePeriod === 'monthly' && data.monthly) {
      return data.monthly;
    } else if (activePeriod === 'weekly' && data.weekly) {
      return data.weekly;
    } else if (activePeriod === 'daily' && data.daily) {
      return data.daily;
    }
    return [];
  };

  // X축 데이터 키 결정
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

  // 차트 타입 옵션
  const chartTypeOptions = [
    { id: 'timeline' as ChartType, name: '기간별 리뷰' },
    { id: 'distribution' as ChartType, name: '리뷰 유형' },
  ];

  // 기간 옵션
  const periodOptions = [
    { id: 'daily' as PeriodType, name: '일별' },
    { id: 'weekly' as PeriodType, name: '주별' },
    { id: 'monthly' as PeriodType, name: '월별' },
    { id: 'yearly' as PeriodType, name: '연도별' },
  ];

  const timelineData = getTimelineData();

  return (
    <div className="h-[340px] w-full rounded-lg bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="min-w-[120px]">
          <h3 className="text-base font-medium text-gray-700">{CHART_TITLE}</h3>
          <p className="text-xs text-gray-500">
            총 {data.totalReviews}개
            {data.averageReviewLength > 0 &&
              ` | 평균 ${data.averageReviewLength.toFixed(0)}자`}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-end gap-1">
            {chartTypeOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setActiveType(option.id)}
                className={cn(
                  'flex h-7 cursor-pointer items-center rounded-full border px-2 text-xs font-medium transition-colors',
                  activeType === option.id
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                )}
              >
                {option.name}
              </button>
            ))}
          </div>

          {/* Fixed height container for the submenu */}
          <div className="flex h-7 justify-end">
            {activeType === 'timeline' && (
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
            )}
          </div>
        </div>
      </div>

      <div className="h-[calc(100%-3.5rem)]">
        {activeType === 'timeline' ? (
          timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timelineData}
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
                  tickFormatter={label => formatXAxisLabel(label, activePeriod)}
                  height={30}
                  angle={0}
                  textAnchor="middle"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTimelineTooltip period={activePeriod} />}
                />
                <Bar
                  dataKey="count"
                  name="리뷰 수"
                  fill="#93c5fd"
                  radius={[4, 4, 0, 0]}
                  barSize={25}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-400">
                {activePeriod === 'daily'
                  ? '일별'
                  : activePeriod === 'weekly'
                    ? '주별'
                    : activePeriod === 'monthly'
                      ? '월별'
                      : '연도별'}{' '}
                리뷰 데이터가 없습니다
              </p>
            </div>
          )
        ) : distributionData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={65}
                paddingAngle={2}
                fill="#8884d8"
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) =>
                  percent > 0.05 ? (
                    <tspan fill="#000000">{`${name} ${(percent * 100).toFixed(0)}%`}</tspan>
                  ) : (
                    ''
                  )
                }
                fontSize={11}
              >
                {distributionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTypeTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconSize={9}
                iconType="circle"
                formatter={value => (
                  <span className="text-xs font-medium text-black">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-400">리뷰 유형 데이터가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewStatsChart;
