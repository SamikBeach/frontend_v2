import { useSuspenseQuery } from '@tanstack/react-query';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { GenreAnalysisResponse } from '@/apis/user/types';
import { getGenreAnalysis } from '@/apis/user/user';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { ChartContainer, PrivateDataMessage } from '../components';
import { PrivacyToggle } from '../components/PrivacyToggle';
import { PASTEL_COLORS } from '../constants';
import { useStatisticsSettings } from '../hooks/useStatisticsSettings';
import {
  CustomLegendProps,
  CustomTooltipProps,
  PieChartLabelProps,
} from '../utils/chartFormatters';

interface GenreAnalysisChartProps {
  userId: number;
}

// 카테고리 데이터 타입
interface CategoryData {
  category: string;
  count: number;
  color?: string;
  percent?: number;
}

// 서브카테고리 데이터 타입
interface SubCategoryData {
  subCategory: string;
  count: number;
  color?: string;
  percent?: number;
}

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CategoryData | SubCategoryData;
    const category = 'category' in data ? data.category : data.subCategory;

    return (
      <div className="rounded-md border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-gray-800">{category || label}</p>
        <div className="mt-1">
          <p className="text-xs font-semibold text-gray-700">
            {`${payload[0].value}권`}
          </p>
          {data.percent && (
            <p className="text-xs text-gray-500">
              {`전체의 ${(data.percent * 100).toFixed(1)}%`}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// 커스텀 범례 렌더 컴포넌트
const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload) return null;

  return (
    <ul className="flex flex-col gap-1.5 pl-2">
      {payload.map((entry, index) => (
        <li key={`legend-${index}`} className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 flex-shrink-0 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="max-w-[120px] truncate text-xs text-gray-700">
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );
};

const GenreAnalysisChart = ({ userId }: GenreAnalysisChartProps) => {
  const CHART_TITLE = '장르';

  const currentUser = useCurrentUser();
  const isMyProfile = currentUser?.id === userId;
  const { settings, handleUpdateSetting, isUpdating } = isMyProfile
    ? useStatisticsSettings(userId)
    : { settings: null, handleUpdateSetting: () => {}, isUpdating: false };

  const { data, isLoading } = useSuspenseQuery<GenreAnalysisResponse>({
    queryKey: ['genreAnalysis', userId],
    queryFn: () => getGenreAnalysis(userId),
  });

  // 데이터가 비공개인 경우
  if (!data.isPublic && !isMyProfile) {
    return (
      <PrivateDataMessage
        message="이 통계는 비공개 설정되어 있습니다."
        title={CHART_TITLE}
      />
    );
  }

  // 공개/비공개 토글 핸들러
  const handlePrivacyToggle = (isPublic: boolean) => {
    handleUpdateSetting('isGenreAnalysisPublic', isPublic);
  };

  // 설정 로딩 중 또는 설정 업데이트 중인지 확인
  const showLoading = isLoading || isUpdating || (isMyProfile && !settings);

  // 전체 기간 데이터 사용
  const categoryData = data.categoryCounts || [];
  const subCategoryData = data.subCategoryCounts || [];

  // 항상 기본적인 데이터 준비 (데이터가 없는 경우도 차트 표시용)
  const defaultCategories: CategoryData[] = [
    { category: '미분류', count: 0 },
    { category: '소설', count: 0 },
    { category: '인문학', count: 0 },
    { category: '경제/경영', count: 0 },
    { category: '자기계발', count: 0 },
  ];

  const defaultSubCategories: SubCategoryData[] = [
    { subCategory: '미분류', count: 0 },
    { subCategory: '한국소설', count: 0 },
    { subCategory: '외국소설', count: 0 },
    { subCategory: '심리학', count: 0 },
    { subCategory: '에세이', count: 0 },
  ];

  // 데이터가 없거나 빈 배열인 경우 기본 데이터로 대체
  const finalCategoryData =
    !categoryData || categoryData.length === 0
      ? [...defaultCategories]
      : categoryData;

  const finalSubCategoryData =
    !subCategoryData || subCategoryData.length === 0
      ? [...defaultSubCategories]
      : subCategoryData;

  // 카테고리 데이터 가공 (총 합계 계산)
  const totalCategoryCount = finalCategoryData.reduce(
    (sum: number, item: CategoryData) => sum + item.count,
    0
  );

  // 상위 5개 카테고리 데이터 추출 및 가공
  let topCategories = [...finalCategoryData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      color: PASTEL_COLORS[index % PASTEL_COLORS.length],
      percent:
        totalCategoryCount > 0
          ? item.count / totalCategoryCount
          : index === 0
            ? 1
            : 0, // 총합이 0인 경우 첫 항목만 100% 표시
    }));

  // 최소 5개 항목 보장
  if (topCategories.length < 5) {
    // 이미 있는 카테고리명 필터링
    const existingCategories = new Set(
      topCategories.map(item => item.category)
    );
    const additionalCategories = defaultCategories
      .filter(item => !existingCategories.has(item.category))
      .slice(0, 5 - topCategories.length)
      .map((item, index) => ({
        ...item,
        color:
          PASTEL_COLORS[(topCategories.length + index) % PASTEL_COLORS.length],
        percent: 0,
      }));

    topCategories = [...topCategories, ...additionalCategories];
  }

  // 서브카테고리 데이터 가공 (총 합계 계산)
  const totalSubCategoryCount = finalSubCategoryData.reduce(
    (sum: number, item: SubCategoryData) => sum + item.count,
    0
  );

  // 상위 5개 서브카테고리 데이터 추출 및 가공
  let topSubCategories = [...finalSubCategoryData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      color: PASTEL_COLORS[index % PASTEL_COLORS.length],
      percent:
        totalSubCategoryCount > 0
          ? item.count / totalSubCategoryCount
          : index === 0
            ? 1
            : 0, // 총합이 0인 경우 첫 항목만 100% 표시
    }));

  // 최소 5개 항목 보장
  if (topSubCategories.length < 5) {
    // 이미 있는 서브카테고리명 필터링
    const existingSubCategories = new Set(
      topSubCategories.map(item => item.subCategory)
    );
    const additionalSubCategories = defaultSubCategories
      .filter(item => !existingSubCategories.has(item.subCategory))
      .slice(0, 5 - topSubCategories.length)
      .map((item, index) => ({
        ...item,
        color:
          PASTEL_COLORS[
            (topSubCategories.length + index) % PASTEL_COLORS.length
          ],
        percent: 0,
      }));

    topSubCategories = [...topSubCategories, ...additionalSubCategories];
  }

  // 파이 차트 라벨 렌더링 함수
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius: _,
    outerRadius,
    percent,
    value,
  }: PieChartLabelProps) => {
    // 값이 0이거나 비율이 너무 작은 경우 레이블 숨김
    if (value === 0 || percent < 0.08) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 0.75;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#4b5563"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={11}
        fontWeight="normal"
        stroke="#ffffff"
        strokeWidth={0.5}
        paintOrder="stroke"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ChartContainer>
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:min-w-[120px]">
          <h3 className="text-base font-medium text-gray-700">{CHART_TITLE}</h3>
          {isMyProfile && (
            <div className="sm:hidden">
              <PrivacyToggle
                isPublic={settings?.isGenreAnalysisPublic || false}
                isLoading={showLoading}
                onToggle={handlePrivacyToggle}
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isMyProfile && (
            <div className="hidden sm:block">
              <PrivacyToggle
                isPublic={settings?.isGenreAnalysisPublic || false}
                isLoading={showLoading}
                onToggle={handlePrivacyToggle}
              />
            </div>
          )}
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="flex h-[280px] flex-col items-center md:flex-row">
        <div className="flex h-full w-full flex-col gap-4 md:flex-row">
          {/* 카테고리 차트 */}
          <div className="relative h-full w-full md:w-1/2 md:pr-4">
            {/* 카테고리 차트 타이틀 */}
            <div className="absolute top-0 right-0 left-0 z-10 text-center md:top-12">
              <span className="text-sm text-gray-600">카테고리</span>
            </div>

            {totalCategoryCount === 0 && (
              <div className="pointer-events-none absolute inset-0 top-10 z-10 flex items-center justify-center">
                <p className="rounded bg-white/80 px-2 py-1 text-xs text-gray-400">
                  데이터가 없습니다
                </p>
              </div>
            )}
            <div className="flex h-[160px] items-center justify-center md:h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ left: -40 }}>
                  <Pie
                    data={topCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={55}
                    innerRadius={25}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="category"
                    paddingAngle={2}
                  >
                    {topCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    wrapperStyle={{ zIndex: 20 }}
                  />
                  <Legend
                    content={<CustomLegend />}
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    wrapperStyle={{ right: 30 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 세부 장르 차트 */}
          <div className="relative h-full w-full md:w-1/2 md:pl-4">
            {/* 세부 장르 차트 타이틀 */}
            <div className="absolute top-0 right-0 left-0 z-10 text-center md:top-12">
              <span className="text-sm text-gray-600">세부 장르</span>
            </div>

            {totalSubCategoryCount === 0 && (
              <div className="pointer-events-none absolute inset-0 top-10 z-10 flex items-center justify-center">
                <p className="rounded bg-white/80 px-2 py-1 text-xs text-gray-400">
                  데이터가 없습니다
                </p>
              </div>
            )}
            <div className="flex h-[160px] items-center justify-center md:h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ left: -40 }}>
                  <Pie
                    data={topSubCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={55}
                    innerRadius={25}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="subCategory"
                    paddingAngle={2}
                  >
                    {topSubCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    wrapperStyle={{ zIndex: 20 }}
                  />
                  <Legend
                    content={<CustomLegend />}
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    wrapperStyle={{ right: 30 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 주요 카테고리 정보 */}
      {(() => {
        // 가장 많이 읽은 카테고리 계산
        const mostReadCategory =
          finalCategoryData.length > 0
            ? finalCategoryData.reduce((prev, current) =>
                prev.count > current.count ? prev : current
              )?.category
            : null;

        return mostReadCategory && totalCategoryCount > 0 ? (
          <div className="mt-16 md:mt-[-50px]">
            <div className="mx-auto max-w-[200px] rounded-md bg-gray-50 px-3 py-1.5">
              <p className="text-center text-sm font-medium text-gray-600">
                주요 카테고리:{' '}
                <span className="text-blue-600">{mostReadCategory}</span>
              </p>
            </div>
          </div>
        ) : null;
      })()}
    </ChartContainer>
  );
};

export default GenreAnalysisChart;
