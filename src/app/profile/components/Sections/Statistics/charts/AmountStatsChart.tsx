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

import { AmountStatsResponse } from '@/apis/user/types';
import { getAmountStats } from '@/apis/user/user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NoDataMessage, PrivateDataMessage } from '../common';

interface AmountStatsChartProps {
  userId?: number;
}

const AmountStatsChart = ({ userId }: AmountStatsChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);
  const [activeTab, setActiveTab] = useState('monthly');

  const { data } = useSuspenseQuery<AmountStatsResponse>({
    queryKey: ['amountStats', id],
    queryFn: () => getAmountStats(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return <PrivateDataMessage message="이 통계는 비공개 설정되어 있습니다." />;
  }

  // 데이터가 없는 경우
  if (
    data.estimatedTotalSpent === 0 &&
    (!data.monthlySpending || data.monthlySpending.length === 0) &&
    (!data.categoryPriceAverage || data.categoryPriceAverage.length === 0)
  ) {
    return <NoDataMessage message="금액 통계 데이터가 없습니다." />;
  }

  // 카테고리별 평균 가격 데이터 정렬 (높은 가격순)
  const sortedCategoryData = [...(data.categoryPriceAverage || [])]
    .sort((a, b) => b.averagePrice - a.averagePrice)
    .slice(0, 8); // 상위 8개만 표시

  return (
    <div className="h-[240px] w-full rounded-lg bg-gray-50 p-3">
      <div className="flex h-full flex-col">
        <div className="mb-2">
          <h3 className="text-base font-medium text-gray-700">도서 지출 통계</h3>
          <p className="text-xs text-gray-500">
            총 예상 지출액:{' '}
            {data.estimatedTotalSpent.toLocaleString('ko-KR', {
              style: 'currency',
              currency: 'KRW',
              maximumFractionDigits: 0,
            })}
          </p>
        </div>

        <div className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsList className="mb-2">
              <TabsTrigger value="monthly">월별 지출</TabsTrigger>
              <TabsTrigger value="category">카테고리별 평균</TabsTrigger>
            </TabsList>

            <TabsContent value="monthly" className="h-[calc(100%-40px)]">
              {data.monthlySpending && data.monthlySpending.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.monthlySpending}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="amountGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ef4444"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ef4444"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      tickFormatter={value => `${(value / 10000).toFixed(0)}만`}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        value.toLocaleString('ko-KR', {
                          style: 'currency',
                          currency: 'KRW',
                          maximumFractionDigits: 0,
                        }),
                        '지출액',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      name="지출액"
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#amountGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400">월별 지출 데이터가 없습니다</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="category" className="h-[calc(100%-40px)]">
              {sortedCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedCategoryData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="category"
                      type="category"
                      width={80}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        value.toLocaleString('ko-KR', {
                          style: 'currency',
                          currency: 'KRW',
                          maximumFractionDigits: 0,
                        }),
                        '평균 가격',
                      ]}
                    />
                    <Bar
                      dataKey="averagePrice"
                      name="평균 가격"
                      fill="#f59e0b"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400">
                    카테고리별 평균 가격 데이터가 없습니다
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AmountStatsChart;
