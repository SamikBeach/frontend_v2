import { UserInteractionResponse } from '@/apis/user/types';
import { getUserInteraction } from '@/apis/user/user';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { NoDataMessage, PrivateDataMessage } from '../components';
import { ChartContainer } from '../components/ChartContainer';
import { PrivacyToggle } from '../components/PrivacyToggle';
import { useStatisticsSettings } from '../hooks/useStatisticsSettings';

// 파스텔톤 차트 색상
const PASTEL_COLORS = {
  LIKES_RECEIVED: '#f9a8d4', // pink-300 (파스텔)
  LIKES_GIVEN: '#fdba74', // orange-300 (파스텔)
  COMMENTS_RECEIVED: '#93c5fd', // blue-300 (파스텔)
  COMMENTS_CREATED: '#a7f3d0', // green-200 (파스텔)
};

interface UserInteractionChartProps {
  userId: number;
}

type PeriodType = 'all' | 'daily' | 'weekly' | 'monthly' | 'yearly';
type DataType = 'likes' | 'comments';

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

const UserInteractionChart = ({ userId }: UserInteractionChartProps) => {
  const [activePeriod, setActivePeriod] = useState<PeriodType>('monthly');
  const [activeDataType, setActiveDataType] = useState<DataType>('likes');
  const CHART_TITLE = '좋아요와 댓글';

  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === userId;
  const { settings, handleUpdateSetting, isUpdating } = isMyProfile
    ? useStatisticsSettings(userId)
    : { settings: null, handleUpdateSetting: () => {}, isUpdating: false };

  const { data, isLoading } = useSuspenseQuery<UserInteractionResponse>({
    queryKey: ['userInteraction', userId],
    queryFn: () => getUserInteraction(userId),
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

  // 데이터가 없는 경우
  if (
    data.totalLikesReceived === 0 &&
    data.totalCommentsReceived === 0 &&
    data.totalLikesGiven === 0 &&
    data.totalCommentsCreated === 0
  ) {
    return <NoDataMessage message="상호작용 데이터가 없습니다." />;
  }

  // 공개/비공개 토글 핸들러
  const handlePrivacyToggle = (isPublic: boolean) => {
    handleUpdateSetting('isUserInteractionPublic', isPublic);
  };

  // 설정 로딩 중 또는 설정 업데이트 중인지 확인
  const showLoading = isLoading || isUpdating || (isMyProfile && !settings);

  // 활성 기간과 데이터 타입에 따른 차트 데이터 가져오기
  const getChartData = () => {
    if (activeDataType === 'likes') {
      switch (activePeriod) {
        case 'daily':
          return combineData(
            data.dailyLikesReceived || [],
            data.dailyLikesGiven || [],
            'date'
          );
        case 'weekly':
          return combineData(
            data.weeklyLikesReceived || [],
            data.weeklyLikesGiven || [],
            'week'
          );
        case 'monthly':
          return combineData(
            data.monthlyLikesReceived || [],
            data.monthlyLikesGiven || [],
            'month'
          );
        case 'yearly':
          return combineData(
            data.yearlyLikesReceived || [],
            data.yearlyLikesGiven || [],
            'year'
          );
        case 'all':
          return [
            {
              name: '받은 좋아요',
              value: data.totalLikesReceived,
              fill: PASTEL_COLORS.LIKES_RECEIVED,
            },
            {
              name: '남긴 좋아요',
              value: data.totalLikesGiven,
              fill: PASTEL_COLORS.LIKES_GIVEN,
            },
          ];
        default:
          return combineData(
            data.monthlyLikesReceived || [],
            data.monthlyLikesGiven || [],
            'month'
          );
      }
    } else {
      switch (activePeriod) {
        case 'daily':
          return combineData(
            data.dailyCommentsReceived || [],
            data.dailyCommentsCreated || [],
            'date'
          );
        case 'weekly':
          return combineData(
            data.weeklyCommentsReceived || [],
            data.weeklyCommentsCreated || [],
            'week'
          );
        case 'monthly':
          return combineData(
            data.monthlyCommentsReceived || [],
            data.monthlyCommentsCreated || [],
            'month'
          );
        case 'yearly':
          return combineData(
            data.yearlyCommentsReceived || [],
            data.yearlyCommentsCreated || [],
            'year'
          );
        case 'all':
          return [
            {
              name: '받은 댓글',
              value: data.totalCommentsReceived,
              fill: PASTEL_COLORS.COMMENTS_RECEIVED,
            },
            {
              name: '남긴 댓글',
              value: data.totalCommentsCreated,
              fill: PASTEL_COLORS.COMMENTS_CREATED,
            },
          ];
        default:
          return combineData(
            data.monthlyCommentsReceived || [],
            data.monthlyCommentsCreated || [],
            'month'
          );
      }
    }
  };

  // 두 데이터 세트를 하나로 병합
  const combineData = (
    receivedData: Array<{ count: number; [key: string]: any }>,
    createdData: Array<{ count: number; [key: string]: any }>,
    keyName: string
  ) => {
    const combinedMap = new Map();

    // 받은 데이터 처리
    receivedData.forEach(item => {
      combinedMap.set(item[keyName], {
        [keyName]: item[keyName],
        [activeDataType === 'likes' ? '받은 좋아요' : '받은 댓글']: item.count,
        [activeDataType === 'likes' ? '남긴 좋아요' : '남긴 댓글']: 0,
        activeDataType, // 활성 데이터 타입 추가
      });
    });

    // 생성 데이터 처리
    createdData.forEach(item => {
      if (combinedMap.has(item[keyName])) {
        const existing = combinedMap.get(item[keyName]);
        existing[activeDataType === 'likes' ? '남긴 좋아요' : '남긴 댓글'] =
          item.count;
      } else {
        combinedMap.set(item[keyName], {
          [keyName]: item[keyName],
          [activeDataType === 'likes' ? '받은 좋아요' : '받은 댓글']: 0,
          [activeDataType === 'likes' ? '남긴 좋아요' : '남긴 댓글']:
            item.count,
          activeDataType, // 활성 데이터 타입 추가
        });
      }
    });

    // 객체 배열로 변환하고 날짜순 정렬
    return Array.from(combinedMap.values()).sort((a, b) => {
      return a[keyName] < b[keyName] ? -1 : 1;
    });
  };

  // 데이터 키 결정
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
      case 'all':
        return 'name';
      default:
        return 'month';
    }
  };

  // X축 라벨 포맷팅 함수
  const formatXAxisLabel = (label: string) => {
    if (activePeriod === 'yearly') {
      return label; // 년도는 그대로 표시
    } else if (activePeriod === 'monthly') {
      // YYYY-MM 형식을 MM월로 변환
      const [_, month] = label.split('-');
      return `${Number(month)}월`;
    } else if (activePeriod === 'weekly') {
      // 주간은 그대로 표시 (n월 m째주 형식)
      return label;
    } else if (activePeriod === 'daily') {
      // 날짜 포맷팅 (YYYY-MM-DD -> MM/DD)
      try {
        const [_, month, day] = label.split('-');
        return `${Number(month)}/${Number(day)}`;
      } catch {
        return label;
      }
    } else if (activePeriod === 'all') {
      return label;
    }
    return label;
  };

  // 기간 옵션
  const periodOptions = [
    { id: 'all' as PeriodType, name: '전체' },
    { id: 'daily' as PeriodType, name: '일별' },
    { id: 'weekly' as PeriodType, name: '주별' },
    { id: 'monthly' as PeriodType, name: '월별' },
    { id: 'yearly' as PeriodType, name: '연도별' },
  ];

  // 데이터 타입 옵션
  const dataTypeOptions = [
    { id: 'likes' as DataType, name: '좋아요', icon: ThumbsUp },
    { id: 'comments' as DataType, name: '댓글', icon: MessageSquare },
  ];

  // 라벨 가져오기
  const getReceivedLabel = () => {
    return activeDataType === 'likes' ? '받은 좋아요' : '받은 댓글';
  };

  const getCreatedLabel = () => {
    return activeDataType === 'likes' ? '남긴 좋아요' : '남긴 댓글';
  };

  // 전체 메뉴 툴팁 컴포넌트
  const AllModeTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
          <p className="text-xs font-medium text-gray-800">
            {payload[0].payload.name}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: payload[0].payload.fill }}
            />
            <p className="text-xs text-gray-700">{`${payload[0].value}개`}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer>
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:min-w-[120px]">
          <h3 className="text-base font-medium text-gray-700">{CHART_TITLE}</h3>
          {isMyProfile && (
            <div className="sm:hidden">
              <PrivacyToggle
                isPublic={settings?.isUserInteractionPublic || false}
                isLoading={showLoading}
                onToggle={handlePrivacyToggle}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex gap-1">
            {dataTypeOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setActiveDataType(option.id)}
                className={cn(
                  'flex h-7 cursor-pointer items-center gap-1 rounded-full border px-2 text-xs font-medium transition-colors',
                  activeDataType === option.id
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                )}
              >
                <option.icon className="h-3 w-3" />
                {option.name}
              </button>
            ))}
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
              <div className="hidden sm:block">
                <PrivacyToggle
                  isPublic={settings?.isUserInteractionPublic || false}
                  isLoading={showLoading}
                  onToggle={handlePrivacyToggle}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-[320px]">
        {activePeriod === 'all' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getChartData()}
              margin={{ top: 10, right: 10, left: -15, bottom: 10 }}
              layout="vertical"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip content={<AllModeTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {getChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={getChartData()}
              margin={{ top: 10, right: 10, left: -15, bottom: 10 }}
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
              <Area
                type="monotone"
                dataKey={getReceivedLabel()}
                name={activeDataType === 'likes' ? '받은 좋아요' : '받은 댓글'}
                stroke={
                  activeDataType === 'likes'
                    ? PASTEL_COLORS.LIKES_RECEIVED
                    : PASTEL_COLORS.COMMENTS_RECEIVED
                }
                fill={
                  activeDataType === 'likes'
                    ? PASTEL_COLORS.LIKES_RECEIVED
                    : PASTEL_COLORS.COMMENTS_RECEIVED
                }
                fillOpacity={0.5}
                strokeWidth={2}
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey={getCreatedLabel()}
                name={activeDataType === 'likes' ? '남긴 좋아요' : '남긴 댓글'}
                stroke={
                  activeDataType === 'likes'
                    ? PASTEL_COLORS.LIKES_GIVEN
                    : PASTEL_COLORS.COMMENTS_CREATED
                }
                fill={
                  activeDataType === 'likes'
                    ? PASTEL_COLORS.LIKES_GIVEN
                    : PASTEL_COLORS.COMMENTS_CREATED
                }
                fillOpacity={0.5}
                strokeWidth={2}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartContainer>
  );
};

export default UserInteractionChart;
