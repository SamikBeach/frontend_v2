'use client';

import { userAtom } from '@/atoms/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQueryParams } from '@/hooks';
import { cn } from '@/lib/utils';
import { useAtomValue } from 'jotai';
import {
  AreaChart,
  Bell,
  Book,
  BookOpen,
  CalendarDays,
  Heart,
  MessageCircle,
  MessageSquare,
  Star,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecentBooks, useRecentReviews } from './hooks';

import {
  ProfileBooks,
  ProfileHeader,
  ProfileRecentBooks,
  ProfileReviews,
  ProfileStats,
  ProfileSummary,
} from './components';

// 메뉴 아이템 정의
interface MenuItem {
  id: string;
  name: string;
  icon: React.ElementType;
  bgColor: string;
  iconBgColor: string;
  iconColor: string;
}

// 메뉴 아이템 정의
const menuItems: MenuItem[] = [
  {
    id: 'books',
    name: '내 서재',
    icon: BookOpen,
    bgColor: 'bg-blue-50',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'subscriptions',
    name: '구독한 서재',
    icon: Bell,
    bgColor: 'bg-green-50',
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 'read',
    name: '읽은 책',
    icon: Book,
    bgColor: 'bg-violet-50',
    iconBgColor: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    id: 'reviews',
    name: '내 리뷰',
    icon: MessageSquare,
    bgColor: 'bg-purple-50',
    iconBgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 'groups',
    name: '내 독서모임',
    icon: Users,
    bgColor: 'bg-amber-50',
    iconBgColor: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    id: 'stats',
    name: '내 통계',
    icon: AreaChart,
    bgColor: 'bg-green-50',
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
];

// 독서 상태 정의
const readingStatuses = [
  { id: 'finished', name: '읽었어요', count: 42 },
  { id: 'reading', name: '읽고 있어요', count: 8 },
  { id: 'want', name: '읽고 싶어요', count: 23 },
];

// 샘플 서재 데이터
const userLibraries = [
  {
    id: 1,
    title: '철학 고전',
    description: '플라톤부터 니체까지, 철학 관련 고전 모음',
    category: 'philosophy',
    owner: {
      name: '내 서재',
      avatar: '/path/to/avatar.jpg',
    },
    followers: 42,
    books: [
      {
        id: 1,
        title: '국가',
        author: '플라톤',
        coverImage: 'https://picsum.photos/seed/book1/120/180',
      },
      {
        id: 2,
        title: '니코마코스 윤리학',
        author: '아리스토텔레스',
        coverImage: 'https://picsum.photos/seed/book2/120/180',
      },
      {
        id: 3,
        title: '도덕경',
        author: '노자',
        coverImage: 'https://picsum.photos/seed/book3/120/180',
      },
      {
        id: 4,
        title: '차라투스트라는 이렇게 말했다',
        author: '니체',
        coverImage: 'https://picsum.photos/seed/book4/120/180',
      },
    ],
  },
  {
    id: 2,
    title: '현대 문학',
    description: '20세기 이후 주요 문학 작품 모음',
    category: 'literature',
    owner: {
      name: '내 서재',
      avatar: '/path/to/avatar.jpg',
    },
    followers: 35,
    books: [
      {
        id: 5,
        title: '노인과 바다',
        author: '헤밍웨이',
        coverImage: 'https://picsum.photos/seed/book5/120/180',
      },
      {
        id: 6,
        title: '카프카 단편선',
        author: '프란츠 카프카',
        coverImage: 'https://picsum.photos/seed/book6/120/180',
      },
      {
        id: 7,
        title: '백년의 고독',
        author: '가브리엘 가르시아 마르케스',
        coverImage: 'https://picsum.photos/seed/book7/120/180',
      },
      {
        id: 8,
        title: '변신',
        author: '프란츠 카프카',
        coverImage: 'https://picsum.photos/seed/book8/120/180',
      },
    ],
  },
  {
    id: 3,
    title: '과학 교양',
    description: '일반인을 위한 과학 교양서 모음',
    category: 'science',
    owner: {
      name: '내 서재',
      avatar: '/path/to/avatar.jpg',
    },
    followers: 27,
    books: [
      {
        id: 9,
        title: '시간의 역사',
        author: '스티븐 호킹',
        coverImage: 'https://picsum.photos/seed/book9/120/180',
      },
      {
        id: 10,
        title: '코스모스',
        author: '칼 세이건',
        coverImage: 'https://picsum.photos/seed/book10/120/180',
      },
      {
        id: 11,
        title: '이기적 유전자',
        author: '리처드 도킨스',
        coverImage: 'https://picsum.photos/seed/book11/120/180',
      },
      {
        id: 12,
        title: '사피엔스',
        author: '유발 하라리',
        coverImage: 'https://picsum.photos/seed/book12/120/180',
      },
    ],
  },
];

// 샘플 구독한 서재 데이터
const subscribedLibraries = [
  {
    id: 101,
    title: '철학의 시작',
    description: '서양 철학의 기초를 다지는 필수 고전들',
    category: 'philosophy',
    owner: {
      name: '김철수',
      avatar: `https://i.pravatar.cc/150?u=user1`,
      username: 'cheolsu',
    },
    followers: 128,
    hasNewUpdates: true,
    lastUpdated: '2일 전',
    books: [
      {
        id: 1,
        title: '소크라테스의 변명',
        author: '플라톤',
        coverImage: `https://picsum.photos/seed/book1/120/180`,
      },
      {
        id: 2,
        title: '니코마코스 윤리학',
        author: '아리스토텔레스',
        coverImage: `https://picsum.photos/seed/book4/120/180`,
      },
      {
        id: 3,
        title: '국가',
        author: '플라톤',
        coverImage: `https://picsum.photos/seed/book22/120/180`,
      },
      {
        id: 4,
        title: '형이상학',
        author: '아리스토텔레스',
        coverImage: `https://picsum.photos/seed/book27/120/180`,
      },
    ],
  },
  {
    id: 102,
    title: '문학의 향기',
    description: '세계 문학의 걸작들을 모아둔 서재입니다',
    category: 'literature',
    owner: {
      name: '이영희',
      avatar: `https://i.pravatar.cc/150?u=user2`,
      username: 'younghee',
    },
    followers: 256,
    hasNewUpdates: false,
    lastUpdated: '1주일 전',
    books: [
      {
        id: 5,
        title: '죄와 벌',
        author: '도스토예프스키',
        coverImage: `https://picsum.photos/seed/book2/120/180`,
      },
      {
        id: 6,
        title: '안나 카레니나',
        author: '톨스토이',
        coverImage: `https://picsum.photos/seed/book15/120/180`,
      },
      {
        id: 7,
        title: '변신',
        author: '카프카',
        coverImage: `https://picsum.photos/seed/book16/120/180`,
      },
      {
        id: 8,
        title: '백년의 고독',
        author: '마르케스',
        coverImage: `https://picsum.photos/seed/book17/120/180`,
      },
    ],
  },
  {
    id: 103,
    title: '역사 속의 지혜',
    description: '역사 속에서 배우는 삶의 교훈',
    category: 'history',
    owner: {
      name: '박지민',
      avatar: `https://i.pravatar.cc/150?u=user3`,
      username: 'jimin',
    },
    followers: 189,
    hasNewUpdates: true,
    lastUpdated: '3일 전',
    books: [
      {
        id: 9,
        title: '로마제국 쇠망사',
        author: '에드워드 기번',
        coverImage: `https://picsum.photos/seed/book3/120/180`,
      },
      {
        id: 10,
        title: '사기',
        author: '사마천',
        coverImage: `https://picsum.photos/seed/book18/120/180`,
      },
      {
        id: 11,
        title: '총, 균, 쇠',
        author: '재레드 다이아몬드',
        coverImage: `https://picsum.photos/seed/book19/120/180`,
      },
      {
        id: 12,
        title: '무민 도시의 역사',
        author: '루이스 멈포드',
        coverImage: `https://picsum.photos/seed/book20/120/180`,
      },
    ],
  },
];

// 참여 중인 독서 모임 데이터
interface ActiveReadingGroup {
  id: number;
  name: string;
  memberCount: number;
  description: string;
  status: 'active';
  thumbnail: string;
  nextMeeting: string;
  book: string;
}

// 종료된 독서 모임
interface CompletedReadingGroup {
  id: number;
  name: string;
  memberCount: number;
  description: string;
  status: 'completed';
  thumbnail: string;
  completedDate: string;
  book: string;
}

type ReadingGroup = ActiveReadingGroup | CompletedReadingGroup;

const activeReadingGroups: ActiveReadingGroup[] = [
  {
    id: 1,
    name: '주말 철학 독서 모임',
    memberCount: 18,
    description: '매주 토요일 오전, 철학 고전을 함께 읽어요',
    status: 'active',
    thumbnail: 'https://picsum.photos/seed/group1/100/100',
    nextMeeting: '2024년 5월 18일',
    book: '니코마코스 윤리학',
  },
  {
    id: 2,
    name: '심야 독서 클럽',
    memberCount: 12,
    description: '밤에 책을 읽는 모임입니다',
    status: 'active',
    thumbnail: 'https://picsum.photos/seed/group2/100/100',
    nextMeeting: '2024년 5월 20일',
    book: '노인과 바다',
  },
];

// 종료된 독서 모임
const pastReadingGroups: CompletedReadingGroup[] = [
  {
    id: 3,
    name: '고전 독서회',
    memberCount: 15,
    description: '격주 화요일 저녁, 한국 고전을 중심으로 토론합니다',
    status: 'completed',
    thumbnail: 'https://picsum.photos/seed/group3/100/100',
    completedDate: '2024년 4월 15일',
    book: '소나기',
  },
];

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

// 통계 컴포넌트들
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

// 아이콘과 함께 표시되는 주요 통계 카드
interface StatsSummaryCardProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  value: string | number;
  children?: React.ReactNode;
}

const StatsSummaryCard = ({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  value,
  children,
}: StatsSummaryCardProps) => (
  <StatsCard>
    <div className="flex items-center gap-4">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}
      >
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
    {children}
  </StatsCard>
);

// 프로그레스 바 컴포넌트
interface ProgressBarProps {
  percentage: number;
  color?: string;
}

const ProgressBar = ({
  percentage,
  color = 'bg-blue-300',
}: ProgressBarProps) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
    <div
      className={`h-full rounded-full ${color}`}
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

// 차트 박스 컴포넌트
interface ChartBoxProps {
  title: string;
  children: React.ReactNode;
}

const ChartBox = ({ title, children }: ChartBoxProps) => (
  <StatsCard>
    <h3 className="mb-4 text-sm font-medium text-gray-700">{title}</h3>
    {children}
  </StatsCard>
);

// 통계 섹션 렌더링 함수
const renderStatsContent = () => {
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
              {/* 여기에 실제로는 원형 차트가 들어가겠지만, 간단한 UI로 대체 */}
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
            {/* 여기에 실제로는 차트가 들어가겠지만, 임시 UI로 대체 */}
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
};

// 렌더링 함수들 정의
const renderBooksContent = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {userLibraries.map(library => (
        <div key={library.id} className="group cursor-pointer">
          <div className="group h-full rounded-xl bg-[#F9FAFB] transition-all duration-200 hover:bg-[#F2F4F6]">
            <div className="p-5 pb-3">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-medium text-gray-900 transition-colors duration-150 group-hover:text-[#3182F6]">
                      {library.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 pt-0 pb-3">
              <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                {library.description}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {library.books.map(book => (
                  <div
                    key={book.id}
                    className="aspect-[2/3] overflow-hidden rounded-md"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-gray-400" />
                  <span>{library.followers.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                  <span>{library.books.length}권</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const renderSubscriptionsContent = () => {
  const router = useRouter();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subscribedLibraries.map(library => (
        <div
          key={library.id}
          className="group cursor-pointer"
          onClick={() => router.push(`/libraries/${library.id}`)}
        >
          <div className="group h-full rounded-xl bg-[#F9FAFB] transition-all duration-200 hover:bg-[#F2F4F6]">
            <div className="p-5 pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border-0">
                  <AvatarImage
                    src={library.owner.avatar}
                    alt={library.owner.name}
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-800">
                    {library.owner.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-medium text-gray-900 transition-colors duration-150 group-hover:text-[#3182F6]">
                      {library.title}
                    </h3>
                    {library.hasNewUpdates && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                        업데이트
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{library.owner.name}</p>
                </div>
              </div>
            </div>
            <div className="px-5 pt-0 pb-3">
              <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                {library.description}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {library.books.map(book => (
                  <div
                    key={book.id}
                    className="aspect-[2/3] overflow-hidden rounded-md"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-gray-400" />
                  <span>{library.followers.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                  <span>{library.books.length}권</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">{library.lastUpdated}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const renderReadBooksContent = () => {
  const { recentBooks = [] } = useRecentBooks();
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleStatusChange = (statusId: string) => {
    setSelectedStatus(statusId);
  };

  return (
    <div>
      {/* 독서 상태 필터 */}
      <div className="mb-6 flex gap-3">
        {readingStatuses.map(status => (
          <button
            key={status.id}
            className={cn(
              'flex h-8 cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium transition-all',
              selectedStatus === status.id
                ? 'border-blue-200 bg-blue-50 text-blue-600'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            )}
            onClick={() => handleStatusChange(status.id)}
          >
            <span>{status.name}</span>
            <span className="ml-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700">
              {status.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {recentBooks.map(book => (
          <div key={book.id} className="group cursor-pointer">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div className="mt-3">
              <h3 className="line-clamp-1 text-[15px] font-medium text-gray-900 group-hover:text-blue-600">
                {book.title}
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">{book.author}</p>
              <div className="mt-1 flex items-center">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(book.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-xs text-gray-500">
                  ({book.rating?.toFixed(1) || '0.0'})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderReviewsContent = () => {
  const { recentReviews = [] } = useRecentReviews();

  return (
    <div className="mt-8 space-y-4">
      {recentReviews.map(review => (
        <div
          key={review.id}
          className="group overflow-hidden rounded-lg bg-gray-50 p-5 transition-colors hover:bg-gray-100"
        >
          <div className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="relative h-[90px] w-[60px] overflow-hidden rounded-md">
                <Image
                  src={review.book.coverImage}
                  alt={review.book.title}
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600">
                  {review.book.title}
                </h3>
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarDays className="mr-1 h-3.5 w-3.5" />
                  {review.date}
                </div>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                {review.book.author}
              </p>
              <div className="mt-1 flex items-center">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(review.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-xs text-gray-500">
                  ({review.rating.toFixed(1)})
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{review.content}</p>
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5" />
                  <span>{review.likes}</span>
                </div>
                <div className="mx-3 h-3 border-r border-gray-200" />
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{review.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const renderGroupsContent = () => {
  const [activeGroupTab, setActiveGroupTab] = useState('active');

  return (
    <div>
      {/* 독서 모임 필터 */}
      <div className="mb-6 flex gap-3">
        <button
          className={cn(
            'flex h-8 cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium transition-all',
            activeGroupTab === 'active'
              ? 'border-blue-200 bg-blue-50 text-blue-600'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          )}
          onClick={() => setActiveGroupTab('active')}
        >
          <span>참여 중</span>
          <span className="ml-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700">
            {activeReadingGroups.length}
          </span>
        </button>
        <button
          className={cn(
            'flex h-8 cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium transition-all',
            activeGroupTab === 'completed'
              ? 'border-blue-200 bg-blue-50 text-blue-600'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          )}
          onClick={() => setActiveGroupTab('completed')}
        >
          <span>종료된 모임</span>
          <span className="ml-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700">
            {pastReadingGroups.length}
          </span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(activeGroupTab === 'active'
          ? activeReadingGroups
          : pastReadingGroups
        ).map(group => (
          <div
            key={group.id}
            className="group overflow-hidden rounded-lg bg-gray-50 transition-colors hover:bg-gray-100"
          >
            <div className="h-32 w-full bg-gray-100">
              <Image
                src={group.thumbnail}
                alt={group.name}
                width={400}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {group.name}
                </h3>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-medium',
                    group.status === 'active'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {group.status === 'active' ? '진행 중' : '종료됨'}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{group.description}</p>
              <div className="mt-3 text-xs text-gray-500">
                {group.status === 'active' ? (
                  <p>다음 모임: {group.nextMeeting}</p>
                ) : (
                  <p>종료일: {group.completedDate}</p>
                )}
                <p className="mt-1">현재 도서: {group.book}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Avatar key={i} className="h-6 w-6 border-2 border-white">
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?u=member${group.id * 3 + i}`}
                        alt="멤버"
                      />
                      <AvatarFallback>멤버</AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-medium text-gray-600">
                    +{group.memberCount - 3}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {group.memberCount}명의 회원
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const { getQueryParam, updateQueryParams } = useQueryParams();
  const activeSection = getQueryParam('section') || 'books';

  // 선택한 메뉴 아이템에 기반한 섹션 상태
  const [selectedSection, setSelectedSection] = useState(activeSection);

  // 사용자가 로그인하지 않았으면 홈으로 리다이렉트
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // 섹션 변경 핸들러
  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    updateQueryParams({ section: sectionId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 사용자가 없으면 로딩 상태 또는 빈 화면 표시
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        로그인이 필요합니다...
      </div>
    );
  }

  // 선택된 섹션에 따라 컨텐츠 렌더링
  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'books':
        return <ProfileBooks />;
      case 'subscriptions':
        return <ProfileBooks />;
      case 'read':
        return <ProfileRecentBooks />;
      case 'reviews':
        return <ProfileReviews />;
      case 'groups':
        return <ProfileBooks />;
      case 'stats':
        return <ProfileStats />;
      default:
        return <ProfileBooks />;
    }
  };

  return (
    <div className="bg-white">
      {/* 프로필 헤더 */}
      <ProfileHeader />

      {/* 독서 정보 개요 */}
      <ProfileSummary
        selectedSection={selectedSection}
        onSectionChange={handleSectionChange}
      />

      {/* 섹션 컨텐츠 */}
      <div className="mx-auto w-full px-4 pt-6">
        {/* 현재 선택된 섹션 컨텐츠 렌더링 */}
        {renderSectionContent()}
      </div>
    </div>
  );
}
