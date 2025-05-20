import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  Area,
  AreaChart,
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

import { LibraryPopularityResponse } from '@/apis/user/types';
import { getLibraryPopularity } from '@/apis/user/user';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { ChartContainer, PrivateDataMessage } from '../components';
import { PrivacyToggle } from '../components/PrivacyToggle';
import { useStatisticsSettings } from '../hooks/useStatisticsSettings';

// 파스텔톤 차트 색상
const CHART_COLORS = [
  '#93c5fd', // blue-300
  '#a7f3d0', // green-200
  '#fcd34d', // amber-300
  '#f9a8d4', // pink-300
  '#c4b5fd', // violet-300
  '#fda4af', // rose-300
  '#a5f3fc', // cyan-200
  '#99f6e4', // teal-200
  '#bef264', // lime-300
  '#fdba74', // orange-300
];

type PeriodType = 'yearly' | 'monthly' | 'weekly' | 'daily';

interface LibraryPopularityChartProps {
  userId?: number;
}

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-gray-800">
          {payload[0].payload.library || label}
        </p>
        <div className="mt-1">
          <p className="text-xs font-semibold text-gray-700">
            {`${payload[0].value}명`}
          </p>
          {payload[0].payload.percent && (
            <p className="text-xs text-gray-500">
              {`전체의 ${(payload[0].payload.percent * 100).toFixed(1)}%`}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// 커스텀 트렌드 툴팁 컴포넌트
const TrendTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-gray-800">{label}</p>
        <div className="mt-1 space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color || entry.stroke }}
              />
              <p className="text-xs">
                <span className="text-gray-700">{entry.name}: </span>
                <span>{entry.value}명</span>
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

  return (
    <div className="flex flex-col justify-center gap-2 pb-1">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const LibraryPopularityChart = ({ userId }: LibraryPopularityChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);
  const [activeTab, setActiveTab] = useState('current');
  const [activePeriod, setActivePeriod] = useState<PeriodType>('monthly');

  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === id;
  const { settings, handleUpdateSetting, isUpdating } = isMyProfile
    ? useStatisticsSettings(id)
    : { settings: null, handleUpdateSetting: () => {}, isUpdating: false };

  const { data, isLoading } = useSuspenseQuery<LibraryPopularityResponse>({
    queryKey: ['libraryPopularity', id],
    queryFn: () => getLibraryPopularity(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic && !isMyProfile) {
    return (
      <PrivateDataMessage
        message="이 통계는 비공개 설정되어 있습니다."
        title="서재 인기도"
      />
    );
  }

  // 구독자 데이터 준비 - 없는 경우 기본 데이터 설정
  const subscribersData = data.subscribersPerLibrary || [];

  // 서재 데이터가 없는 경우 기본 데이터 생성
  const hasSubscriberData = subscribersData.length > 0;

  // 기본 데이터 (데이터가 없는 경우 표시할 데이터)
  const defaultSubscribersData = !hasSubscriberData
    ? [{ library: '서재 데이터 없음', subscribers: 1 }]
    : [];

  // 서재별 구독자 데이터 가공 (상위 10개만)
  const sortedSubscribersData = [...subscribersData, ...defaultSubscribersData]
    .sort((a, b) => b.subscribers - a.subscribers)
    .slice(0, 10);

  // 총 구독자 수 계산
  const totalSubscribers = sortedSubscribersData.reduce(
    (sum, item) => sum + item.subscribers,
    0
  );

  // 구독자가 모두 0인지 확인
  const allSubscribersZero = totalSubscribers === 0;

  // 파이 차트용 데이터 가공
  const pieChartData = sortedSubscribersData
    .slice(0, 5) // 상위 5개만 표시
    .map((item, index) => ({
      ...item,
      // 모든 값이 0인 경우 시각화를 위해 임의의 값(1) 설정
      displayValue: allSubscribersZero ? 1 : item.subscribers,
      color: CHART_COLORS[index % CHART_COLORS.length],
      percent: allSubscribersZero
        ? 1 / sortedSubscribersData.length
        : item.subscribers / totalSubscribers,
    }));

  // 커스텀 라벨 렌더링 함수
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null; // 5% 미만은 라벨 생략

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#4b5563" // text-gray-600
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight="medium"
        stroke="#ffffff" // 텍스트 테두리 추가
        strokeWidth={0.5} // 얇은 테두리
        paintOrder="stroke" // 테두리 렌더링 순서
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // 트렌드 차트 데이터 준비
  const getTrendData = () => {
    switch (activePeriod) {
      case 'yearly':
        return data.yearly || [];
      case 'monthly':
        return data.monthly || [];
      case 'weekly':
        return data.weekly || [];
      case 'daily':
        return data.daily || [];
      default:
        return data.monthly || [];
    }
  };

  // 기간별 데이터 가져오기
  const periodData = getTrendData();
  const hasTrendData = periodData.length > 0;

  // 트렌드 데이터 가공
  const trendChartData = hasTrendData
    ? periodData.map(
        (item: {
          year?: string;
          month?: string;
          week?: string;
          date?: string;
          libraries: Array<{ library: string; subscribers: number }>;
        }) => {
          // 각 기간별 상위 4개 서재만 표시
          const topLibraries = item.libraries.slice(0, 4);

          // x축 표시 값 지정
          const xValue =
            'year' in item
              ? item.year
              : 'month' in item
                ? item.month
                : 'week' in item
                  ? item.week
                  : 'date' in item
                    ? item.date
                    : '';

          // 기본 데이터 객체 생성
          const dataObj: Record<string, any> = {
            date: xValue,
          };

          // 각 서재별 구독자 수 추가
          topLibraries.forEach(lib => {
            dataObj[lib.library] = lib.subscribers;
          });

          return dataObj;
        }
      )
    : [];

  // X축 레이블 포맷팅
  const formatXAxisLabel = (label: string) => {
    if (activePeriod === 'yearly') {
      return label;
    } else if (activePeriod === 'monthly') {
      const [_, month] = label.split('-');
      return `${parseInt(month)}월`;
    } else if (activePeriod === 'weekly') {
      const [_, week] = label.split('-W');
      return `${week}주`;
    } else if (activePeriod === 'daily') {
      const [_, month, day] = label.split('-');
      return `${parseInt(month)}/${parseInt(day)}`;
    }
    return label;
  };

  // 공개/비공개 토글 핸들러
  const handlePrivacyToggle = (isPublic: boolean) => {
    handleUpdateSetting('isLibraryPopularityPublic', isPublic);
  };

  // 설정 로딩 중 또는 설정 업데이트 중인지 확인
  const showLoading = isLoading || isUpdating || (isMyProfile && !settings);

  // 기간 옵션
  const periodOptions = [
    { id: 'daily' as PeriodType, name: '일별' },
    { id: 'weekly' as PeriodType, name: '주별' },
    { id: 'monthly' as PeriodType, name: '월별' },
    { id: 'yearly' as PeriodType, name: '연도별' },
  ];

  return (
    <ChartContainer>
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:min-w-[120px]">
          <h3 className="text-base font-medium text-gray-700">서재 인기도</h3>
          {isMyProfile && (
            <div className="sm:hidden">
              <PrivacyToggle
                isPublic={settings?.isLibraryPopularityPublic || false}
                isLoading={showLoading}
                onToggle={handlePrivacyToggle}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('current')}
                className={cn(
                  'flex h-7 cursor-pointer items-center rounded-full border px-2 text-xs font-medium transition-colors',
                  activeTab === 'current'
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                )}
              >
                현재 구독자
              </button>
              <button
                onClick={() => setActiveTab('trend')}
                className={cn(
                  'flex h-7 cursor-pointer items-center rounded-full border px-2 text-xs font-medium transition-colors',
                  activeTab === 'trend'
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                )}
              >
                추세
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            {activeTab === 'trend' && (
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
            {isMyProfile && (
              <div className="hidden sm:block">
                <PrivacyToggle
                  isPublic={settings?.isLibraryPopularityPublic || false}
                  isLoading={showLoading}
                  onToggle={handlePrivacyToggle}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-[320px]">
        {activeTab === 'current' ? (
          <div className="h-full pt-2">
            {hasSubscriberData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ left: -20 }}>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="displayValue"
                    nameKey="library"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#fff"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    content={<CustomLegend />}
                    wrapperStyle={{ right: 30 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-500">
                  구독자 데이터가 없습니다
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full pt-2">
            {hasTrendData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendChartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={formatXAxisLabel}
                    height={25}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={value => value}
                  />
                  <Tooltip content={<TrendTooltip />} />
                  <Legend content={<CustomLegend />} />
                  {trendChartData.length > 0 &&
                    Object.keys(trendChartData[0])
                      .filter(key => key !== 'date')
                      .slice(0, 4)
                      .map((key, index) => (
                        <Area
                          key={key}
                          type="monotone"
                          dataKey={key}
                          name={key}
                          stackId="1"
                          stroke={CHART_COLORS[index % CHART_COLORS.length]}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                          fillOpacity={0.5}
                        />
                      ))}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-500">
                  구독자 추세 데이터가 없습니다
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

export default LibraryPopularityChart;
