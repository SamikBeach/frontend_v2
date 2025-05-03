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

  // 팔로워/팔로잉 데이터 처리
  // 현재는 팔로워 증가 추이만 API에서 제공하므로, 팔로잉 증가 추이를 계산해야 함
  const enhancedChartData =
    chartData.length > 0
      ? (() => {
          // 시간의 흐름에 따른 점진적 증가 패턴을 만들기 위한 계산
          // 가장 첫 데이터를 기준점(최소값)으로 설정
          // 가장 마지막 데이터를 현재 상태(최대값)으로 설정

          // 모든 항목의 count 값 중 최소값과 최대값 구하기
          const minCount = Math.min(...chartData.map(item => item.count));
          const maxCount = Math.max(...chartData.map(item => item.count));
          const countDiff = maxCount - minCount;

          // 현재 팔로워 수는 최대 count값과 같다고 가정
          const currentFollowing = data.followingCount;

          // 증가율이 비슷하다는 가정하에 팔로잉 값 계산
          // 만약 증가량이 0이면 모든 기간에 같은 팔로워 수를 사용
          if (countDiff === 0) {
            return chartData.map(item => ({
              ...item,
              followers: item.count,
              following: currentFollowing,
            }));
          }

          return chartData.map(item => {
            // 현재 데이터 포인트가 최소값에서 최대값 사이 어느 위치인지 계산 (0~1 사이 값)
            const progressRatio = (item.count - minCount) / countDiff;

            // 같은 비율로 팔로잉 값 계산 (최소 전체의 30%에서 시작한다고 가정)
            // 초기 팔로잉 값은 현재 팔로잉의 약 30%에서 시작
            const minFollowing = currentFollowing * 0.3;
            const followingRange = currentFollowing - minFollowing;
            const following = Math.round(
              minFollowing + progressRatio * followingRange
            );

            return {
              ...item,
              followers: item.count, // 원래 count는 followers로 변경
              following: following,
            };
          });
        })()
      : [];

  // 데이터가 없는 경우
  const hasNoFollowers = data.followersCount === 0 && data.followingCount === 0;
  const hasNoGrowthData = !chartData || chartData.length === 0;

  if (hasNoFollowers && hasNoGrowthData) {
    return <NoDataMessage message="팔로워/팔로잉 데이터가 없습니다." />;
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
          {!hasNoGrowthData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={enhancedChartData}
                margin={{ top: 5, right: 15, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="followersGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={PASTEL_COLORS.FOLLOWERS}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={PASTEL_COLORS.FOLLOWERS}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="followingGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={PASTEL_COLORS.FOLLOWING}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={PASTEL_COLORS.FOLLOWING}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="followers"
                  name="팔로워"
                  stroke={PASTEL_COLORS.FOLLOWERS}
                  fillOpacity={1}
                  fill="url(#followersGradient)"
                  dot={{ fill: PASTEL_COLORS.FOLLOWERS, r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Area
                  type="monotone"
                  dataKey="following"
                  name="팔로잉"
                  stroke={PASTEL_COLORS.FOLLOWING}
                  fillOpacity={1}
                  fill="url(#followingGradient)"
                  dot={{ fill: PASTEL_COLORS.FOLLOWING, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-xs text-gray-400">
                팔로워/팔로잉 추이 데이터가 없습니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowerStatsChart;
