import { useSuspenseQuery } from '@tanstack/react-query';
import { Star, ThumbsUp } from 'lucide-react';
import { useParams } from 'next/navigation';

import { ReviewInfluenceResponse } from '@/apis/user/types';
import { getReviewInfluence } from '@/apis/user/user';
import { NoDataMessage, PrivateDataMessage } from '../components';

interface CommunityInfluenceChartProps {
  userId?: number;
}

// 파스텔톤 차트 색상
const COLORS = {
  LIKES: '#93c5fd', // blue-300 (파스텔)
  CONTRIBUTION: '#c4b5fd', // violet-300 (파스텔)
};

const CommunityInfluenceChart = ({ userId }: CommunityInfluenceChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);

  const { data } = useSuspenseQuery<ReviewInfluenceResponse>({
    queryKey: ['reviewInfluence', id],
    queryFn: () => getReviewInfluence(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return (
      <PrivateDataMessage
        message="이 통계는 비공개 설정되어 있습니다."
        title="커뮤니티 영향력"
      />
    );
  }

  // 데이터가 없는 경우
  if (
    data.averageLikesPerReview === 0 &&
    (!data.popularReviews || data.popularReviews.length === 0)
  ) {
    return <NoDataMessage message="커뮤니티 영향력 데이터가 없습니다." />;
  }

  // 인기 게시글 데이터 가공 (최대 표시할 글자 수 제한)
  const processedPopularPosts = data.popularReviews.slice(0, 5).map(review => ({
    ...review,
    // 게시글 내용 텍스트 길이 제한 (25자까지만 표시)
    shortContent:
      review.content.length > 25
        ? `${review.content.substring(0, 25)}...`
        : review.content,
  }));

  return (
    <div className="h-[340px] w-full rounded-lg bg-white p-2.5">
      <div className="flex h-full flex-col">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-gray-700">커뮤니티 영향력</h3>
        </div>

        <div className="mb-3 flex gap-2">
          <div className="flex-1 rounded-md bg-blue-50 p-2">
            <div className="flex items-center gap-1.5">
              <div className="rounded-full bg-blue-100 p-1.5">
                <ThumbsUp className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-600">
                  게시글당 좋아요
                </h3>
                <p className="text-xs font-medium text-blue-600">
                  {data.averageLikesPerReview.toFixed(1)}개
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-md bg-purple-50 p-2">
            <div className="flex items-center gap-1.5">
              <div className="rounded-full bg-purple-100 p-1.5">
                <Star className="h-3.5 w-3.5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-gray-600">
                  커뮤니티 기여도
                </h3>
                <p className="text-xs font-medium text-purple-600">
                  {data.communityContributionScore.toFixed(0)}점
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="mb-1.5 text-xs font-medium text-gray-600">
            인기 게시글
          </h4>

          {processedPopularPosts.length > 0 ? (
            <ul className="space-y-1.5">
              {processedPopularPosts.map((post, index) => (
                <li
                  key={post.id}
                  className="flex items-center justify-between rounded-md bg-gray-50 p-2"
                >
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium text-gray-700">
                      {index + 1}
                    </span>
                    <p className="truncate text-xs text-gray-700">
                      {post.shortContent}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 pl-1 text-xs whitespace-nowrap text-gray-500">
                    <ThumbsUp className="h-3 w-3 text-gray-500" />
                    <span className="font-medium text-gray-700">
                      {post.likes}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-xs text-gray-400">
                인기 게시글 데이터가 없습니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityInfluenceChart;
