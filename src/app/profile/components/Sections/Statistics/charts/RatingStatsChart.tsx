import { getRatingStats } from '@/apis/user/user';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BarChart3, Star } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  NoDataMessage,
  PrivateDataMessage,
} from '../components';
import { PrivacyToggle } from '../components/PrivacyToggle';
import { useStatisticsSettings } from '../hooks/useStatisticsSettings';

interface RatingStatsChartProps {
  userId: number;
}

// 차트 색상 정의 (노란색 계열)
const CHART_COLORS = {
  distribution: '#fcd34d', // amber-300
  categories: '#fcd34d', // Using the same amber-300 color
  monthly: '#fcd34d', // Using the same amber-300 color
};

// 날짜 포맷팅 함수: YYYY-MM -> YYYY년 M월
const formatMonth = (monthStr: string): string => {
  try {
    if (!monthStr || !monthStr.includes('-')) return monthStr;

    const [year, month] = monthStr.split('-');
    return format(new Date(Number(year), Number(month) - 1, 1), 'yyyy년 M월', {
      locale: ko,
    });
  } catch {
    return monthStr;
  }
};

type TabType = 'distribution' | 'categories' | 'monthly';

// 분포 차트용 커스텀 툴팁
const DistributionTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs text-gray-700">{label}점</p>
        <div className="mt-1 flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: CHART_COLORS.distribution }}
          />
          <p className="text-xs">
            <span>{payload[0].value}개</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// 카테고리 차트용 커스텀 툴팁
const CategoryTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-gray-700">
          {payload[0].payload.category}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: CHART_COLORS.categories }}
          />
          <p className="text-xs">{Number(payload[0].value).toFixed(1)}점</p>
        </div>
      </div>
    );
  }
  return null;
};

// 월별 추이 차트용 커스텀 툴팁
const MonthlyTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const formattedMonth = formatMonth(label);

    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-gray-700">{formattedMonth}</p>
        <div className="mt-1 flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: CHART_COLORS.monthly }}
          />
          <p className="text-xs">{Number(payload[0].value).toFixed(1)}점</p>
        </div>
      </div>
    );
  }
  return null;
};

// 커스텀 범례 컴포넌트
const CustomLegend = ({ payload }: any) => {
  if (!payload || payload.length === 0) return null;

  // 범례를 표시하지 않음
  return null;
};

const RatingStatsChart = ({ userId }: RatingStatsChartProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('distribution');
  const CHART_TITLE = '평점';

  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === userId;
  const { settings, handleUpdateSetting, isUpdating } = isMyProfile
    ? useStatisticsSettings(userId)
    : { settings: null, handleUpdateSetting: () => {}, isUpdating: false };

  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['ratingStats', userId],
    queryFn: () => getRatingStats(userId),
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
    handleUpdateSetting('isRatingStatsPublic', isPublic);
  };

  // 설정 로딩 중 또는 설정 업데이트 중인지 확인
  const showLoading = isLoading || isUpdating || (isMyProfile && !settings);

  // 데이터가 없는 경우
  if (
    (!data.ratingDistribution || data.ratingDistribution.length === 0) &&
    (!data.categoryRatings || data.categoryRatings.length === 0) &&
    (!data.monthlyAverageRatings || data.monthlyAverageRatings.length === 0)
  ) {
    return <NoDataMessage title={CHART_TITLE} />;
  }

  // 평점 분포 데이터 전처리 (빈 평점 채우기)
  const fullRatingDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = i + 1;
    const existingData = data.ratingDistribution.find(
      item => item.rating === rating
    );
    return existingData ? existingData : { rating, count: 0 };
  });

  // 카테고리 평점 상위 표시
  const sortedCategoryRatings = [...data.categoryRatings]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 8);

  // 월별 데이터 처리 (X축 포맷팅을 위한 추가 작업)
  const formattedMonthlyData = data.monthlyAverageRatings.map(item => ({
    ...item,
    formattedMonth: formatMonth(item.month),
  }));

  // 탭 옵션
  const tabOptions = [
    { id: 'distribution' as TabType, name: '평점 분포' },
    { id: 'categories' as TabType, name: '카테고리별' },
    { id: 'monthly' as TabType, name: '월별 추이' },
  ];

  return (
    <ChartContainer className="h-[340px]">
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:min-w-[120px]">
          <div>
            <h3 className="text-base font-medium text-gray-700">
              {CHART_TITLE}
            </h3>
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              평균 {data.averageRating.toFixed(1)}점
            </p>
          </div>
          {isMyProfile && (
            <div className="sm:hidden">
              <PrivacyToggle
                isPublic={settings?.isRatingStatsPublic || false}
                isLoading={showLoading}
                onToggle={handlePrivacyToggle}
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-start gap-2 sm:justify-end">
          <div className="flex gap-1">
            {tabOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setActiveTab(option.id)}
                className={cn(
                  'flex h-7 cursor-pointer items-center rounded-full border px-2 text-xs font-medium transition-colors',
                  activeTab === option.id
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                )}
              >
                {option.name}
              </button>
            ))}
          </div>
          {isMyProfile && (
            <div className="hidden sm:block">
              <PrivacyToggle
                isPublic={settings?.isRatingStatsPublic || false}
                isLoading={showLoading}
                onToggle={handlePrivacyToggle}
              />
            </div>
          )}
        </div>
      </div>

      <div className="h-[320px]">
        {activeTab === 'distribution' ? (
          fullRatingDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={fullRatingDistribution}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="rating"
                  tickFormatter={rating => `${rating}점`}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tick={{ fontSize: 11 }}
                  height={20}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                  allowDecimals={false}
                />
                <Tooltip content={<DistributionTooltip />} />
                <Legend
                  content={<CustomLegend />}
                  verticalAlign="bottom"
                  height={0}
                />
                <Bar
                  dataKey="count"
                  name=""
                  fill={CHART_COLORS.distribution}
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                  <BarChart3 className="h-10 w-10 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  평점 분포 데이터가 없습니다
                </p>
              </div>
            </div>
          )
        ) : activeTab === 'categories' ? (
          sortedCategoryRatings.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedCategoryRatings}
                layout="vertical"
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  type="number"
                  domain={[0, 5]}
                  tickCount={6}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tick={{ fontSize: 11 }}
                  height={20}
                />
                <YAxis
                  type="category"
                  width={70}
                  dataKey="category"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CategoryTooltip />} />
                <Legend
                  content={<CustomLegend />}
                  verticalAlign="bottom"
                  height={0}
                />
                <Bar
                  dataKey="averageRating"
                  name=""
                  fill={CHART_COLORS.categories}
                  barSize={18}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                  <BarChart3 className="h-10 w-10 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  카테고리별 평점 데이터가 없습니다
                </p>
              </div>
            </div>
          )
        ) : formattedMonthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedMonthlyData}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="month"
                tickFormatter={month => {
                  // YYYY-MM 형식에서 MM 부분만 추출하여 M월 형태로 표시
                  if (month && month.includes('-')) {
                    const [, monthPart] = month.split('-');
                    return `${Number(monthPart)}월`;
                  }
                  return month;
                }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tick={{ fontSize: 11 }}
                height={20}
              />
              <YAxis
                domain={[0, 5]}
                tickCount={6}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip content={<MonthlyTooltip />} />
              <Legend
                content={<CustomLegend />}
                verticalAlign="bottom"
                height={0}
              />
              <Line
                type="monotone"
                dataKey="averageRating"
                name=""
                stroke={CHART_COLORS.monthly}
                strokeWidth={2}
                dot={{ r: 3, fill: CHART_COLORS.monthly }}
                activeDot={{ r: 6, fill: CHART_COLORS.monthly }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                <BarChart3 className="h-10 w-10 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                월별 평점 데이터가 없습니다
              </p>
            </div>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

export default RatingStatsChart;
