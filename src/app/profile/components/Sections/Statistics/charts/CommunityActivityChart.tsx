import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { CommunityActivityResponse } from '@/apis/user/types';
import { getCommunityActivity } from '@/apis/user/user';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { ChartContainer, PrivateDataMessage } from '../components';
import { PrivacyToggle } from '../components/PrivacyToggle';
import { useStatisticsSettings } from '../hooks/useStatisticsSettings';
import {
  CustomLegendProps,
  CustomTooltipProps,
} from '../utils/chartFormatters';

interface CommunityActivityChartProps {
  userId?: number;
}

type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

// 커뮤니티 활동 데이터 항목 타입
interface CommunityActivityDataItem {
  year?: string;
  month?: string;
  week?: string;
  date?: string;
  general: number;
  discussion: number;
  question: number;
  meetup: number;
  [key: string]: any; // 동적 필드 처리를 위한 인덱스 시그니처
}

// 리뷰 타입별 색상 정의 (리뷰 타입 제외)
const REVIEW_TYPE_COLORS = {
  general: '#93c5fd', // blue-300 (파스텔)
  discussion: '#a7f3d0', // green-200 (파스텔)
  question: '#f9a8d4', // pink-300 (파스텔)
  meetup: '#c4b5fd', // violet-300 (파스텔)
};

// 리뷰 타입별 한글 이름 (리뷰 타입 제외)
const REVIEW_TYPE_NAMES = {
  general: '일반',
  discussion: '토론',
  question: '질문',
  meetup: '모임',
};

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-gray-800">{label}</p>
        <div className="mt-1 space-y-1">
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              <p className="text-xs">
                <span className="text-gray-700">
                  {REVIEW_TYPE_NAMES[
                    entry.dataKey as keyof typeof REVIEW_TYPE_NAMES
                  ] || entry.name}
                  :{' '}
                </span>
                <span>{entry.value}개</span>
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
const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="flex justify-center gap-4 pb-1">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-900">
            {REVIEW_TYPE_NAMES[
              entry.dataKey as keyof typeof REVIEW_TYPE_NAMES
            ] || entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const CommunityActivityChart = ({ userId }: CommunityActivityChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);
  const [activePeriod, setActivePeriod] = useState<PeriodType>('monthly');

  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === id;
  const { settings, handleUpdateSetting, isUpdating } = isMyProfile
    ? useStatisticsSettings(id)
    : { settings: null, handleUpdateSetting: () => {}, isUpdating: false };

  const { data, isLoading } = useSuspenseQuery<CommunityActivityResponse>({
    queryKey: ['communityActivity', id],
    queryFn: () => getCommunityActivity(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic && !isMyProfile) {
    return (
      <PrivateDataMessage
        message="이 통계는 비공개 설정되어 있습니다."
        title="커뮤니티 활동"
      />
    );
  }

  // 공개/비공개 토글 핸들러
  const handlePrivacyToggle = (isPublic: boolean) => {
    handleUpdateSetting('isCommunityActivityPublic', isPublic);
  };

  // 설정 로딩 중 또는 설정 업데이트 중인지 확인
  const showLoading = isLoading || isUpdating || (isMyProfile && !settings);

  // 주어진 기간에 따라 차트 데이터 생성
  const getChartData = () => {
    if (!data) return [];

    // 데이터 배열 선언
    let chartData: CommunityActivityDataItem[] = [];

    // 월 이름과 날짜 이름을 저장할 배열
    const monthNames: string[] = [];
    const dayNames: string[] = [];

    switch (activePeriod) {
      case 'yearly':
        return data.yearly || [];

      case 'monthly':
        // 최근 5개월 데이터 생성
        for (let i = 4; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          monthNames.push(
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          );
        }

        // 서버 데이터에서 해당 월 데이터 찾아서 매핑
        chartData = monthNames.map(monthKey => {
          const monthData = data.monthly.find(item => item.month === monthKey);
          return (
            monthData || {
              month: monthKey,
              general: 0,
              discussion: 0,
              question: 0,
              meetup: 0,
            }
          );
        });
        return chartData;

      case 'weekly':
        return data.weekly || [];

      case 'daily':
        // 최근 5일 데이터 생성
        for (let i = 4; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          dayNames.push(
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
              2,
              '0'
            )}-${String(date.getDate()).padStart(2, '0')}`
          );
        }

        // 서버 데이터에서 해당 일자 데이터 찾아서 매핑
        chartData = dayNames.map(dateKey => {
          const dayData = data.daily.find(item => item.date === dateKey);
          return (
            dayData || {
              date: dateKey,
              general: 0,
              discussion: 0,
              question: 0,
              meetup: 0,
            }
          );
        });
        return chartData;

      default:
        return [];
    }
  };

  // 현재 기간에 따른 X축 데이터 키 결정
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
  const hasNoData = () => {
    const chartData = getChartData();
    return !chartData || chartData.length === 0 || data.totalReviews === 0;
  };

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
          <h3 className="text-base font-medium text-gray-700">커뮤니티 활동</h3>
          {isMyProfile && (
            <div className="sm:hidden">
              <PrivacyToggle
                isPublic={settings?.isCommunityActivityPublic || false}
                isLoading={showLoading}
                onToggle={handlePrivacyToggle}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
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
            <div className="hidden sm:block">
              <PrivacyToggle
                isPublic={settings?.isCommunityActivityPublic || false}
                isLoading={showLoading}
                onToggle={handlePrivacyToggle}
              />
            </div>
          )}
        </div>
      </div>

      <div className="h-[320px]">
        {hasNoData() ? (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-sm text-gray-500">데이터가 없습니다</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getChartData()}
              margin={{ top: 10, right: 10, left: -15, bottom: 10 }}
              barGap={0}
              barCategoryGap="20%"
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
                tickFormatter={formatXAxisLabel}
                height={25}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => value}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={<CustomLegend />}
                wrapperStyle={{ paddingTop: '10px' }}
              />
              <Bar
                dataKey="general"
                name="일반"
                stackId="a"
                fill={REVIEW_TYPE_COLORS.general}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="discussion"
                name="토론"
                stackId="a"
                fill={REVIEW_TYPE_COLORS.discussion}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="question"
                name="질문"
                stackId="a"
                fill={REVIEW_TYPE_COLORS.question}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="meetup"
                name="모임"
                stackId="a"
                fill={REVIEW_TYPE_COLORS.meetup}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartContainer>
  );
};

export default CommunityActivityChart;
