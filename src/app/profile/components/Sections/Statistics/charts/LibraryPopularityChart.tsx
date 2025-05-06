import { useSuspenseQuery } from '@tanstack/react-query';
import { TrendingUp } from 'lucide-react';
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
import { NoDataMessage, PrivateDataMessage } from '../components';
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
    <div className="flex justify-center gap-4 pb-1">
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

          // 데이터 포맷팅
          const result: any = { name: xValue };

          // 각 서재별 데이터 추가
          topLibraries.forEach(
            (lib: { library: string; subscribers: number }, index: number) => {
              result[lib.library] = lib.subscribers;
              result[`${lib.library}Color`] =
                CHART_COLORS[index % CHART_COLORS.length];
            }
          );

          return result;
        }
      )
    : [];

  // 트렌드 데이터가 없는 경우 기본 데이터 생성
  const defaultTrendData = !hasTrendData
    ? [
        { name: '1월', 기본값: 0 },
        { name: '2월', 기본값: 0 },
        { name: '3월', 기본값: 0 },
      ]
    : [];

  // 트렌드 차트의 데이터 키 목록
  const trendChartKeys = hasTrendData
    ? Object.keys(trendChartData[0]).filter(
        key => !key.includes('Color') && key !== 'name'
      )
    : ['기본값'];

  // X축 라벨 포맷팅
  const formatXAxisLabel = (label: string) => {
    if (activePeriod === 'monthly') {
      // YYYY-MM 형식에서 MM만 표시
      return label.split('-')[1] + '월';
    } else if (activePeriod === 'yearly') {
      // YYYY 형식에서 그대로 표시
      return label + '년';
    }
    // weekly와 daily는 그대로 표시
    return label;
  };

  // 기간 옵션 정의
  const periodOptions = [
    { id: 'daily', name: '일별' },
    { id: 'weekly', name: '주별' },
    { id: 'monthly', name: '월별' },
    { id: 'yearly', name: '연도별' },
  ];

  // 공개/비공개 토글 핸들러
  const handlePrivacyToggle = (isPublic: boolean) => {
    handleUpdateSetting('isLibraryPopularityPublic', isPublic);
  };

  // 설정 로딩 중 또는 설정 업데이트 중인지 확인
  const showLoading = isLoading || isUpdating || (isMyProfile && !settings);

  // 특별한 툴팁 컴포넌트 - 값이 0이거나 기본값인 경우
  const ZeroValueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
          <p className="text-xs font-medium text-gray-800">
            {payload[0].payload.library || label}
          </p>
          <div className="mt-1">
            <p className="text-xs font-semibold text-gray-700">0명</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[340px] w-full rounded-lg bg-white p-2.5">
      <div className="flex h-full flex-col">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-700">서재 인기도</h3>
            <p className="text-xs text-gray-500">
              가장 인기 있는 서재: {data.mostPopularLibrary || '데이터 없음'}
            </p>
          </div>
          <div className="flex items-center gap-2">
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
                구독자 추이
              </button>
            </div>
            {isMyProfile && (
              <PrivacyToggle
                isPublic={settings?.isLibraryPopularityPublic || false}
                isLoading={showLoading}
                onToggle={handlePrivacyToggle}
              />
            )}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'current' ? (
            <div className="flex h-full items-center">
              {hasSubscriberData ? (
                <>
                  <div className="h-full w-3/5">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={90}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey={
                            allSubscribersZero ? 'displayValue' : 'subscribers'
                          }
                          nameKey="library"
                          paddingAngle={2}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="white"
                              strokeWidth={1}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={
                            allSubscribersZero ? (
                              <ZeroValueTooltip />
                            ) : (
                              <CustomTooltip />
                            )
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex h-full w-2/5 flex-col justify-center">
                    <ul className="space-y-2.5">
                      {pieChartData.map((entry, index) => (
                        <li
                          key={`legend-${index}`}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="h-3 w-3 flex-shrink-0 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <div className="flex-1 text-xs">
                            <span className="text-gray-700">
                              {entry.library.length > 15
                                ? `${entry.library.substring(0, 15)}...`
                                : entry.library}
                              :{' '}
                            </span>
                            <span>
                              {allSubscribersZero ? '0' : entry.subscribers}명
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <NoDataMessage
                  title="서재 인기도"
                  message="서재 구독자 데이터가 없습니다"
                />
              )}
            </div>
          ) : (
            <div className="h-full">
              <div className="mb-2 flex justify-end gap-1">
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

              <div className="h-[calc(100%-2.5rem)]">
                {hasTrendData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendChartData}
                      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                      <defs>
                        {trendChartKeys.map((key, index) => (
                          <linearGradient
                            key={`gradient-${key}`}
                            id={`gradient-${key}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={
                                CHART_COLORS[index % CHART_COLORS.length]
                              }
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={
                                CHART_COLORS[index % CHART_COLORS.length]
                              }
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickFormatter={formatXAxisLabel}
                        height={30}
                        textAnchor="middle"
                      />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickFormatter={value => Math.floor(value).toString()}
                        allowDecimals={false}
                        interval={0}
                      />
                      <Tooltip content={<TrendTooltip />} />
                      <Legend
                        content={<CustomLegend />}
                        verticalAlign="bottom"
                        height={20}
                      />
                      {trendChartKeys.map((key, index) => (
                        <Area
                          key={`area-${key}`}
                          type="monotone"
                          dataKey={key}
                          name={key}
                          stroke={CHART_COLORS[index % CHART_COLORS.length]}
                          strokeWidth={2}
                          fill={`url(#gradient-${key})`}
                          activeDot={{
                            r: 6,
                            fill: CHART_COLORS[index % CHART_COLORS.length],
                            stroke: '#fff',
                          }}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                        <TrendingUp className="h-10 w-10 text-gray-300" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">
                        구독자 추세 데이터가 없습니다
                      </p>
                    </div>
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

export default LibraryPopularityChart;
