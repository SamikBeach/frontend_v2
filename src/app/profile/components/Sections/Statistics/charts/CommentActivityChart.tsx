import { useSuspenseQuery } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
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

import { getCommentActivity } from '@/apis/user/user';
import { CommentActivityResponse } from '@/apis/user/types';
import { NoDataMessage, PrivateDataMessage } from '../common';

interface CommentActivityChartProps {
  userId?: number;
}

const CommentActivityChart = ({ userId }: CommentActivityChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);

  const { data } = useSuspenseQuery<CommentActivityResponse>({
    queryKey: ['commentActivity', id],
    queryFn: () => getCommentActivity(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return <PrivateDataMessage message="이 통계는 비공개 설정되어 있습니다." />;
  }

  // 데이터가 없는 경우
  if (
    data.totalComments === 0 ||
    (data.commentsPerReview && data.commentsPerReview.length === 0)
  ) {
    return <NoDataMessage message="댓글 활동 데이터가 없습니다." />;
  }

  return (
    <div className="h-[240px] w-full rounded-lg bg-gray-50 p-3">
      <div className="flex h-full flex-col">
        <div className="mb-2">
          <h3 className="text-base font-medium text-gray-700">댓글 활동 통계</h3>
          <p className="text-xs text-gray-500">
            총 댓글 수: {data.totalComments}개 | 주간 평균:{' '}
            {data.commentsPerWeek.toFixed(1)}개
          </p>
        </div>

        <div className="flex-1">
          <div className="grid h-full grid-rows-[auto_1fr]">
            <div className="mb-2 rounded-lg bg-gray-50 p-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-100 p-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-medium">평균 댓글 작성 빈도</h3>
                  <p className="text-sm font-bold text-blue-600">
                    주 {data.commentsPerWeek.toFixed(1)}개
                  </p>
                </div>
              </div>
            </div>

            <div className="h-full">
              {data.commentsPerReview && data.commentsPerReview.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.commentsPerReview}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="range"
                      label={{
                        value: '댓글 수 범위',
                        position: 'insideBottom',
                        offset: -5,
                      }}
                    />
                    <YAxis
                      label={{
                        value: '리뷰 수',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}개`, '리뷰 수']}
                    />
                    <Bar dataKey="count" name="리뷰 수" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400">댓글 분포 데이터가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentActivityChart;
