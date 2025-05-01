import { getFollowerStats } from '@/apis/user/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { NoDataMessage, PrivateDataMessage } from '../common';

interface FollowerStatsChartProps {
  userId: number;
}

const FollowerStatsChart = ({ userId }: FollowerStatsChartProps) => {
  const { data } = useSuspenseQuery({
    queryKey: ['followerStats', userId],
    queryFn: () => getFollowerStats(userId),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return <PrivateDataMessage message="이 통계는 비공개 설정되어 있습니다." />;
  }

  // 데이터가 없는 경우
  const hasNoFollowers = data.followersCount === 0 && data.followingCount === 0;
  const hasNoGrowthData =
    !data.followerGrowth || data.followerGrowth.length === 0;

  if (hasNoFollowers && hasNoGrowthData) {
    return <NoDataMessage message="팔로워 데이터가 없습니다." />;
  }

  return (
    <Card className="h-[240px] w-full bg-gray-50">
      <CardHeader className="pb-2">
        <CardTitle>팔로워 통계</CardTitle>
        <CardDescription>
          팔로워: {data.followersCount}명 / 팔로잉: {data.followingCount}명
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid h-[calc(100%-2rem)] grid-rows-[auto_1fr]">
          <div className="mb-2 grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div>
                <h3 className="mb-1 text-xs font-medium text-gray-500">
                  팔로워
                </h3>
                <p className="text-lg font-bold">{data.followersCount}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div>
                <h3 className="mb-1 text-xs font-medium text-gray-500">
                  팔로잉
                </h3>
                <p className="text-lg font-bold">{data.followingCount}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="h-full">
            {!hasNoGrowthData ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.followerGrowth}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} />
                  <Tooltip
                    formatter={(value: any) => [`${value}명`, '팔로워 수']}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="팔로워 수"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-400">
                  팔로워 증가 추이 데이터가 없습니다
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerStatsChart;
