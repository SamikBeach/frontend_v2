import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { LibraryPopularityResponse } from '@/apis/user/types';
import { getLibraryPopularity } from '@/apis/user/user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NoDataMessage, PrivateDataMessage } from '../common';

interface LibraryPopularityChartProps {
  userId?: number;
}

const LibraryPopularityChart = ({ userId }: LibraryPopularityChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);
  const [activeTab, setActiveTab] = useState('current');
  const [selectedLibrary, setSelectedLibrary] = useState<string | null>(null);

  const { data } = useSuspenseQuery<LibraryPopularityResponse>({
    queryKey: ['libraryPopularity', id],
    queryFn: () => getLibraryPopularity(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return <PrivateDataMessage message="이 통계는 비공개 설정되어 있습니다." />;
  }

  // 데이터가 없는 경우
  if (
    (!data.subscribersPerLibrary || data.subscribersPerLibrary.length === 0) &&
    (!data.popularityTrend || data.popularityTrend.length === 0)
  ) {
    return <NoDataMessage message="서재 인기도 데이터가 없습니다." />;
  }

  // 서재별 구독자 데이터 가공 (상위 10개만)
  const sortedSubscribersData = [...data.subscribersPerLibrary]
    .sort((a, b) => b.subscribers - a.subscribers)
    .slice(0, 10);

  // 추세 데이터 준비
  const trendData = selectedLibrary
    ? data.popularityTrend.find(item => item.library === selectedLibrary)
        ?.trend || []
    : data.popularityTrend.length > 0
      ? data.popularityTrend[0].trend
      : [];

  // 서재 선택 핸들러
  const handleLibrarySelect = (library: string) => {
    setSelectedLibrary(library);
    setActiveTab('trend');
  };

  return (
    <div className="h-[240px] w-full rounded-lg bg-gray-50 p-3">
      <div className="flex h-full flex-col">
        <div className="mb-2">
          <h3 className="text-base font-medium text-gray-700">서재 인기도</h3>
          <p className="text-xs text-gray-500">
            가장 인기있는 서재: {data.mostPopularLibrary || '데이터 없음'}
          </p>
        </div>

        <div className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsList className="mb-2">
              <TabsTrigger value="current">현재 구독자</TabsTrigger>
              <TabsTrigger value="trend">구독자 추세</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="h-[calc(100%-40px)]">
              {sortedSubscribersData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedSubscribersData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    onClick={data =>
                      data &&
                      handleLibrarySelect(
                        data.activePayload?.[0]?.payload.library
                      )
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="library"
                      type="category"
                      width={100}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}명`, '구독자 수']}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar
                      dataKey="subscribers"
                      name="구독자 수"
                      fill="#3b82f6"
                      isAnimationActive
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400">서재 구독자 데이터가 없습니다</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="trend" className="h-[calc(100%-40px)]">
              {trendData.length > 0 ? (
                <div className="h-full">
                  <p className="mb-2 text-center text-xs text-gray-500">
                    {selectedLibrary
                      ? `"${selectedLibrary}" 서재의 구독자 추세`
                      : `"${data.popularityTrend[0].library}" 서재의 구독자 추세`}
                  </p>
                  <ResponsiveContainer width="100%" height="85%">
                    <AreaChart
                      data={trendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="subscriberGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [
                          `${value}명`,
                          '구독자 수',
                        ]}
                        labelFormatter={date => `${date}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="subscribers"
                        name="구독자 수"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#subscriberGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400">구독자 추세 데이터가 없습니다</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LibraryPopularityChart;
