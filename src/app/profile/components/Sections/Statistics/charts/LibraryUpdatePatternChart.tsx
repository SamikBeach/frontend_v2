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

import { LibraryUpdatePatternResponse } from '@/apis/user/types';
import { getLibraryUpdatePattern } from '@/apis/user/user';
import { NoDataMessage, PrivateDataMessage } from '../common';

interface LibraryUpdatePatternChartProps {
  userId?: number;
}

const LibraryUpdatePatternChart = ({
  userId,
}: LibraryUpdatePatternChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);

  const { data } = useSuspenseQuery<LibraryUpdatePatternResponse>({
    queryKey: ['libraryUpdatePattern', id],
    queryFn: () => getLibraryUpdatePattern(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return <PrivateDataMessage message="이 통계는 비공개 설정되어 있습니다." />;
  }

  // 데이터가 없는 경우
  if (
    (!data.updateFrequency || data.updateFrequency.length === 0) &&
    (!data.weekdayActivity || data.weekdayActivity.length === 0)
  ) {
    return <NoDataMessage message="서재 업데이트 패턴 데이터가 없습니다." />;
  }

  // 요일 데이터 변환 (정렬)
  const weekdayOrder = ['월', '화', '수', '목', '금', '토', '일'];
  const formattedWeekdayData = [...data.weekdayActivity].sort(
    (a, b) => weekdayOrder.indexOf(a.day) - weekdayOrder.indexOf(b.day)
  );

  return (
    <div className="h-[240px] w-full rounded-lg bg-gray-50 p-3">
      <div className="flex h-full flex-col">
        <div className="mb-2">
          <h3 className="text-base font-medium text-gray-700">서재 업데이트 패턴</h3>
          <p className="text-xs text-gray-500">
            가장 활발한 서재: {data.mostActiveLibrary || '데이터 없음'}
          </p>
        </div>

        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedWeekdayData}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${value}회`, '업데이트 횟수']}
              />
              <Bar
                dataKey="count"
                name="업데이트 횟수"
                fill="#10b981"
                isAnimationActive
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LibraryUpdatePatternChart;
