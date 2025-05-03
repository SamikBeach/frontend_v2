import { useSuspenseQuery } from '@tanstack/react-query';
import { Hash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { LibraryCompositionResponse } from '@/apis/user/types';
import { getLibraryComposition } from '@/apis/user/user';
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
];

interface LibraryCompositionChartProps {
  userId?: number;
}

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-gray-800">
          {data.name || data.tag || label}
        </p>
        <div className="mt-1">
          <p className="text-xs font-semibold text-gray-700">
            {`${payload[0].value}${data.tag ? '회' : '권'}`}
          </p>
          {data.percent && (
            <p className="text-xs text-gray-500">
              {`전체의 ${(data.percent * 100).toFixed(1)}%`}
            </p>
          )}
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

// 파이 차트 커스텀 라벨 렌더링 함수
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  if (percent < 0.05) return null; // 작은 조각에는 라벨 표시 안함

  const RADIAN = Math.PI / 180;
  // 라벨 위치 - 각 조각의 중간 지점에 배치
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

const LibraryCompositionChart = ({ userId }: LibraryCompositionChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);
  const [activeTab, setActiveTab] = useState('libraries');
  const [selectedLibrary, setSelectedLibrary] = useState<string | null>(null);

  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === id;
  const { settings, handleUpdateSetting, isUpdating } = isMyProfile
    ? useStatisticsSettings(id)
    : { settings: null, handleUpdateSetting: () => {}, isUpdating: false };

  const { data, isLoading } = useSuspenseQuery<LibraryCompositionResponse>({
    queryKey: ['libraryComposition', id],
    queryFn: () => getLibraryComposition(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic && !isMyProfile) {
    return (
      <PrivateDataMessage
        message="이 통계는 비공개 설정되어 있습니다."
        title="서재 구성"
      />
    );
  }

  // 공개/비공개 토글 핸들러
  const handlePrivacyToggle = (isPublic: boolean) => {
    handleUpdateSetting('isLibraryCompositionPublic', isPublic);
  };

  // 설정 로딩 중 또는 설정 업데이트 중인지 확인
  const showLoading = isLoading || isUpdating || (isMyProfile && !settings);

  // 데이터가 없는 경우
  if (
    data.totalLibraries === 0 ||
    !data.booksPerLibrary ||
    data.booksPerLibrary.length === 0
  ) {
    return <NoDataMessage message="서재 구성 데이터가 없습니다." />;
  }

  // 서재 데이터 가공
  const totalBooks = data.booksPerLibrary.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const libraryData = data.booksPerLibrary
    .map((item, index) => ({
      name: item.name,
      value: item.count,
      color: CHART_COLORS[index % CHART_COLORS.length],
      percent: totalBooks > 0 ? item.count / totalBooks : 0,
    }))
    .slice(0, 5); // 상위 5개만 표시

  // 태그 데이터 가공
  const tagData =
    data.tagsDistribution.find(
      item => !selectedLibrary || item.library === selectedLibrary
    )?.tags || [];

  // 태그 데이터 정렬
  const sortedTagData = [...tagData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // 상위 5개만 표시
    .map((tag, index) => ({
      name: tag.tag, // 파이 차트의 nameKey로 사용하기 위해 tag 속성을 name으로도 설정
      tag: tag.tag,
      value: tag.count, // 파이 차트의 dataKey로 사용하기 위해 count 속성을 value로도 설정
      count: tag.count,
      color: CHART_COLORS[index % CHART_COLORS.length],
      percent:
        tagData.reduce((sum, t) => sum + t.count, 0) > 0
          ? tag.count / tagData.reduce((sum, t) => sum + t.count, 0)
          : 0,
    }));

  return (
    <div className="h-[340px] w-full rounded-lg bg-white p-2.5">
      <div className="flex h-full flex-col">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-base font-medium text-gray-700">서재 구성</h3>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('libraries')}
                className={cn(
                  'flex h-7 cursor-pointer items-center rounded-full border px-2 text-xs font-medium transition-colors',
                  activeTab === 'libraries'
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                )}
              >
                서재별 도서 수
              </button>
              <button
                onClick={() => setActiveTab('tags')}
                className={cn(
                  'flex h-7 cursor-pointer items-center rounded-full border px-2 text-xs font-medium transition-colors',
                  activeTab === 'tags'
                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                )}
              >
                태그 분포
              </button>
            </div>
            {isMyProfile && (
              <PrivacyToggle
                isPublic={settings?.isLibraryCompositionPublic || false}
                isLoading={showLoading}
                onToggle={handlePrivacyToggle}
              />
            )}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'libraries' ? (
            <div className="h-full pt-2">
              {libraryData.length > 0 ? (
                <div className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={libraryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={90}
                        innerRadius={35}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        onClick={data => setSelectedLibrary(data.name)}
                        paddingAngle={2}
                      >
                        {libraryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke={
                              selectedLibrary === entry.name ? '#000' : 'none'
                            }
                            strokeWidth={selectedLibrary === entry.name ? 2 : 0}
                          />
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
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-xs text-gray-400">
                    서재 데이터가 없습니다
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full">
              {sortedTagData.length > 0 ? (
                <div className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sortedTagData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={90}
                        innerRadius={35}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        paddingAngle={2}
                      >
                        {sortedTagData.map((entry, index) => (
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
                </div>
              ) : selectedLibrary ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <Hash className="mb-2 h-8 w-8 text-gray-300" />
                  <p className="text-xs text-gray-400">
                    &quot;{selectedLibrary}&quot; 서재에 태그가 없습니다
                  </p>
                  <button
                    className="mt-2 text-xs text-blue-500 hover:underline"
                    onClick={() => setSelectedLibrary(null)}
                  >
                    모든 서재 보기
                  </button>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-xs text-gray-400">
                    태그 데이터가 없습니다
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

export default LibraryCompositionChart;
