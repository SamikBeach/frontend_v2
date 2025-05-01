import { getUserInteraction } from '@/apis/user/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { NoDataMessage, PrivateDataMessage } from '../common';

interface UserInteractionChartProps {
  userId: number;
}

const UserInteractionChart = ({ userId }: UserInteractionChartProps) => {
  const { data } = useSuspenseQuery({
    queryKey: ['userInteraction', userId],
    queryFn: () => getUserInteraction(userId),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return <PrivateDataMessage message="이 통계는 비공개 설정되어 있습니다." />;
  }

  // 데이터가 없는 경우
  if (
    data.totalLikesReceived === 0 &&
    data.totalCommentsReceived === 0 &&
    (!data.monthlyLikes || data.monthlyLikes.length === 0)
  ) {
    return <NoDataMessage message="상호작용 데이터가 없습니다." />;
  }

  return (
    <Card className="h-[240px] w-full bg-gray-50">
      <CardHeader className="pb-2">
        <CardTitle>사용자 상호작용</CardTitle>
        <CardDescription>
          참여율:{' '}
          {data.engagementRate > 0
            ? `${data.engagementRate.toFixed(1)}%`
            : '데이터 없음'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid h-[calc(100%-2rem)] grid-rows-[auto_1fr]">
          <div className="mb-2 grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div>
                <h3 className="mb-1 text-xs font-medium text-gray-500">
                  받은 좋아요
                </h3>
                <p className="text-lg font-bold">{data.totalLikesReceived}</p>
              </div>
              <div className="rounded-full bg-pink-100 p-2">
                <ThumbsUp className="h-5 w-5 text-pink-600" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div>
                <h3 className="mb-1 text-xs font-medium text-gray-500">
                  받은 댓글
                </h3>
                <p className="text-lg font-bold">
                  {data.totalCommentsReceived}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="h-full">
            {data.monthlyLikes && data.monthlyLikes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.monthlyLikes}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="likeGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#ec4899"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} />
                  <Tooltip
                    formatter={(value: any) => [`${value}개`, '좋아요']}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="좋아요"
                    stroke="#ec4899"
                    fillOpacity={1}
                    fill="url(#likeGradient)"
                    dot={{ fill: '#ec4899', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-400">월별 좋아요 데이터가 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInteractionChart;
