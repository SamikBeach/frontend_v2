import { getRatingStats } from '@/apis/user/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Star } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { NoDataMessage, PrivateDataMessage } from '../common';

interface RatingStatsChartProps {
  userId: number;
}

// 날짜 포맷팅 함수: YYYY-MM -> YYYY년 M월
const formatMonth = (monthStr: string): string => {
  try {
    if (!monthStr || !monthStr.includes('-')) return monthStr;

    const [year, month] = monthStr.split('-');
    return format(new Date(Number(year), Number(month) - 1, 1), 'yyyy년 M월', {
      locale: ko,
    });
  } catch (error) {
    return monthStr;
  }
};

const RatingStatsChart = ({ userId }: RatingStatsChartProps) => {
  const [activeTab, setActiveTab] = useState('distribution');

  const { data } = useSuspenseQuery({
    queryKey: ['ratingStats', userId],
    queryFn: () => getRatingStats(userId),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return <PrivateDataMessage message="이 통계는 비공개 설정되어 있습니다." />;
  }

  // 데이터가 없는 경우
  if (
    (!data.ratingDistribution || data.ratingDistribution.length === 0) &&
    (!data.categoryRatings || data.categoryRatings.length === 0) &&
    (!data.monthlyAverageRatings || data.monthlyAverageRatings.length === 0)
  ) {
    return <NoDataMessage message="평점 데이터가 없습니다." />;
  }

  // 평점 분포 데이터 전처리 (빈 평점 채우기)
  const fullRatingDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = i + 1;
    const existingData = data.ratingDistribution.find(
      item => item.rating === rating
    );
    return existingData ? existingData : { rating, count: 0 };
  });

  // 카테고리 평점 상위 표시
  const sortedCategoryRatings = [...data.categoryRatings]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 8);

  // 월별 데이터 처리 (X축 포맷팅을 위한 추가 작업)
  const formattedMonthlyData = data.monthlyAverageRatings.map(item => ({
    ...item,
    formattedMonth: formatMonth(item.month),
  }));

  return (
    <Card className="h-[240px] w-full bg-gray-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-1">
          평점 통계
          {data.averageRating > 0 && (
            <div className="ml-2 flex items-center gap-1 text-sm font-normal">
              <span className="text-gray-500">평균</span>
              <span className="ml-1 flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-0.5">{data.averageRating.toFixed(1)}</span>
              </span>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          {data.averageRating > 0
            ? `평균 평점: ${data.averageRating.toFixed(1)}점`
            : '아직 충분한 평점 데이터가 없습니다.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="mb-2">
            <TabsTrigger value="distribution">평점 분포</TabsTrigger>
            <TabsTrigger value="categories">카테고리별</TabsTrigger>
            <TabsTrigger value="monthly">월별 추이</TabsTrigger>
          </TabsList>

          <TabsContent value="distribution" className="h-52">
            {fullRatingDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={fullRatingDistribution}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="rating"
                    tickFormatter={rating => `${rating}점`}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value}개`, '평점 수']}
                    labelFormatter={rating => `${rating}점`}
                  />
                  <Bar dataKey="count" name="평점 수" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-400">평점 분포 데이터가 없습니다</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="h-52">
            {sortedCategoryRatings.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedCategoryRatings}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 5]} tickCount={6} />
                  <YAxis
                    type="category"
                    width={80}
                    dataKey="category"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toFixed(1)}점`,
                      '평균 평점',
                    ]}
                  />
                  <Bar
                    dataKey="averageRating"
                    name="평균 평점"
                    fill="#8b5cf6"
                    barSize={14}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-400">
                  카테고리별 평점 데이터가 없습니다
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="monthly" className="h-52">
            {formattedMonthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={formattedMonthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={month => {
                      // YYYY-MM 형식에서 MM 부분만 추출하여 M월 형태로 표시
                      if (month && month.includes('-')) {
                        const [, monthPart] = month.split('-');
                        return `${Number(monthPart)}월`;
                      }
                      return month;
                    }}
                  />
                  <YAxis domain={[0, 5]} tickCount={6} />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toFixed(1)}점`,
                      '평균 평점',
                    ]}
                    labelFormatter={month => formatMonth(month)}
                  />
                  <Line
                    type="monotone"
                    dataKey="averageRating"
                    name="평균 평점"
                    stroke="#ec4899"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-400">월별 평점 데이터가 없습니다</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RatingStatsChart;
