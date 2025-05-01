import { useSuspenseQuery } from '@tanstack/react-query';
import { BookText, Languages } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { BookMetadataStatsResponse } from '@/apis/user/types';
import { getBookMetadataStats } from '@/apis/user/user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NoDataMessage, PrivateDataMessage } from '../common';

interface BookMetadataStatsChartProps {
  userId?: number;
}

const BookMetadataStatsChart = ({ userId }: BookMetadataStatsChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);
  const [activeTab, setActiveTab] = useState('years');

  const { data } = useSuspenseQuery<BookMetadataStatsResponse>({
    queryKey: ['bookMetadataStats', id],
    queryFn: () => getBookMetadataStats(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return <PrivateDataMessage message="이 통계는 비공개 설정되어 있습니다." />;
  }

  // 데이터가 없는 경우
  if (
    (!data.publicationYearDistribution ||
      data.publicationYearDistribution.length === 0) &&
    data.averageBookAge === 0 &&
    data.translationRatio === 0
  ) {
    return <NoDataMessage message="도서 메타데이터 통계가 없습니다." />;
  }

  // 출판 연도 분포 정렬
  const sortedYearData = [...(data.publicationYearDistribution || [])].sort(
    (a, b) => {
      return Number(a.year) - Number(b.year);
    }
  );

  return (
    <div className="h-[240px] w-full rounded-lg bg-gray-50 p-3">
      <div className="flex h-full flex-col">
        <div className="mb-2">
          <h3 className="text-base font-medium text-gray-700">도서 메타데이터 분석</h3>
          <p className="text-xs text-gray-500">
            평균 도서 연령: {data.averageBookAge.toFixed(1)}년 | 번역서 비율:{' '}
            {(data.translationRatio * 100).toFixed(1)}%
          </p>
        </div>

        <div className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsList className="mb-2">
              <TabsTrigger value="years">출판 연도</TabsTrigger>
              <TabsTrigger value="stats">통계 지표</TabsTrigger>
            </TabsList>

            <TabsContent value="years" className="h-[calc(100%-40px)]">
              {sortedYearData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedYearData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`${value}권`, '도서 수']}
                    />
                    <Bar dataKey="count" name="도서 수" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400">출판 연도 데이터가 없습니다</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="stats" className="h-[calc(100%-40px)]">
              <div className="grid h-full grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-3">
                  <div className="mb-2 rounded-full bg-blue-100 p-3">
                    <BookText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-base font-medium text-blue-600">
                    평균 도서 연령
                  </h3>
                  <p className="mt-1 text-lg font-bold text-blue-700">
                    {data.averageBookAge.toFixed(1)}년
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-lg bg-teal-50 p-3">
                  <div className="mb-2 rounded-full bg-teal-100 p-3">
                    <Languages className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-base font-medium text-teal-600">
                    번역서 비율
                  </h3>
                  <p className="mt-1 text-lg font-bold text-teal-700">
                    {(data.translationRatio * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BookMetadataStatsChart;
