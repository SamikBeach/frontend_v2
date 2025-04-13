import { AreaChart, Book, BookOpen, Users } from 'lucide-react';

// 기본 통계 카드 컴포넌트
interface StatsCardProps {
  children: React.ReactNode;
  className?: string;
}

const StatsCard = ({ children, className = '' }: StatsCardProps) => (
  <div className={`rounded-xl bg-gray-50 p-5 ${className}`}>{children}</div>
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
    avgPagesPerBook: 242, // 평균 페이지 수
    avgReadingTimePerBook: 4.0, // 평균 독서 시간(시간)
    longestReadingStreak: 14, // 최장 연속 독서일
    currentReadingStreak: 3, // 현재 연속 독서일
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
  // 가격 통계 (새로 추가)
  priceStats: {
    totalSpent: 2876000, // 총 지출액(원)
    avgPrice: 18400, // 평균 도서 가격(원)
    mostExpensive: { title: '서양철학사', price: 45000 }, // 가장 비싼 책
    cheapest: { title: '소나기', price: 8000 }, // 가장 저렴한 책
    savedByUsed: 512000, // 중고책으로 절약한 금액(원)
    percentUsedBooks: 28, // 중고책 구매 비율(%)
  },
  // 언어별 통계 (새로 추가)
  languageStats: [
    { language: '한국어', count: 112, percentage: 72 },
    { language: '영어', count: 31, percentage: 20 },
    { language: '일본어', count: 8, percentage: 5 },
    { language: '프랑스어', count: 3, percentage: 2 },
    { language: '기타', count: 2, percentage: 1 },
  ],
  // 출판년도 통계 (새로 추가)
  publicationYearStats: {
    oldest: { title: '햄릿', year: 1603, publisher: '펭귄클래식' },
    newest: { title: '2024 트렌드', year: 2024, publisher: '미래의창' },
    distribution: [
      { range: '2020-현재', count: 45, percentage: 29 },
      { range: '2010-2019', count: 62, percentage: 40 },
      { range: '2000-2009', count: 28, percentage: 18 },
      { range: '1900-1999', count: 15, percentage: 9 },
      { range: '1900년 이전', count: 6, percentage: 4 },
    ],
  },
  // 평점 통계 (새로 추가)
  ratingStats: {
    avgRating: 4.2, // 평균 평점 (5점 만점)
    ratingDistribution: [
      { stars: 5, count: 48, percentage: 31 },
      { stars: 4, count: 63, percentage: 40 },
      { stars: 3, count: 32, percentage: 21 },
      { stars: 2, count: 10, percentage: 6 },
      { stars: 1, count: 3, percentage: 2 },
    ],
    highestRated: [
      { title: '사피엔스', author: '유발 하라리', rating: 5 },
      { title: '파이돈', author: '플라톤', rating: 5 },
      { title: '데미안', author: '헤르만 헤세', rating: 5 },
    ],
  },
  // 독서 속도 통계 (새로 추가)
  readingSpeedStats: {
    avgPagesPerHour: 60, // 시간당 평균 페이지
    fastestRead: { title: '동물농장', author: '조지 오웰', pagesPerHour: 85 },
    slowestRead: {
      title: '순수이성비판',
      author: '임마누엘 칸트',
      pagesPerHour: 22,
    },
    totalReadingDays: 238, // 올해 독서한 총 일수
  },
  // ISBN 기반 지표 (새로 추가)
  isbnStats: {
    koreanBooks: 112, // 국내 도서 (ISBN 978-89로 시작)
    foreignBooks: 44, // 해외 도서
    oldestIsbn: { title: '존재와 시간', isbn: '8937460440', year: 1995 },
    newestIsbn: { title: '코스모스', isbn: '9791130682587', year: 2023 },
  },
  // 계절별 독서량 (새로 추가)
  seasonalReading: {
    spring: { count: 42, percentage: 27 },
    summer: { count: 38, percentage: 24 },
    fall: { count: 45, percentage: 29 },
    winter: { count: 31, percentage: 20 },
    favoriteMonth: { name: '10월', count: 18 },
    leastActiveMonth: { name: '7월', count: 6 },
  },
  // 획득한 독서 배지 (새로 추가)
  readingBadges: [
    {
      name: '철학 탐구가',
      description: '철학 분야 도서 30권 이상 읽음',
      date: '2023-11-15',
      level: 3,
    },
    {
      name: '문학의 바다',
      description: '문학 분야 도서 40권 이상 읽음',
      date: '2023-09-22',
      level: 4,
    },
    {
      name: '역사 수집가',
      description: '역사 분야 도서 25권 이상 읽음',
      date: '2023-12-03',
      level: 2,
    },
    {
      name: '독서 마라토너',
      description: '연속 14일 이상 독서',
      date: '2023-08-12',
      level: 1,
    },
    {
      name: '지식의 탑',
      description: '총 100권 이상 읽음',
      date: '2023-05-18',
      level: 3,
    },
  ],
  // 배지 목표 데이터 (새로 추가)
  badgeGoals: {
    currentGoal: {
      name: '과학 탐험가',
      description: '과학 분야 도서 30권 읽기',
      progress: 20, // 현재 20권 읽음
      target: 30, // 목표 30권
      percentage: 67, // 진행률
      remaining: 10, // 남은 책 수
    },
    nextGoals: [
      {
        name: '사회학 관찰자',
        description: '사회학 분야 도서 20권 읽기',
        current: 11,
        target: 20,
        percentage: 55,
      },
      {
        name: '독서 달인',
        description: '200권 이상 읽기',
        current: 156,
        target: 200,
        percentage: 78,
      },
    ],
  },
  // 독서 시간대 통계 (새로 추가)
  readingTimeStats: [
    { time: '아침 (6-9시)', percentage: 15, avgPages: 23 },
    { time: '오전 (9-12시)', percentage: 12, avgPages: 18 },
    { time: '오후 (12-18시)', percentage: 24, avgPages: 33 },
    { time: '저녁 (18-22시)', percentage: 35, avgPages: 45 },
    { time: '밤 (22-6시)', percentage: 14, avgPages: 21 },
  ],
  // 장소별 독서 통계 (새로 추가)
  readingLocationStats: [
    { location: '집', percentage: 62 },
    { location: '카페', percentage: 15 },
    { location: '대중교통', percentage: 12 },
    { location: '도서관', percentage: 8 },
    { location: '기타', percentage: 3 },
  ],
  // 도서 진행 상태 (새로 추가)
  bookProgressStats: {
    completed: { count: 142, percentage: 91 },
    inProgress: { count: 8, percentage: 5 },
    abandoned: { count: 6, percentage: 4 },
    dnf: { title: '수학의 정석', reason: '난이도가 너무 높음', progress: 28 },
    longestToFinish: { title: '전쟁과 평화', days: 45 },
    quickestToFinish: { title: '어린 왕자', days: 1 },
    currentlyReading: [
      {
        title: '총, 균, 쇠',
        author: '재레드 다이아몬드',
        progress: 42,
        lastRead: '2024-04-15',
      },
      {
        title: '사피엔스',
        author: '유발 하라리',
        progress: 75,
        lastRead: '2024-04-14',
      },
      {
        title: '코스모스',
        author: '칼 세이건',
        progress: 31,
        lastRead: '2024-04-13',
      },
    ],
    abandonedBooks: [
      { title: '수학의 정석', reason: '난이도가 너무 높음', progress: 28 },
      { title: '존재와 무', reason: '내용이 난해함', progress: 15 },
      { title: '오디세이', reason: '다른 책으로 관심 전환', progress: 52 },
    ],
    completionTimes: {
      avg: 12, // 평균 완독 일수
      fastest: { title: '어린 왕자', days: 1 },
      slowest: { title: '전쟁과 평화', days: 45 },
    },
  },
  // 소셜 독서 통계 (새로 추가)
  socialReadingStats: {
    friendsBooks: 824,
    commonReads: 63,
    recommendations: { given: 48, received: 37, adopted: 22 },
    topRecommender: { name: '김철수', books: 12, adopted: 8 },
    discussedBooks: [
      { title: '사피엔스', comments: 28, participants: 14 },
      { title: '팩트풀니스', comments: 17, participants: 9 },
      { title: '아몬드', comments: 15, participants: 11 },
    ],
    bookclubActivity: {
      totalClubs: 3,
      activeMembership: 2,
      booksReadInClubs: 16,
      mostActiveClub: { name: '지적 대화를 위한 모임', books: 8, meetings: 24 },
    },
    friendReadingPatterns: {
      mostSimilar: {
        name: '이민수',
        similarity: 82,
        commonGenres: ['철학', '문학'],
      },
      mostDifferent: {
        name: '박지영',
        similarity: 24,
        uniqueGenres: ['경제', '자기계발'],
      },
    },
  },
};

export default function ProfileStats() {
  return (
    <div className="space-y-6">
      {/* 상단 주요 통계 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="rounded-xl bg-gray-50 p-5">
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

        <div className="rounded-xl bg-gray-50 p-5">
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

        <div className="rounded-xl bg-gray-50 p-5">
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

        <div className="rounded-xl bg-gray-50 p-5">
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

      {/* 독서 속도 및 독서 스트릭 통계 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">독서 속도</h3>
          <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-3">
            <p className="text-sm text-gray-600">시간당 평균 페이지</p>
            <p className="text-lg font-bold text-gray-900">
              {readingStats.readingSpeedStats.avgPagesPerHour} 페이지
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-600">가장 빠르게 읽은 책</p>
              <p className="text-sm font-medium text-gray-900">
                {readingStats.readingSpeedStats.fastestRead.title}
                <span className="block text-xs text-gray-500">
                  시간당{' '}
                  {readingStats.readingSpeedStats.fastestRead.pagesPerHour}{' '}
                  페이지
                </span>
              </p>
            </div>

            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-600">가장 천천히 읽은 책</p>
              <p className="text-sm font-medium text-gray-900">
                {readingStats.readingSpeedStats.slowestRead.title}
                <span className="block text-xs text-gray-500">
                  시간당{' '}
                  {readingStats.readingSpeedStats.slowestRead.pagesPerHour}{' '}
                  페이지
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            독서 스트릭
          </h3>
          <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-3">
            <p className="text-sm text-gray-600">최장 연속 독서</p>
            <p className="text-lg font-bold text-gray-900">
              {readingStats.books.longestReadingStreak}일
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-600">현재 연속 독서</p>
              <div className="mt-1 flex items-center">
                <p className="mr-2 text-sm font-medium text-gray-900">
                  {readingStats.books.currentReadingStreak}일
                </p>
                {readingStats.books.currentReadingStreak >= 3 && (
                  <div className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                    연속 달성 중!
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-600">올해 독서한 날</p>
              <p className="text-sm font-medium text-gray-900">
                {readingStats.readingSpeedStats.totalReadingDays}일
                <span className="block text-xs text-gray-500">
                  (전체 일수의{' '}
                  {Math.round(
                    (readingStats.readingSpeedStats.totalReadingDays / 365) *
                      100
                  )}
                  %)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 장르별 독서 분포 & 연도별 트렌드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-5">
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

        <div className="rounded-xl bg-gray-50 p-5">
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
        <div className="rounded-xl bg-gray-50 p-5">
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

        <div className="rounded-xl bg-gray-50 p-5">
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

      {/* 언어 및 출판년도 통계 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            언어별 독서 분포
          </h3>
          <div className="flex items-center justify-between">
            <div className="relative h-36 w-36">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                {readingStats.languageStats.map((item, index) => {
                  // 시작 각도 계산
                  const prevTotal = readingStats.languageStats
                    .slice(0, index)
                    .reduce((acc, curr) => acc + curr.percentage, 0);

                  const startAngle = (prevTotal / 100) * 360;
                  const endAngle = startAngle + (item.percentage / 100) * 360;

                  // SVG 패스 계산
                  const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

                  // 파이 차트 조각을 위한 플래그 (180도 이상일 경우)
                  const largeArcFlag = item.percentage > 50 ? 1 : 0;

                  // 색상 배열
                  const colors = [
                    '#93C5FD',
                    '#F9A8D4',
                    '#FCD34D',
                    '#6EE7B7',
                    '#C4B5FD',
                    '#D1D5DB',
                  ];

                  return (
                    <path
                      key={index}
                      d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={colors[index % colors.length]}
                    />
                  );
                })}
              </svg>
            </div>
            <div className="flex flex-1 flex-col gap-2 pl-4">
              {readingStats.languageStats.map((lang, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: [
                          '#93C5FD',
                          '#F9A8D4',
                          '#FCD34D',
                          '#6EE7B7',
                          '#C4B5FD',
                          '#D1D5DB',
                        ][idx % 6],
                      }}
                    ></div>
                    <span className="text-sm text-gray-700">
                      {lang.language}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{lang.count}권</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            출판년도 분포
          </h3>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">가장 오래된 책</p>
              <p className="text-sm font-medium text-gray-900">
                {readingStats.publicationYearStats.oldest.title}
                <span className="ml-1 text-xs font-normal text-gray-500">
                  ({readingStats.publicationYearStats.oldest.year})
                </span>
              </p>
            </div>
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">가장 최근 책</p>
              <p className="text-sm font-medium text-gray-900">
                {readingStats.publicationYearStats.newest.title}
                <span className="ml-1 text-xs font-normal text-gray-500">
                  ({readingStats.publicationYearStats.newest.year})
                </span>
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {readingStats.publicationYearStats.distribution.map((item, idx) => (
              <div key={idx}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-500">{item.range}</span>
                  <span className="font-medium">{item.count}권</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-amber-300"
                    style={{
                      width: `${item.percentage}%`,
                      opacity: 0.6 + idx * 0.1,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 가격 통계 및 평점 통계 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">가격 통계</h3>

          <div className="mb-4 flex flex-col space-y-3">
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">총 지출액</p>
              <p className="text-lg font-medium text-gray-900">
                {readingStats.priceStats.totalSpent.toLocaleString()}원
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-gray-500">평균 도서 가격</p>
                <p className="text-sm font-medium text-gray-900">
                  {readingStats.priceStats.avgPrice.toLocaleString()}원
                </p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-gray-500">중고책 절약액</p>
                <p className="text-sm font-medium text-gray-900">
                  {readingStats.priceStats.savedByUsed.toLocaleString()}원
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-gray-500">가장 비싼 책</p>
                <p className="text-sm font-medium text-gray-900">
                  {readingStats.priceStats.mostExpensive.title}
                  <span className="block text-xs text-gray-500">
                    {readingStats.priceStats.mostExpensive.price.toLocaleString()}
                    원
                  </span>
                </p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-gray-500">중고책 비율</p>
                <p className="text-sm font-medium text-gray-900">
                  {readingStats.priceStats.percentUsedBooks}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">평점 통계</h3>

          <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-3">
            <p className="text-sm text-gray-600">평균 평점</p>
            <div className="flex items-center">
              <p className="mr-2 text-lg font-bold text-gray-900">
                {readingStats.ratingStats.avgRating.toFixed(1)}
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(readingStats.ratingStats.avgRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-300 text-gray-300'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {readingStats.ratingStats.ratingDistribution
              .sort((a, b) => b.stars - a.stars)
              .map((rating, idx) => (
                <div key={idx}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      <span className="text-gray-700">{rating.stars}점</span>
                      <div className="ml-1 flex">
                        {Array(rating.stars)
                          .fill(0)
                          .map((_, i) => (
                            <svg
                              key={i}
                              className="h-3 w-3 fill-yellow-400 text-yellow-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                      </div>
                    </div>
                    <span className="font-medium">{rating.count}권</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-yellow-300"
                      style={{ width: `${rating.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 독서 배지 및 장소별 통계 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            획득한 독서 배지
          </h3>

          <div className="space-y-3">
            {readingStats.readingBadges.map((badge, idx) => (
              <div key={idx} className="rounded-lg bg-white p-3">
                <div className="flex items-center">
                  <div className="relative mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#93C5FD ${badge.level * 25}%, transparent 0%)`,
                      }}
                    ></div>
                    <div className="absolute inset-1 flex items-center justify-center rounded-full bg-white">
                      <span className="text-xs font-bold">{badge.level}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {badge.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(badge.date).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-lg bg-blue-50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-blue-700">다음 목표</p>
              <p className="text-xs text-blue-700">50% 달성</p>
            </div>
            <p className="mt-1 text-xs text-blue-600">
              과학 분야 도서 10권 더 읽기
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: '50%' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            장소별 독서 통계
          </h3>

          <div className="mb-4">
            <div className="grid grid-cols-4 gap-2">
              {readingStats.readingLocationStats.map((item, idx) => (
                <div key={idx} className="relative flex flex-col items-center">
                  <div className="relative mb-2 h-16 w-16 overflow-hidden">
                    <div
                      className="absolute bottom-0 w-full rounded-lg bg-blue-200"
                      style={{
                        height: `${(item.percentage / 70) * 100}%`,
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-sm font-bold text-gray-700">
                        {item.percentage}%
                      </p>
                    </div>
                  </div>
                  <p className="text-center text-xs text-gray-500">
                    {item.location}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">가장 많이 읽는 장소</p>
              <p className="text-sm font-medium text-gray-900">집 (62%)</p>
              <div className="mt-1 text-xs text-gray-500">
                집에서 가장 많은 독서를 하며, 대부분 저녁과 주말에 집중되어
                있습니다.
              </div>
            </div>

            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">대중교통에서 읽는 책 유형</p>
              <div className="mt-1 text-xs text-gray-500">
                대중교통에서는 주로 짧은 에세이나 소설을 읽는 경향이 있으며,
                1회당 평균 15페이지를 읽습니다.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 도서 진행 상태 및 소셜 독서 통계 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            도서 진행 상태
          </h3>

          <div className="mb-4">
            <div className="relative h-32 w-full overflow-hidden rounded-lg bg-white p-3">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-gray-500">
                  읽은 책 vs 읽는 중 vs 포기한 책
                </span>
              </div>

              <div className="relative mt-4 h-6 w-full rounded-full bg-gray-100">
                <div
                  className="absolute top-0 left-0 h-full rounded-l-full bg-green-300"
                  style={{
                    width: `${readingStats.bookProgressStats.completed.percentage}%`,
                  }}
                ></div>
                <div
                  className="absolute top-0 h-full bg-yellow-300"
                  style={{
                    left: `${readingStats.bookProgressStats.completed.percentage}%`,
                    width: `${readingStats.bookProgressStats.inProgress.percentage}%`,
                  }}
                ></div>
                <div
                  className="absolute top-0 right-0 h-full rounded-r-full bg-red-300"
                  style={{
                    width: `${readingStats.bookProgressStats.abandoned.percentage}%`,
                  }}
                ></div>
              </div>

              <div className="mt-3 flex justify-between px-2 text-xs">
                <div className="flex flex-col items-center">
                  <span className="font-medium text-gray-700">
                    {readingStats.bookProgressStats.completed.percentage}%
                  </span>
                  <span className="text-gray-500">완독</span>
                  <span className="text-gray-500">
                    {readingStats.bookProgressStats.completed.count}권
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-medium text-gray-700">
                    {readingStats.bookProgressStats.inProgress.percentage}%
                  </span>
                  <span className="text-gray-500">읽는 중</span>
                  <span className="text-gray-500">
                    {readingStats.bookProgressStats.inProgress.count}권
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-medium text-gray-700">
                    {readingStats.bookProgressStats.abandoned.percentage}%
                  </span>
                  <span className="text-gray-500">포기</span>
                  <span className="text-gray-500">
                    {readingStats.bookProgressStats.abandoned.count}권
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">가장 오래 읽은 책</p>
              <p className="text-sm font-medium text-gray-900">
                {readingStats.bookProgressStats.longestToFinish.title}
                <span className="block text-xs text-gray-500">
                  {readingStats.bookProgressStats.longestToFinish.days}일 소요
                </span>
              </p>
            </div>
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">가장 빨리 읽은 책</p>
              <p className="text-sm font-medium text-gray-900">
                {readingStats.bookProgressStats.quickestToFinish.title}
                <span className="block text-xs text-gray-500">
                  {readingStats.bookProgressStats.quickestToFinish.days}일 소요
                </span>
              </p>
            </div>

            <div className="col-span-2 rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">포기한 책</p>
              <p className="text-sm font-medium text-gray-900">
                {readingStats.bookProgressStats.dnf.title}
              </p>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {readingStats.bookProgressStats.dnf.reason}
                </span>
                <span className="font-medium text-gray-700">
                  {readingStats.bookProgressStats.dnf.progress}% 진행
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-red-300"
                  style={{
                    width: `${readingStats.bookProgressStats.dnf.progress}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            소셜 독서 통계
          </h3>

          <div className="mb-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-white p-3">
              <p className="text-xl font-bold text-gray-900">
                {readingStats.socialReadingStats.friendsBooks}
              </p>
              <p className="text-xs text-gray-500">친구들의 서재 총합</p>
            </div>
            <div className="rounded-lg bg-white p-3">
              <p className="text-xl font-bold text-gray-900">
                {readingStats.socialReadingStats.commonReads}
              </p>
              <p className="text-xs text-gray-500">공통 독서</p>
            </div>
            <div className="rounded-lg bg-white p-3">
              <p className="text-xl font-bold text-gray-900">
                {readingStats.socialReadingStats.recommendations.given}
              </p>
              <p className="text-xs text-gray-500">나의 추천</p>
            </div>
          </div>

          <div className="mb-3 rounded-lg bg-white p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">최다 추천인</p>
                <p className="text-sm font-medium text-gray-900">
                  {readingStats.socialReadingStats.topRecommender.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {readingStats.socialReadingStats.topRecommender.books}권 추천
                  / {readingStats.socialReadingStats.topRecommender.adopted}권
                  읽음
                </p>
                <p className="text-xs font-medium text-green-700">
                  채택률{' '}
                  {Math.round(
                    (readingStats.socialReadingStats.topRecommender.adopted /
                      readingStats.socialReadingStats.topRecommender.books) *
                      100
                  )}
                  %
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-gray-700">
              가장 활발한 토론 도서
            </p>
            <div className="space-y-2">
              {readingStats.socialReadingStats.discussedBooks.map(
                (book, idx) => (
                  <div key={idx} className="rounded-lg bg-white p-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {book.title}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-2">{book.comments}개 댓글</span>
                        <span>{book.participants}명 참여</span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 독서 인사이트 */}
      <div className="rounded-xl bg-gray-50 p-5">
        <h3 className="mb-4 text-sm font-medium text-gray-700">
          독서 인사이트
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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

          <div className="rounded-lg bg-white p-4">
            <h4 className="mb-1 text-sm font-medium text-gray-700">
              ISBN 통계
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">국내 도서</span>
                <span className="text-xs font-medium text-gray-700">
                  {readingStats.isbnStats.koreanBooks}권
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">해외 도서</span>
                <span className="text-xs font-medium text-gray-700">
                  {readingStats.isbnStats.foreignBooks}권
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <p className="mb-0.5 font-medium">오래된 ISBN</p>
                <p className="text-gray-500">
                  {readingStats.isbnStats.oldestIsbn.title}
                  <span className="ml-1 text-gray-400">
                    ({readingStats.isbnStats.oldestIsbn.year})
                  </span>
                </p>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                <p className="mb-0.5 font-medium">최신 ISBN</p>
                <p className="text-gray-500">
                  {readingStats.isbnStats.newestIsbn.title}
                  <span className="ml-1 text-gray-400">
                    ({readingStats.isbnStats.newestIsbn.year})
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 최고 평점 도서 & 다독 통계 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            가장 높은 평점의 책
          </h3>
          <div className="space-y-3">
            {readingStats.ratingStats.highestRated.map((book, idx) => (
              <div key={idx} className="rounded-lg bg-white p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {book.title}
                    </p>
                    <p className="text-xs text-gray-500">{book.author}</p>
                  </div>
                  <div className="flex">
                    {Array(book.rating)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            독서 요약 통계
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">페이지당 평균 시간</p>
              <p className="text-sm font-medium text-gray-900">
                {(
                  (readingStats.books.hours * 60) /
                  readingStats.books.pages
                ).toFixed(1)}
                분
              </p>
            </div>
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">평균 페이지 수</p>
              <p className="text-sm font-medium text-gray-900">
                {readingStats.books.avgPagesPerBook}페이지
              </p>
            </div>
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">평균 책 완독 시간</p>
              <p className="text-sm font-medium text-gray-900">
                {readingStats.books.avgReadingTimePerBook}시간
              </p>
            </div>
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">올해 총 독서일</p>
              <p className="text-sm font-medium text-gray-900">
                {readingStats.readingSpeedStats.totalReadingDays}일
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 계절별 독서 패턴 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            계절별 독서 패턴
          </h3>
          <div className="flex flex-col">
            <div className="mb-4 flex justify-between">
              {/* 계절별 독서량 차트 */}
              <div className="w-36">
                <div className="relative flex h-36 w-36 items-center justify-center">
                  {/* 봄 */}
                  <div
                    className="absolute h-36 w-36 rounded-tl-full bg-green-200 opacity-80"
                    style={{
                      clipPath: 'polygon(0 0, 50% 0, 50% 50%, 0 50%)',
                      opacity:
                        readingStats.seasonalReading.spring.percentage / 100 +
                        0.3,
                    }}
                  >
                    <div className="absolute top-5 left-5 text-center">
                      <p className="text-sm font-medium text-gray-700">봄</p>
                      <p className="text-xs text-gray-500">
                        {readingStats.seasonalReading.spring.count}권
                      </p>
                    </div>
                  </div>
                  {/* 여름 */}
                  <div
                    className="absolute h-36 w-36 rounded-tr-full bg-yellow-200 opacity-80"
                    style={{
                      clipPath: 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)',
                      opacity:
                        readingStats.seasonalReading.summer.percentage / 100 +
                        0.3,
                    }}
                  >
                    <div className="absolute top-5 right-5 text-center">
                      <p className="text-sm font-medium text-gray-700">여름</p>
                      <p className="text-xs text-gray-500">
                        {readingStats.seasonalReading.summer.count}권
                      </p>
                    </div>
                  </div>
                  {/* 가을 */}
                  <div
                    className="absolute h-36 w-36 rounded-br-full bg-orange-200 opacity-80"
                    style={{
                      clipPath:
                        'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)',
                      opacity:
                        readingStats.seasonalReading.fall.percentage / 100 +
                        0.3,
                    }}
                  >
                    <div className="absolute right-5 bottom-5 text-center">
                      <p className="text-sm font-medium text-gray-700">가을</p>
                      <p className="text-xs text-gray-500">
                        {readingStats.seasonalReading.fall.count}권
                      </p>
                    </div>
                  </div>
                  {/* 겨울 */}
                  <div
                    className="absolute h-36 w-36 rounded-bl-full bg-blue-200 opacity-80"
                    style={{
                      clipPath: 'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)',
                      opacity:
                        readingStats.seasonalReading.winter.percentage / 100 +
                        0.3,
                    }}
                  >
                    <div className="absolute bottom-5 left-5 text-center">
                      <p className="text-sm font-medium text-gray-700">겨울</p>
                      <p className="text-xs text-gray-500">
                        {readingStats.seasonalReading.winter.count}권
                      </p>
                    </div>
                  </div>

                  {/* 계절 분포 */}
                  <div className="text-xs text-gray-500">
                    총 {readingStats.books.total}권
                  </div>
                </div>
              </div>

              <div className="flex-1 pl-6">
                <div className="space-y-3">
                  {[
                    {
                      label: '봄',
                      value: readingStats.seasonalReading.spring,
                      color: 'bg-green-300',
                    },
                    {
                      label: '여름',
                      value: readingStats.seasonalReading.summer,
                      color: 'bg-yellow-300',
                    },
                    {
                      label: '가을',
                      value: readingStats.seasonalReading.fall,
                      color: 'bg-orange-300',
                    },
                    {
                      label: '겨울',
                      value: readingStats.seasonalReading.winter,
                      color: 'bg-blue-300',
                    },
                  ].map((season, idx) => (
                    <div key={idx}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-gray-500">{season.label}</span>
                        <span className="font-medium">
                          {season.value.percentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${season.color}`}
                          style={{ width: `${season.value.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-gray-500">가장 많이 읽는 달</p>
                <p className="text-sm font-medium text-gray-900">
                  {readingStats.seasonalReading.favoriteMonth.name}
                  <span className="ml-2 text-xs text-gray-500">
                    {readingStats.seasonalReading.favoriteMonth.count}권
                  </span>
                </p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-gray-500">가장 적게 읽는 달</p>
                <p className="text-sm font-medium text-gray-900">
                  {readingStats.seasonalReading.leastActiveMonth.name}
                  <span className="ml-2 text-xs text-gray-500">
                    {readingStats.seasonalReading.leastActiveMonth.count}권
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            독서 시간대 분석
          </h3>
          <div className="space-y-4">
            {readingStats.readingTimeStats.map((timeSlot, idx) => (
              <div key={idx} className="flex items-center">
                <div className="w-28 text-xs text-gray-600">
                  {timeSlot.time}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex justify-between text-xs">
                    <span>{timeSlot.percentage}%</span>
                    <span>평균 {timeSlot.avgPages}페이지/회</span>
                  </div>
                  <div className="h-5 w-full overflow-hidden rounded-md bg-gray-100">
                    <div
                      className="h-full rounded-md"
                      style={{
                        width: `${timeSlot.percentage * 2}%`,
                        backgroundColor: idx === 3 ? '#93C5FD' : '#D1D5DB', // 저녁 시간(가장 높은 값)만 색상 강조
                        opacity: 0.5 + timeSlot.percentage / 100,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-white p-3">
            <p className="text-xs text-gray-500">가장 효율적인 독서 시간대</p>
            <p className="text-sm font-medium text-gray-900">저녁 (18-22시)</p>
            <p className="mt-1 text-xs text-gray-500">
              이 시간대에 가장 많은 페이지(평균 45페이지)를 읽었으며, 전체
              독서시간의 35%를 차지합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
