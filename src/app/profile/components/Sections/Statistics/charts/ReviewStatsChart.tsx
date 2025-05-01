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
import { NoDataMessage, PrivateDataMessage } from '../common';

interface ReviewStatsChartProps {
  userId: number;
}

type ChartType = 'monthly' | 'types';

// 리뷰 유형별 파스텔톤 색상
const REVIEW_TYPE_COLORS = {
  general: '#93c5fd', // blue-300
  discussion: '#a7f3d0', // green-200
  review: '#fcd34d', // amber-300
  question: '#f9a8d4', // pink-300
  meetup: '#c4b5fd', // violet-300
};

// 커스텀 툴팁 컴포넌트
const CustomMonthlyTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium">{label}</p>
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
  const [activeType, setActiveType] = useState<ChartType>('monthly');
  const CHART_TITLE = '리뷰 통계';

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
    ((!data.monthlyReviewCounts || data.monthlyReviewCounts.length === 0) &&
      (!data.reviewTypeDistribution ||
        data.reviewTypeDistribution.length === 0))
  ) {
    return <NoDataMessage title={CHART_TITLE} />;
  }

  // 리뷰 유형 이름 매핑
  const reviewTypeNames = {
    general: '일반',
    discussion: '토론',
    review: '리뷰',
    question: '질문',
    meetup: '모임',
  };

  // 리뷰 유형 분포 데이터 가공
  const distributionData = data.reviewTypeDistribution.map(item => ({
    name:
      reviewTypeNames[item.type as keyof typeof reviewTypeNames] || item.type,
    value: item.percentage,
    color:
      REVIEW_TYPE_COLORS[item.type as keyof typeof REVIEW_TYPE_COLORS] ||
      '#6b7280',
  }));

  // 월별 리뷰 데이터 가공 (최대 6개월 표시)
  const monthlyData = (data.monthlyReviewCounts || [])
    .slice(-6) // 최근 6개월만 표시
    .map(item => ({
      month: item.month,
      count: item.count,
    }));

  // 차트 타입 옵션
  const chartTypeOptions = [
    { id: 'monthly' as ChartType, name: '월별 리뷰' },
    { id: 'types' as ChartType, name: '리뷰 유형' },
  ];

  return (
    <div className="h-[270px] w-full rounded-lg bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">{CHART_TITLE}</h3>
          <p className="text-xs text-gray-500">
            총 {data.totalReviews}개
            {data.averageReviewLength > 0 &&
              ` | 평균 ${data.averageReviewLength.toFixed(0)}자`}
          </p>
        </div>
        <div className="flex gap-1">
          {chartTypeOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setActiveType(option.id)}
              className={cn(
                'flex h-7 cursor-pointer items-center rounded-full border px-2.5 text-[11px] font-medium transition-colors',
                activeType === option.id
                  ? 'border-blue-200 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              )}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[calc(100%-3rem)]">
        {activeType === 'monthly' ? (
          monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 15 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomMonthlyTooltip />} />
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
                월별 리뷰 데이터가 없습니다
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
                outerRadius={70}
                paddingAngle={2}
                fill="#8884d8"
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) =>
                  percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                }
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
                iconSize={8}
                iconType="circle"
                formatter={value => (
                  <span className="text-[10px] text-gray-600">{value}</span>
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
