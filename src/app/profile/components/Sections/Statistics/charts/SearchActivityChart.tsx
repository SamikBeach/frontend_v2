import { useSuspenseQuery } from '@tanstack/react-query';
import { BarChart3, Search } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { SearchActivityResponse } from '@/apis/user/types';
import { getSearchActivity } from '@/apis/user/user';
import { cn } from '@/lib/utils';
import { NoDataMessage, PrivateDataMessage } from '../components';

interface SearchActivityChartProps {
  userId?: number;
}

type PeriodType = 'keywords' | 'daily' | 'weekly' | 'monthly' | 'yearly';

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-gray-800">{label}</p>
        <div className="mt-1">
          <p className="text-xs font-semibold text-gray-700">
            {`${payload[0].value}회`}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// 키워드 툴팁 컴포넌트
const KeywordTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-gray-800">
          {payload[0].payload.term}
        </p>
        <div className="mt-1">
          <p className="text-xs font-semibold text-gray-700">
            {`${payload[0].value}회 검색됨`}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const SearchActivityChart = ({ userId }: SearchActivityChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);
  const [activePeriod, setActivePeriod] = useState<PeriodType>('keywords');
  const CHART_TITLE = '검색 활동';

  const { data } = useSuspenseQuery<SearchActivityResponse>({
    queryKey: ['searchActivity', id],
    queryFn: () => getSearchActivity(id),
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
    data.searchCount === 0 ||
    ((!data.topSearchTerms || data.topSearchTerms.length === 0) &&
      (!data.yearly || data.yearly.length === 0) &&
      (!data.monthly || data.monthly.length === 0) &&
      (!data.weekly || data.weekly.length === 0) &&
      (!data.daily || data.daily.length === 0))
  ) {
    return <NoDataMessage message="검색 활동 데이터가 없습니다." />;
  }

  // 기간별 데이터 선택
  let chartData = [];
  let dataKey = '';

  if (activePeriod === 'keywords') {
    // 키워드 모드 - 빈도순으로 정렬된 검색어 데이터
    chartData = [...(data.frequentlySearchedTerms || data.topSearchTerms || [])]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // 상위 10개만 표시
  } else {
    // 시간 기반 모드
    switch (activePeriod) {
      case 'yearly':
        chartData = [...(data.yearly || [])].sort((a, b) =>
          a.year.localeCompare(b.year)
        );
        dataKey = 'year';
        break;
      case 'monthly':
        chartData = [...(data.monthly || [])].sort((a, b) =>
          a.month.localeCompare(b.month)
        );
        dataKey = 'month';
        break;
      case 'weekly':
        chartData = [...(data.weekly || [])].sort((a, b) =>
          a.week.localeCompare(b.week)
        );
        dataKey = 'week';
        break;
      case 'daily':
        chartData = [...(data.daily || [])].sort((a, b) =>
          a.date.localeCompare(b.date)
        );
        dataKey = 'date';
        break;
      default:
        // 기본값: 빈도순 키워드
        chartData = [
          ...(data.frequentlySearchedTerms || data.topSearchTerms || []),
        ]
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
    }
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

  // 기간 옵션
  const periodOptions = [
    { id: 'keywords' as PeriodType, name: '키워드' },
    { id: 'daily' as PeriodType, name: '일별' },
    { id: 'weekly' as PeriodType, name: '주별' },
    { id: 'monthly' as PeriodType, name: '월별' },
    { id: 'yearly' as PeriodType, name: '연도별' },
  ];

  return (
    <div className="h-[340px] w-full overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-transparent px-4 py-3">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-100 p-1.5">
                {activePeriod === 'keywords' ? (
                  <Search className="h-4 w-4 text-blue-600" />
                ) : (
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <h3 className="text-base font-medium text-gray-800">
                {CHART_TITLE}
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="mr-1 h-2 w-2 rounded-full bg-blue-400"></div>
              <p className="text-xs text-gray-500">
                총 {data.searchCount.toLocaleString()}회 검색
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {periodOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setActivePeriod(option.id)}
                  className={cn(
                    'flex h-7 cursor-pointer items-center rounded-full border px-2.5 text-xs font-medium transition-colors',
                    activePeriod === option.id
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  )}
                >
                  {option.name}
                </button>
              ))}
            </div>
            {data.searchPattern && (
              <div className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                <span className="font-medium">검색 패턴:</span>{' '}
                {data.searchPattern}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 px-2 py-3">
          {activePeriod === 'keywords' ? (
            // 키워드 모드 - 바 차트 표시
            <div className="h-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 25, left: 70, bottom: 5 }}
                    barSize={16}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      opacity={0.3}
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <YAxis
                      dataKey="term"
                      type="category"
                      width={70}
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<KeywordTooltip />}
                      cursor={{ fill: '#f3f4f6' }}
                    />
                    <Bar
                      dataKey="count"
                      name="검색 횟수"
                      radius={[0, 4, 4, 0]}
                      fill="#93c5fd"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400">검색어 데이터가 없습니다</p>
                </div>
              )}
            </div>
          ) : (
            // 시간 기반 모드 - 영역 차트 표시
            <div className="h-full">
              <div className="mb-2 px-2 text-center">
                <p className="text-sm font-medium text-gray-700">
                  {activePeriod === 'daily'
                    ? '일별'
                    : activePeriod === 'weekly'
                      ? '주별'
                      : activePeriod === 'monthly'
                        ? '월별'
                        : '연도별'}{' '}
                  검색 추이
                </p>
              </div>

              <div className="h-[calc(100%-30px)]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorCount"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#93c5fd"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis
                        dataKey={dataKey}
                        tick={{ fontSize: 11 }}
                        tickFormatter={formatXAxisLabel}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={25}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                        name="검색 횟수"
                        activeDot={{
                          r: 6,
                          fill: '#3b82f6',
                          stroke: '#fff',
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-400">
                      {activePeriod} 검색 데이터가 없습니다
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchActivityChart;
