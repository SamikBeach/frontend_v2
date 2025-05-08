import { getFollowerStats } from '@/apis/user/user';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { NoDataMessage, PrivateDataMessage } from '../components';
import { PrivacyToggle } from '../components/PrivacyToggle';
import { useStatisticsSettings } from '../hooks/useStatisticsSettings';

interface FollowerStatsChartProps {
  userId: number;
}

type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

// 파스텔톤 차트 색상
const PASTEL_COLORS = {
  FOLLOWERS: '#c4b5fd', // violet-300 (파스텔)
  FOLLOWING: '#bef264', // lime-300 (파스텔)
};

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-gray-800">{label}</p>
        <div className="mt-1 space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color || entry.fill }}
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

const FollowerStatsChart = ({ userId }: FollowerStatsChartProps) => {
  const [activePeriod, setActivePeriod] = useState<PeriodType>('monthly');
  const CHART_TITLE = '팔로워';

  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === userId;
  const { settings, handleUpdateSetting, isUpdating } = isMyProfile
    ? useStatisticsSettings(userId)
    : { settings: null, handleUpdateSetting: () => {}, isUpdating: false };

  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['followerStats', userId],
    queryFn: () => getFollowerStats(userId),
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
    handleUpdateSetting('isFollowerStatsPublic', isPublic);
  };

  // 설정 로딩 중 또는 설정 업데이트 중인지 확인
  const showLoading = isLoading || isUpdating || (isMyProfile && !settings);

  // 기간별 데이터 선택
  let chartData = [];
  let dataKey = '';

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
      // 주별 데이터는 단순 사전순 정렬로는 부족함 - 1째주, 2째주 등이 있으므로 별도 처리
      chartData = [...(data.weekly || [])].sort((a, b) => {
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
      chartData = [...(data.daily || [])].sort((a, b) =>
        a.date.localeCompare(b.date)
      );
      dataKey = 'date';
      break;
    default:
      chartData = [...(data.monthly || [])].sort((a, b) =>
        a.month.localeCompare(b.month)
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
  const hasNoFollowers = data.followersCount === 0 && data.followingCount === 0;
  const hasNoGrowthData = !chartData || chartData.length === 0;

  if (hasNoFollowers && hasNoGrowthData) {
    return (
      <NoDataMessage
        title={CHART_TITLE}
        message="팔로워/팔로잉 데이터가 없습니다."
      />
    );
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
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-700">
              {CHART_TITLE}
            </h3>
            <p className="text-xs text-gray-500">
              팔로워: {data.followersCount}명 / 팔로잉: {data.followingCount}명
            </p>
          </div>
          <div className="flex items-center gap-2">
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
            {isMyProfile && (
              <PrivacyToggle
                isPublic={settings?.isFollowerStatsPublic || false}
                isLoading={showLoading}
                onToggle={handlePrivacyToggle}
              />
            )}
          </div>
        </div>

        <div className="h-[calc(100%-2rem)]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
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
                height={25}
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
              <Area
                type="monotone"
                dataKey="followers"
                name="팔로워"
                stroke={PASTEL_COLORS.FOLLOWERS}
                fill={PASTEL_COLORS.FOLLOWERS}
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="following"
                name="팔로잉"
                stroke={PASTEL_COLORS.FOLLOWING}
                fill={PASTEL_COLORS.FOLLOWING}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FollowerStatsChart;
