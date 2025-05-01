import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { LibraryDiversityResponse } from '@/apis/user/types';
import { getLibraryDiversity } from '@/apis/user/user';
import { NoDataMessage, PrivateDataMessage } from '../common';

interface LibraryDiversityChartProps {
  userId?: number;
}

const LibraryDiversityChart = ({ userId }: LibraryDiversityChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);

  const { data } = useSuspenseQuery<LibraryDiversityResponse>({
    queryKey: ['libraryDiversity', id],
    queryFn: () => getLibraryDiversity(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return <PrivateDataMessage message="이 통계는 비공개 설정되어 있습니다." />;
  }

  // 데이터가 없는 경우
  if (!data.genreDiversityIndex || data.genreDiversityIndex.length === 0) {
    return <NoDataMessage message="서재 다양성 데이터가 없습니다." />;
  }

  // 다양성 지표 데이터 정렬 (내림차순)
  const sortedDiversityData = [...data.genreDiversityIndex]
    .sort((a, b) => b.index - a.index)
    .slice(0, 8); // 상위 8개만 표시

  return (
    <div className="h-[240px] w-full rounded-lg bg-gray-50 p-3">
      <div className="flex h-full flex-col">
        <div className="mb-2">
          <h3 className="text-base font-medium text-gray-700">서재 다양성</h3>
          <p className="text-xs text-gray-500">
            가장 다양한 서재: {data.mostDiverseLibrary || '데이터 없음'} | 가장
            전문화된 서재: {data.mostSpecializedLibrary || '데이터 없음'}
          </p>
        </div>

        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedDiversityData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                domain={[0, 1]}
                tickFormatter={value => value.toFixed(2)}
              />
              <YAxis
                dataKey="library"
                type="category"
                width={100}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value: number) => [value.toFixed(2), '다양성 지수']}
              />
              <Bar
                dataKey="index"
                name="다양성 지수"
                fill="#8b5cf6"
                isAnimationActive
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LibraryDiversityChart;
