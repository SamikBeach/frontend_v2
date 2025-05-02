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
import { cn } from '@/lib/utils';
import { NoDataMessage, PrivateDataMessage } from '../common';

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
  value,
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

  const { data } = useSuspenseQuery<LibraryUpdatePatternResponse>({
    queryKey: ['libraryUpdatePattern', id],
    queryFn: () => getLibraryUpdatePattern(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return (
      <PrivateDataMessage
        message="이 통계는 비공개 설정되어 있습니다."
        title="서재 업데이트 패턴"
      />
    );
  }

  // 데이터가 없는 경우
  if (
    (!data.updateFrequency || data.updateFrequency.length === 0) &&
    (!data.weekdayActivity || data.weekdayActivity.length === 0)
  ) {
    return <NoDataMessage message="서재 업데이트 패턴 데이터가 없습니다." />;
  }

  // 서재 업데이트 빈도 데이터 가공 (상위 5개만)
  const sortedFrequencyData = [...data.updateFrequency]
    .sort((a, b) => b.updatesPerMonth - a.updatesPerMonth)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      color: CHART_COLORS[index % CHART_COLORS.length],
      percent:
        data.updateFrequency.reduce(
          (sum, curr) => sum + curr.updatesPerMonth,
          0
        ) > 0
          ? item.updatesPerMonth /
            data.updateFrequency.reduce(
              (sum, curr) => sum + curr.updatesPerMonth,
              0
            )
          : 0,
    }));

  // 요일별 활동 데이터 가공
  const weekdayData = data.weekdayActivity.map((item, index) => ({
    ...item,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <div className="h-[340px] w-full rounded-lg bg-white p-2.5">
      <div className="flex h-full flex-col">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              서재 업데이트 패턴
            </h3>
            <p className="text-xs text-gray-500">
              가장 활발한 서재: {data.mostActiveLibrary || '데이터 없음'}
            </p>
          </div>
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
        </div>

        <div className="flex-1">
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
                      outerRadius={90}
                      innerRadius={35}
                      dataKey="updatesPerMonth"
                      nameKey="library"
                      paddingAngle={2}
                    >
                      {sortedFrequencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      content={<CustomLegend />}
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-xs text-gray-400">
                    업데이트 빈도 데이터가 없습니다
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full pt-2">
              {weekdayData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weekdayData}
                    margin={{ top: 5, right: 25, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="day"
                      tickFormatter={formatDay}
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="활동 횟수" radius={[4, 4, 0, 0]}>
                      {weekdayData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-xs text-gray-400">
                    요일별 활동 데이터가 없습니다
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryUpdatePatternChart;
