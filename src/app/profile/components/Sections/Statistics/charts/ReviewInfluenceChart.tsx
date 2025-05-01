import { useSuspenseQuery } from '@tanstack/react-query';
import { Star, ThumbsUp } from 'lucide-react';
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

import { ReviewInfluenceResponse } from '@/apis/user/types';
import { getReviewInfluence } from '@/apis/user/user';
import { NoDataMessage, PrivateDataMessage } from '../common';

interface ReviewInfluenceChartProps {
  userId?: number;
}

const ReviewInfluenceChart = ({ userId }: ReviewInfluenceChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);

  const { data } = useSuspenseQuery<ReviewInfluenceResponse>({
    queryKey: ['reviewInfluence', id],
    queryFn: () => getReviewInfluence(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return <PrivateDataMessage message="이 통계는 비공개 설정되어 있습니다." />;
  }

  // 데이터가 없는 경우
  if (
    data.averageLikesPerReview === 0 &&
    (!data.popularReviews || data.popularReviews.length === 0)
  ) {
    return <NoDataMessage message="리뷰 영향력 데이터가 없습니다." />;
  }

  // 인기 리뷰 데이터 가공 (최대 표시할 글자 수 제한)
  const processedPopularReviews = data.popularReviews.map(review => ({
    ...review,
    // 리뷰 내용 텍스트 길이 제한 (30자까지만 표시)
    shortContent:
      review.content.length > 30
        ? `${review.content.substring(0, 30)}...`
        : review.content,
  }));

  return (
    <div className="h-[240px] w-full rounded-lg bg-gray-50 p-3">
      <div className="flex h-full flex-col">
        <div className="mb-2">
          <h3 className="text-base font-medium text-gray-700">리뷰 영향력</h3>
          <p className="text-xs text-gray-500">
            리뷰당 평균 좋아요: {data.averageLikesPerReview.toFixed(1)}개 |
            기여도: {data.communityContributionScore.toFixed(0)}점
          </p>
        </div>

        <div className="flex-1">
          <div className="grid h-full grid-rows-[auto_1fr]">
            <div className="mb-2 flex gap-4">
              <div className="flex-1 rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-pink-100 p-2">
                    <ThumbsUp className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium">리뷰당 좋아요</h3>
                    <p className="text-sm font-bold text-pink-600">
                      {data.averageLikesPerReview.toFixed(1)}개
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-purple-100 p-2">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium">커뮤니티 기여도</h3>
                    <p className="text-sm font-bold text-purple-600">
                      {data.communityContributionScore.toFixed(0)}점
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full">
              {processedPopularReviews.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={processedPopularReviews}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="shortContent"
                      type="category"
                      width={150}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}개`, '좋아요 수']}
                      labelFormatter={content => `${content}`}
                    />
                    <Bar dataKey="likes" name="좋아요 수" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400">인기 리뷰 데이터가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewInfluenceChart;
