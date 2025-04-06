import { AreaChart, Book, BookOpen, Users } from 'lucide-react';

// 기본 통계 카드 컴포넌트
interface StatsCardProps {
  children: React.ReactNode;
  className?: string;
}

const StatsCard = ({ children, className = '' }: StatsCardProps) => (
  <div
    className={`rounded-xl border border-gray-200 bg-gray-50 p-5 ${className}`}
  >
    {children}
  </div>
);

// 통계 섹션에서 사용할 독서 통계 데이터
const readingStats = {
  // 독서량 통계
  books: {
    total: 156,
    thisYear: 42,
    thisMonth: 4,
    pages: 37824,
    hours: 631,
    avgPerMonth: 3.5,
  },
  // 장르별 독서 분포
  genres: [
    { name: '철학', count: 31, percentage: 20, color: '#93C5FD' }, // blue-300
    { name: '문학', count: 45, percentage: 29, color: '#F9A8D4' }, // pink-300
    { name: '역사', count: 28, percentage: 18, color: '#FCD34D' }, // amber-300
    { name: '사회학', count: 18, percentage: 11, color: '#6EE7B7' }, // green-300
    { name: '과학', count: 23, percentage: 15, color: '#C4B5FD' }, // violet-300
    { name: '기타', count: 11, percentage: 7, color: '#D1D5DB' }, // gray-300
  ],
  // 연도별 독서량
  yearlyTrend: [
    { year: 2019, count: 22 },
    { year: 2020, count: 35 },
    { year: 2021, count: 31 },
    { year: 2022, count: 26 },
    { year: 2023, count: 38 },
    { year: 2024, count: 4 },
  ],
  // 월별 독서량 (올해)
  monthlyTrend: [
    { month: '1월', count: 5 },
    { month: '2월', count: 3 },
    { month: '3월', count: 5 },
    { month: '4월', count: 4 },
  ],
  // 요일별 독서 패턴
  dayOfWeekPattern: [
    { day: '월', percentage: 10 },
    { day: '화', percentage: 12 },
    { day: '수', percentage: 8 },
    { day: '목', percentage: 15 },
    { day: '금', percentage: 14 },
    { day: '토', percentage: 21 },
    { day: '일', percentage: 20 },
  ],
  // 선호 작가
  favoriteAuthors: [
    {
      name: '플라톤',
      count: 4,
      books: ['소크라테스의 변명', '국가', '파이돈', '향연'],
    },
    {
      name: '아리스토텔레스',
      count: 3,
      books: ['니코마코스 윤리학', '정치학', '시학'],
    },
    { name: '몽테뉴', count: 3, books: ['수상록 1', '수상록 2', '수상록 3'] },
    {
      name: '니체',
      count: 3,
      books: ['차라투스트라는 이렇게 말했다', '도덕의 계보학', '선악의 저편'],
    },
    { name: '칸트', count: 2, books: ['순수이성비판', '실천이성비판'] },
  ],
  // 독서 목표 달성도
  goals: {
    yearly: { target: 50, current: 4, percentage: 8 },
    monthly: { target: 4, current: 4, percentage: 100 },
    pages: { target: 12000, current: 1042, percentage: 8.7 },
  },
  // 베스트셀러 독서 현황
  bestsellerStats: {
    read: 27,
    totalPercentage: 18,
    categories: [
      { category: '국내 문학', read: 8, total: 20, percentage: 40 },
      { category: '해외 문학', read: 12, total: 30, percentage: 40 },
      { category: '인문', read: 7, total: 50, percentage: 14 },
    ],
  },
  // 출판사별 통계
  publishers: [
    { name: '민음사', count: 14 },
    { name: '창비', count: 11 },
    { name: '문학동네', count: 9 },
    { name: '을유문화사', count: 8 },
    { name: '열린책들', count: 7 },
  ],
  // 책 물리적 정보 통계
  physical: {
    totalWeight: 78.2, // kg
    totalHeight: 423, // cm
    longestBook: { title: '로마제국 쇠망사', pages: 1328, weight: 1.2 },
    shortestBook: { title: '소크라테스의 변명', pages: 76, weight: 0.1 },
  },
  // 사용자 대비 독서량
  percentiles: {
    totalBooks: 87, // 상위 87%
    thisYear: 92, // 상위 92%
    philosophy: 95, // 철학 분야 상위 95%
  },
};

export default function ProfileStats() {
  return (
    <div className="space-y-6">
      {/* 상단 주요 통계 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <BookOpen className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">총 독서량</p>
              <p className="text-2xl font-bold text-gray-900">
                {readingStats.books.total}권
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-200 pt-4 text-center text-xs">
            <div>
              <p className="text-gray-500">올해</p>
              <p className="text-sm font-medium">
                {readingStats.books.thisYear}권
              </p>
            </div>
            <div>
              <p className="text-gray-500">이번 달</p>
              <p className="text-sm font-medium">
                {readingStats.books.thisMonth}권
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Book className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">총 페이지</p>
              <p className="text-2xl font-bold text-gray-900">
                {readingStats.books.pages.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-200 pt-4 text-center text-xs">
            <div>
              <p className="text-gray-500">읽은 시간</p>
              <p className="text-sm font-medium">
                {readingStats.books.hours}시간
              </p>
            </div>
            <div>
              <p className="text-gray-500">월평균</p>
              <p className="text-sm font-medium">
                {readingStats.books.avgPerMonth}권
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <Users className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">선호 작가</p>
              <p className="text-2xl font-bold text-gray-900">
                {readingStats.favoriteAuthors[0].name}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-200 pt-4 text-center text-xs">
            {readingStats.favoriteAuthors.slice(1, 4).map((author, idx) => (
              <div key={idx}>
                <p className="truncate text-gray-500">{author.name}</p>
                <p className="text-sm font-medium">{author.count}권</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <AreaChart className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">독서 목표</p>
              <p className="text-2xl font-bold text-gray-900">
                {readingStats.goals.yearly.percentage}%
              </p>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-gray-500">
                연간 목표 ({readingStats.goals.yearly.current}/
                {readingStats.goals.yearly.target}권)
              </span>
              <span className="font-medium">
                {readingStats.goals.yearly.percentage}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-300"
                style={{ width: `${readingStats.goals.yearly.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 장르별 독서 분포 & 연도별 트렌드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            장르별 독서 분포
          </h3>
          <div className="flex items-center justify-between">
            <div className="relative h-36 w-36">
              <div className="absolute inset-0 flex items-center justify-center rounded-full border-8 border-blue-300">
                <div className="absolute inset-2 rounded-full border-8 border-pink-300"></div>
                <div className="absolute inset-4 rounded-full border-8 border-amber-300"></div>
                <div className="absolute inset-6 rounded-full border-8 border-green-300"></div>
                <div className="absolute inset-8 rounded-full border-8 border-violet-300"></div>
                <div className="absolute inset-10 rounded-full border-4 border-gray-300"></div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 pl-4">
              {readingStats.genres.map((genre, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: genre.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{genre.name}</span>
                  </div>
                  <span className="text-sm font-medium">{genre.count}권</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            연도별 독서량
          </h3>
          <div className="h-64">
            <div className="flex h-full items-end justify-between gap-2">
              {readingStats.yearlyTrend.map((year, idx) => (
                <div key={idx} className="flex w-full flex-col items-center">
                  <div
                    className="w-full rounded-t-sm bg-blue-300"
                    style={{
                      height: `${(year.count / 40) * 100}%`,
                      opacity:
                        idx === readingStats.yearlyTrend.length - 1
                          ? 1
                          : 0.6 + idx * 0.1,
                    }}
                  ></div>
                  <p className="mt-2 text-xs text-gray-500">{year.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 현재 목표 & 독서 패턴 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            이번 달 독서 패턴
          </h3>
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-7 gap-1 text-center">
              {readingStats.dayOfWeekPattern.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className="mb-2 h-20 w-6 rounded bg-blue-300"
                    style={{ height: `${(day.percentage / 25) * 100}px` }}
                  ></div>
                  <p className="text-xs font-medium text-gray-500">{day.day}</p>
                </div>
              ))}
            </div>
            <div className="ml-4 flex-1">
              <div className="mb-4 rounded-lg bg-white p-3">
                <p className="text-sm text-gray-600">가장 많이 읽는 요일</p>
                <p className="text-lg font-bold text-gray-900">토요일 (21%)</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-sm text-gray-600">가장 많이 읽는 시간대</p>
                <p className="text-lg font-bold text-gray-900">
                  저녁 8시 ~ 10시
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            알라딘 베스트셀러 독서 현황
          </h3>
          <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-3">
            <p className="text-sm text-gray-600">베스트셀러 읽은 비율</p>
            <p className="text-lg font-bold text-gray-900">
              {readingStats.bestsellerStats.totalPercentage}%
            </p>
          </div>
          <div className="space-y-4">
            {readingStats.bestsellerStats.categories.map((category, idx) => (
              <div key={idx}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-500">
                    {category.category} ({category.read}/{category.total}권)
                  </span>
                  <span className="font-medium">{category.percentage}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-purple-300"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 독서 인사이트 */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <h3 className="mb-4 text-sm font-medium text-gray-700">
          독서 인사이트
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4">
            <h4 className="mb-1 text-sm font-medium text-gray-700">
              책 물리적 통계
            </h4>
            <div className="space-y-2 text-gray-600">
              <p className="text-xs">
                <span className="font-medium">총 무게:</span>{' '}
                {readingStats.physical.totalWeight}kg
              </p>
              <p className="text-xs">
                <span className="font-medium">쌓았을 때 높이:</span>{' '}
                {readingStats.physical.totalHeight}cm
              </p>
              <p className="text-xs">
                <span className="font-medium">가장 긴 책:</span>{' '}
                {readingStats.physical.longestBook.title} (
                {readingStats.physical.longestBook.pages}페이지)
              </p>
              <p className="text-xs">
                <span className="font-medium">가장 짧은 책:</span>{' '}
                {readingStats.physical.shortestBook.title} (
                {readingStats.physical.shortestBook.pages}페이지)
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4">
            <h4 className="mb-1 text-sm font-medium text-gray-700">
              자주 읽는 출판사
            </h4>
            <div className="space-y-2">
              {readingStats.publishers.map((publisher, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {publisher.name}
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    {publisher.count}권
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white p-4">
            <h4 className="mb-1 text-sm font-medium text-gray-700">
              다른 사용자 대비
            </h4>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-600">전체 독서량</span>
                  <span className="font-medium text-gray-700">
                    상위 {readingStats.percentiles.totalBooks}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-blue-300"
                    style={{ width: `${readingStats.percentiles.totalBooks}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-600">올해 독서량</span>
                  <span className="font-medium text-gray-700">
                    상위 {readingStats.percentiles.thisYear}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-green-300"
                    style={{ width: `${readingStats.percentiles.thisYear}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-600">철학 분야</span>
                  <span className="font-medium text-gray-700">
                    상위 {readingStats.percentiles.philosophy}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-purple-300"
                    style={{ width: `${readingStats.percentiles.philosophy}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
