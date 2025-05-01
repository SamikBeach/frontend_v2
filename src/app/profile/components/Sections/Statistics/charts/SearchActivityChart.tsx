import { useSuspenseQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
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

import { SearchActivityResponse } from '@/apis/user/types';
import { getSearchActivity } from '@/apis/user/user';
import { NoDataMessage, PrivateDataMessage } from '../common';

interface SearchActivityChartProps {
  userId?: number;
}

const SearchActivityChart = ({ userId }: SearchActivityChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);

  const { data } = useSuspenseQuery<SearchActivityResponse>({
    queryKey: ['searchActivity', id],
    queryFn: () => getSearchActivity(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return <PrivateDataMessage message="이 통계는 비공개 설정되어 있습니다." />;
  }

  // 데이터가 없는 경우
  if (
    data.searchCount === 0 ||
    !data.topSearchTerms ||
    data.topSearchTerms.length === 0
  ) {
    return <NoDataMessage message="검색 활동 데이터가 없습니다." />;
  }

  // 상위 검색어 데이터 정렬 (높은 빈도순)
  const sortedSearchTerms = [...data.topSearchTerms]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // 상위 10개만 표시

  return (
    <div className="h-[240px] w-full rounded-lg bg-gray-50 p-3">
      <div className="flex h-full flex-col">
        <div className="mb-2">
          <h3 className="text-base font-medium text-gray-700">검색 활동</h3>
          <p className="text-xs text-gray-500">
            총 검색 횟수: {data.searchCount}회
            {data.searchPattern && ` | 검색 패턴: ${data.searchPattern}`}
          </p>
        </div>

        <div className="flex-1">
          <div className="grid h-full grid-rows-[auto_1fr]">
            <div className="mb-3 rounded-lg bg-indigo-50 p-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-indigo-100 p-2">
                  <Search className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base font-medium">자주 검색하는 키워드</h3>
                  <p className="text-sm font-bold text-indigo-600">
                    {sortedSearchTerms[0]?.term || '데이터 없음'}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-full">
              {sortedSearchTerms.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedSearchTerms}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="term"
                      type="category"
                      width={50}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}회`, '검색 횟수']}
                    />
                    <Bar dataKey="count" name="검색 횟수" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400">검색어 데이터가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchActivityChart;
