import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
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

import { LibraryUpdatePatternResponse } from '@/apis/user/types';
import { getLibraryUpdatePattern } from '@/apis/user/user';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  NoDataMessage,
  PrivateDataMessage,
} from '../components';
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
];

// 요일 표시 포맷
const formatDay = (day: string) => {
  const days: Record<string, string> = {
    MONDAY: '월',
    TUESDAY: '화',
    WEDNESDAY: '수',
    THURSDAY: '목',
    FRIDAY: '금',
    SATURDAY: '토',
    SUNDAY: '일',
  };
  return days[day] || day;
};

interface LibraryUpdatePatternChartProps {
  userId?: number;
}

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-gray-800">
          {data.library || formatDay(label) || label}
        </p>
        <div className="mt-1">
          <p className="text-xs font-semibold text-gray-700">
            {`${payload[0].value}${payload[0].name.includes('빈도') ? '회/월' : '회'}`}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// 업데이트 빈도가 0인 경우의 툴팁 컴포넌트
const ZeroFrequencyTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-gray-800">{data.library}</p>
        <div className="mt-1">
          <p className="text-xs font-semibold text-gray-700">0회/월</p>
        </div>
      </div>
    );
  }
  return null;
};

// 커스텀 범례 렌더 컴포넌트
const CustomLegend = ({ payload }: any) => {
  return (
    <ul className="flex flex-col gap-1.5 pl-2">
      {payload.map((entry: any, index: number) => (
        <li key={`legend-${index}`} className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 flex-shrink-0 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="max-w-[120px] truncate text-xs text-gray-700">
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );
};

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

const LibraryUpdatePatternChart = ({
  userId,
}: LibraryUpdatePatternChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);
  const [activeTab, setActiveTab] = useState('frequency');

  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === id;
  const { settings, handleUpdateSetting, isUpdating } = isMyProfile
    ? useStatisticsSettings(id)
    : { settings: null, handleUpdateSetting: () => {}, isUpdating: false };

  const { data, isLoading } = useSuspenseQuery<LibraryUpdatePatternResponse>({
    queryKey: ['libraryUpdatePattern', id],
    queryFn: () => getLibraryUpdatePattern(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic && !isMyProfile) {
    return (
      <PrivateDataMessage
        message="이 통계는 비공개 설정되어 있습니다."
        title="서재 업데이트 패턴"
      />
    );
  }

  // 데이터가 전혀 없는 경우 (배열 자체가 없거나 빈 배열)
  if (
    (!data.updateFrequency || data.updateFrequency.length === 0) &&
    (!data.weekdayActivity || data.weekdayActivity.length === 0)
  ) {
    return (
      <NoDataMessage
        title="서재 업데이트 패턴"
        message="서재 업데이트 패턴 데이터가 없습니다."
      />
    );
  }

  // 총 업데이트 횟수가 0인지 확인
  const totalUpdatesPerMonth = data.updateFrequency.reduce(
    (sum, curr) => sum + curr.updatesPerMonth,
    0
  );

  // 서재 업데이트 빈도 데이터 가공
  const sortedFrequencyData = [...data.updateFrequency]
    .sort((a, b) => b.updatesPerMonth - a.updatesPerMonth)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      // 모든 값이 0인 경우 시각화를 위해 임의의 동일한 값(1)을 설정
      displayValue: totalUpdatesPerMonth === 0 ? 1 : item.updatesPerMonth,
      color: CHART_COLORS[index % CHART_COLORS.length],
      percent:
        totalUpdatesPerMonth > 0
          ? item.updatesPerMonth / totalUpdatesPerMonth
          : 1 / data.updateFrequency.length, // 모든 값이 0인 경우 균등 분배
    }));

  // 요일별 활동 데이터 가공
  const weekdayData = data.weekdayActivity.map((item, index) => ({
    ...item,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  // 공개/비공개 토글 핸들러
  const handlePrivacyToggle = (isPublic: boolean) => {
    handleUpdateSetting('isLibraryUpdatePatternPublic', isPublic);
  };

  // 설정 로딩 중 또는 설정 업데이트 중인지 확인
  const showLoading = isLoading || isUpdating || (isMyProfile && !settings);

  // 요일별 총 활동 수가 0인지 확인
  const totalWeekdayActivity = data.weekdayActivity.reduce(
    (sum, curr) => sum + curr.count,
    0
  );

  return (
    <ChartContainer>
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:min-w-[120px]">
          <h3 className="text-base font-medium text-gray-700">
            서재 업데이트 패턴
          </h3>
          {isMyProfile && (
            <div className="sm:hidden">
              <PrivacyToggle
                isPublic={settings?.isLibraryUpdatePatternPublic || false}
                isLoading={showLoading}
                onToggle={handlePrivacyToggle}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('frequency')}
              className={cn(
                'flex h-7 cursor-pointer items-center rounded-full border px-2 text-xs font-medium transition-colors',
                activeTab === 'frequency'
                  ? 'border-blue-200 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              )}
            >
              업데이트 빈도
            </button>
            <button
              onClick={() => setActiveTab('weekday')}
              className={cn(
                'flex h-7 cursor-pointer items-center rounded-full border px-2 text-xs font-medium transition-colors',
                activeTab === 'weekday'
                  ? 'border-blue-200 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              )}
            >
              요일별 활동
            </button>
          </div>
          {isMyProfile && (
            <div className="hidden sm:block">
              <PrivacyToggle
                isPublic={settings?.isLibraryUpdatePatternPublic || false}
                isLoading={showLoading}
                onToggle={handlePrivacyToggle}
              />
            </div>
          )}
        </div>
      </div>

      <div className="h-[320px]">
        {activeTab === 'frequency' ? (
          <div className="h-full pt-2">
            {sortedFrequencyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sortedFrequencyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="displayValue"
                    nameKey="library"
                  >
                    {sortedFrequencyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#fff"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      totalUpdatesPerMonth === 0 ? (
                        <ZeroFrequencyTooltip />
                      ) : (
                        <CustomTooltip />
                      )
                    }
                  />
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
                  서재 업데이트 빈도 데이터가 없습니다
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full pt-2">
            {weekdayData.length > 0 && totalWeekdayActivity > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weekdayData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={formatDay}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    name="활동 빈도"
                    fill="#93c5fd"
                    radius={[4, 4, 0, 0]}
                  >
                    {weekdayData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-500">
                  요일별 활동 데이터가 없습니다
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

export default LibraryUpdatePatternChart;
