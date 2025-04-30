import { useSuspenseQuery } from '@tanstack/react-query';
import { Hash, Library } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { LibraryCompositionResponse } from '@/apis/user/types';
import { getLibraryComposition } from '@/apis/user/user';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NoDataMessage, PrivateDataMessage } from '../common';

// 차트 색상
const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#ef4444', // red
  '#0ea5e9', // sky
];

interface LibraryCompositionChartProps {
  userId?: number;
}

const LibraryCompositionChart = ({ userId }: LibraryCompositionChartProps) => {
  const params = useParams<{ id: string }>();
  const id = userId || Number(params?.id || 0);
  const [activeTab, setActiveTab] = useState('libraries');
  const [selectedLibrary, setSelectedLibrary] = useState<string | null>(null);

  const { data } = useSuspenseQuery<LibraryCompositionResponse>({
    queryKey: ['libraryComposition', id],
    queryFn: () => getLibraryComposition(id),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic) {
    return <PrivateDataMessage message="이 통계는 비공개 설정되어 있습니다." />;
  }

  // 데이터가 없는 경우
  if (
    data.totalLibraries === 0 ||
    !data.booksPerLibrary ||
    data.booksPerLibrary.length === 0
  ) {
    return <NoDataMessage message="서재 구성 데이터가 없습니다." />;
  }

  // 서재 데이터 가공
  const libraryData = data.booksPerLibrary.map((item, index) => ({
    name: item.name,
    value: item.count,
    color: COLORS[index % COLORS.length],
  }));

  // 태그 데이터 가공
  const tagData =
    data.tagsDistribution.find(
      item => !selectedLibrary || item.library === selectedLibrary
    )?.tags || [];

  // 태그 데이터 정렬
  const sortedTagData = [...tagData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // 상위 10개만 표시

  return (
    <div className="h-[240px] w-full rounded-lg bg-gray-50 p-3">
      <div className="flex h-full flex-col">
        <div className="mb-2">
          <h3 className="text-base font-medium text-gray-700">서재 구성</h3>
          <p className="text-xs text-gray-500">
            총 서재 수: {data.totalLibraries}개
          </p>
        </div>

        <div className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsList className="mb-2">
              <TabsTrigger value="libraries">서재별 도서 수</TabsTrigger>
              <TabsTrigger value="tags">태그 분포</TabsTrigger>
            </TabsList>

            <TabsContent value="libraries" className="h-[calc(100%-40px)]">
              {libraryData.length > 0 ? (
                <div className="grid h-full grid-cols-[1fr_auto]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={libraryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        onClick={data => setSelectedLibrary(data.name)}
                      >
                        {libraryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke={
                              selectedLibrary === entry.name ? '#000' : 'none'
                            }
                            strokeWidth={selectedLibrary === entry.name ? 2 : 0}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`${value}권`, '도서 수']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="flex flex-col justify-center pr-1">
                    <div className="rounded-lg bg-blue-50 p-2">
                      <div className="flex items-center justify-center">
                        <div className="rounded-full bg-blue-100 p-1">
                          <Library className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <p className="mt-1 text-center text-xs text-blue-700">
                        클릭하여
                        <br />
                        서재 선택
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400">서재 데이터가 없습니다</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tags" className="h-[calc(100%-40px)]">
              {sortedTagData.length > 0 ? (
                <div className="h-full">
                  <p className="mb-2 text-center text-xs text-gray-500">
                    {selectedLibrary
                      ? `"${selectedLibrary}" 서재의 태그 분포`
                      : '모든 서재의 태그 분포'}
                  </p>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart
                      data={sortedTagData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis
                        dataKey="tag"
                        type="category"
                        width={80}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          `${value}개`,
                          '사용 횟수',
                        ]}
                      />
                      <Bar dataKey="count" name="사용 횟수" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : selectedLibrary ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <Hash className="mb-2 h-12 w-12 text-gray-300" />
                  <p className="text-gray-400">
                    "{selectedLibrary}" 서재에 태그가 없습니다
                  </p>
                  <button
                    className="mt-2 text-sm text-blue-500 hover:underline"
                    onClick={() => setSelectedLibrary(null)}
                  >
                    모든 서재 보기
                  </button>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400">태그 데이터가 없습니다</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LibraryCompositionChart;
