import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { cn } from '@/lib/utils';
import { PrivateDataMessage } from '../components/PrivateDataMessage';
import { useAuthorPublisherStats } from '../hooks';

// 차트 색상 배열
const CHART_COLORS = [
  '#bfdbfe', // blue-200
  '#bbf7d0', // green-200
  '#fef08a', // yellow-200
  '#fbcfe8', // pink-200
  '#ddd6fe', // violet-200
  '#fed7aa', // orange-200
  '#cffafe', // cyan-200
  '#d1fae5', // emerald-200
];

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-md border border-gray-100 bg-white p-2 shadow-md">
        <p className="mb-1 text-xs font-medium text-gray-800">
          {data.author || data.publisher || data.year}
        </p>
        <div className="flex items-center text-xs font-medium">
          <span
            className="mr-1.5 h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: payload[0].fill }}
          ></span>
          <span className="text-gray-600">{`${data.count}권`}</span>
        </div>
      </div>
    );
  }
  return null;
};

interface AuthorPublisherChartProps {
  userId: number;
}

type DataType = 'author' | 'publisher' | 'publicationYear';

type AuthorItem = { author: string; count: number };
type PublisherItem = { publisher: string; count: number };
type YearItem = { year: string; count: number };
type ChartItem = AuthorItem | PublisherItem | YearItem;

const AuthorPublisherChart = ({ userId }: AuthorPublisherChartProps) => {
  const [activeDataType, setActiveDataType] = useState<DataType>('author');
  const CHART_TITLE = '저자 및 출판사';

  // 데이터 가져오기
  const { data } = useAuthorPublisherStats(userId);

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return (
      <PrivateDataMessage
        message="이 통계는 비공개 설정되어 있습니다."
        title={CHART_TITLE}
      />
    );
  }

  // 필터 옵션
  const dataTypeOptions = [
    { id: 'author' as DataType, name: '저자' },
    { id: 'publisher' as DataType, name: '출판사' },
    { id: 'publicationYear' as DataType, name: '출판연도' },
  ];

  // 선택된 데이터 타입에 따라 데이터 선택
  let chartData: ChartItem[] = [];
  let labelName = '';

  switch (activeDataType) {
    case 'author':
      chartData =
        data.topAuthors?.map(item => ({
          author: item.author,
          count: item.count,
        })) || [];
      labelName = '저자';
      break;
    case 'publisher':
      chartData =
        data.topPublishers?.map(item => ({
          publisher: item.publisher,
          count: item.count,
        })) || [];
      labelName = '출판사';
      break;
    case 'publicationYear':
      chartData =
        data.publishYearDistribution?.map(item => ({
          year: item.year,
          count: item.count,
        })) || [];
      labelName = '출판연도';
      break;
  }

  // 차트 데이터가 없는 경우 기본 데이터 표시
  if (!chartData || chartData.length === 0) {
    if (activeDataType === 'author') {
      chartData = [
        { author: '미상', count: 0 },
        { author: '김영하', count: 0 },
        { author: '베르나르 베르베르', count: 0 },
        { author: '유발 하라리', count: 0 },
        { author: '무라카미 하루키', count: 0 },
      ] as AuthorItem[];
    } else if (activeDataType === 'publisher') {
      chartData = [
        { publisher: '미상', count: 0 },
        { publisher: '민음사', count: 0 },
        { publisher: '위즈덤하우스', count: 0 },
        { publisher: '창비', count: 0 },
        { publisher: '문학동네', count: 0 },
      ] as PublisherItem[];
    } else {
      chartData = [
        { year: '미상', count: 0 },
        { year: '2023', count: 0 },
        { year: '2022', count: 0 },
        { year: '2021', count: 0 },
        { year: '2020', count: 0 },
      ] as YearItem[];
    }
  }

  // 데이터 정렬 및 상위 5개 항목 선택
  const topItems = [...chartData].sort((a, b) => b.count - a.count).slice(0, 5);

  // Y축 라벨 포매터
  const yAxisLabelFormatter = (label: string) => {
    if (label.length > 10) {
      return `${label.substring(0, 8)}...`;
    }
    return label;
  };

  // 가장 많이 읽은 저자/출판사/연도 정보
  let mostReadItem = null;
  if (topItems.length > 0 && topItems[0].count > 0) {
    const item = topItems[0];
    const name =
      'author' in item
        ? item.author
        : 'publisher' in item
          ? item.publisher
          : 'year' in item
            ? item.year
            : '';

    mostReadItem = {
      name,
      count: topItems[0].count,
      type:
        activeDataType === 'author'
          ? '저자'
          : activeDataType === 'publisher'
            ? '출판사'
            : '출판연도',
    };
  }

  // 차트 최대값 계산
  const maxValue = Math.max(...topItems.map(item => item.count)) || 1;

  return (
    <div className="h-[340px] w-full rounded-lg bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="min-w-[120px]">
          <h3 className="text-base font-medium text-gray-700">{CHART_TITLE}</h3>
        </div>
        <div className="flex space-x-1">
          {dataTypeOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setActiveDataType(option.id)}
              className={cn(
                'flex h-7 cursor-pointer items-center rounded-full border px-2 text-xs font-medium transition-colors',
                activeDataType === option.id
                  ? 'border-blue-200 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              )}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[calc(100%-2.5rem)]">
        {topItems.length === 0 || topItems[0].count === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-400">데이터가 없습니다</p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={topItems}
                layout="vertical"
                margin={{ top: 10, right: 15, left: 15, bottom: 25 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  type="number"
                  domain={[0, maxValue]}
                  tickFormatter={value => `${Math.floor(value)}`}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  stroke="#e5e7eb"
                  axisLine={{ stroke: '#e5e7eb' }}
                  allowDecimals={false}
                />
                <YAxis
                  dataKey={
                    activeDataType === 'author'
                      ? 'author'
                      : activeDataType === 'publisher'
                        ? 'publisher'
                        : 'year'
                  }
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={80}
                  tickFormatter={yAxisLabelFormatter}
                  tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" barSize={28} minPointSize={2}>
                  {topItems.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 차트 대신 항목 표시 */}
        {topItems.length > 0 && topItems[0].count === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <p className="mb-1 text-sm text-gray-400">데이터가 없습니다</p>
            <p className="text-xs text-gray-400">
              등록된 {labelName} 데이터가 없습니다
            </p>
          </div>
        )}

        {/* 가장 많이 읽은 항목 정보 표시 */}
        {mostReadItem && (
          <div className="absolute right-0 bottom-0 left-0 flex justify-center">
            <div className="rounded-md bg-gray-50 px-3 py-1.5">
              <p className="text-center text-sm text-gray-600">
                주요{' '}
                {activeDataType === 'author'
                  ? '저자'
                  : activeDataType === 'publisher'
                    ? '출판사'
                    : '출판연도'}
                :{' '}
                <span className="font-medium text-blue-600">
                  {mostReadItem.name}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorPublisherChart;
