import { useSuspenseQuery } from '@tanstack/react-query';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { ReadingStatusType } from '@/apis/reading-status/types';
import { getReadingStatusStats } from '@/apis/user/user';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import {
  NoDataMessage,
  PrivacyToggle,
  PrivateDataMessage,
} from '../components';
import { useStatisticsSettings } from '../hooks/useStatisticsSettings';

interface ReadingStatusChartProps {
  userId: number;
}

// 읽기 상태별 컬러 매핑 (파스텔톤으로 변경)
const STATUS_COLORS = {
  [ReadingStatusType.READ]: '#86efac', // green-300 (파스텔)
  [ReadingStatusType.READING]: '#93c5fd', // blue-300 (파스텔)
  [ReadingStatusType.WANT_TO_READ]: '#c4b5fd', // violet-300 (파스텔)
};

// 읽기 상태별 표시 이름 (BookDialog와 일치시킴)
const STATUS_LABELS = {
  [ReadingStatusType.READ]: '읽었어요',
  [ReadingStatusType.READING]: '읽는 중',
  [ReadingStatusType.WANT_TO_READ]: '읽고 싶어요',
};

// 차트 데이터 타입
interface ChartData {
  name: string;
  value: number;
  statusType: ReadingStatusType;
  color: string;
  total: number;
}

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartData;
    const status = data.statusType;

    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <div className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: STATUS_COLORS[status] }}
          />
          <p className="text-xs font-medium">{STATUS_LABELS[status]}</p>
        </div>
        <p className="mt-1 text-xs font-semibold">
          {data.value}권 ({((data.value / data.total) * 100).toFixed(0)}%)
        </p>
      </div>
    );
  }
  return null;
};

const ReadingStatusChart = ({ userId }: ReadingStatusChartProps) => {
  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === userId;
  const { settings, handleUpdateSetting, isUpdating } = isMyProfile
    ? useStatisticsSettings(userId)
    : { settings: null, handleUpdateSetting: () => {}, isUpdating: false };

  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['readingStatusStats', userId],
    queryFn: () => getReadingStatusStats(userId),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic && !isMyProfile) {
    return (
      <PrivateDataMessage
        message="이 통계는 비공개 설정되어 있습니다."
        title="독서 상태별 도서 수"
      />
    );
  }

  // 데이터가 없는 경우
  const totalBooks = data.readCount + data.readingCount + data.wantToReadCount;
  if (totalBooks === 0) {
    return (
      <NoDataMessage
        title="독서 상태별 도서 수"
        message="독서 활동 데이터가 없습니다."
      />
    );
  }

  // 차트 데이터 준비
  const chartData: ChartData[] = [
    {
      name: STATUS_LABELS[ReadingStatusType.READ],
      value: data.readCount,
      statusType: ReadingStatusType.READ,
      color: STATUS_COLORS[ReadingStatusType.READ],
      total: totalBooks,
    },
    {
      name: STATUS_LABELS[ReadingStatusType.READING],
      value: data.readingCount,
      statusType: ReadingStatusType.READING,
      color: STATUS_COLORS[ReadingStatusType.READING],
      total: totalBooks,
    },
    {
      name: STATUS_LABELS[ReadingStatusType.WANT_TO_READ],
      value: data.wantToReadCount,
      statusType: ReadingStatusType.WANT_TO_READ,
      color: STATUS_COLORS[ReadingStatusType.WANT_TO_READ],
      total: totalBooks,
    },
  ].filter(item => item.value > 0);

  // 작은 라벨 렌더링 함수
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
        fill="#4b5563" // text-gray-600 추가
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11} // 폰트 크기 증가
        fontWeight="medium"
        stroke="#ffffff" // 텍스트 테두리 추가
        strokeWidth={0.5} // 얇은 테두리
        paintOrder="stroke" // 테두리 렌더링 순서
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // 공개/비공개 토글 핸들러
  const handlePrivacyToggle = (isPublic: boolean) => {
    handleUpdateSetting('isReadingStatusPublic', isPublic);
  };

  // 설정 로딩 중 또는 설정 업데이트 중인지 확인
  const showLoading = isLoading || isUpdating || (isMyProfile && !settings);

  return (
    <div className="min-h-[400px] w-full rounded-lg bg-white p-3">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-base font-medium text-gray-700">
          독서 상태별 도서 수
        </h3>
        {isMyProfile && (
          <PrivacyToggle
            isPublic={settings?.isReadingStatusPublic || false}
            isLoading={showLoading}
            onToggle={handlePrivacyToggle}
          />
        )}
      </div>
      <div className="flex h-[320px] flex-col items-center sm:flex-row">
        <div className="h-[65%] w-full sm:h-full sm:w-3/5">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={75}
                innerRadius={35}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="white"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex h-[35%] w-full flex-col justify-center sm:h-full sm:w-2/5">
          <ul className="space-y-2.5">
            {chartData.map((entry, index) => (
              <li key={`legend-${index}`} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="flex-1 text-xs">
                  <span className="text-gray-700">{entry.name}: </span>
                  <span>{entry.value}권</span>
                </div>
              </li>
            ))}
          </ul>
          {data.completionRate > 0 && (
            <div className="mt-4 rounded-md bg-gray-50 px-2 py-1.5">
              <p className="text-center text-sm font-medium text-gray-600">
                완독률:{' '}
                <span className="text-green-500">
                  {data.completionRate.toFixed(1)}%
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingStatusChart;
