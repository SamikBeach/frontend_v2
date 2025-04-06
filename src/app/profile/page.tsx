'use client';

import { userAtom } from '@/atoms/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
  UserCircle,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecentBooks, useRecentReviews } from './hooks';

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

export default function ProfilePage() {
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const { getQueryParam, updateQueryParams } = useQueryParams();
  const activeSection = getQueryParam('section') || 'books';
  const activeStatus = getQueryParam('status') || 'want';

  // 선택한 메뉴 아이템에 기반한 섹션 상태
  const [selectedSection, setSelectedSection] = useState(activeSection);
  const [selectedStatus, setSelectedStatus] = useState(activeStatus);
  const [activeGroupTab, setActiveGroupTab] = useState('active'); // 독서 모임 탭 상태

  // 사용자가 로그인하지 않았으면 홈으로 리다이렉트
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const { recentBooks } = useRecentBooks();
  const { recentReviews } = useRecentReviews();

  // 섹션 변경 핸들러
  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    updateQueryParams({ section: sectionId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 독서 상태 변경 핸들러
  const handleStatusChange = (statusId: string) => {
    setSelectedStatus(statusId);
    updateQueryParams({ status: statusId });
  };

  // 평가한 책 수
  const booksRated = 42;
  // 읽은 책 수
  const booksRead = 37;
  // 읽은 총 페이지 수
  const pagesRead = 15432;
  // 작성한 리뷰 수
  const reviewsWritten = 18;
  // 참여 모임 수
  const groupsJoined = 3;
  // 팔로워 / 팔로잉 수
  const followers = 128;
  const following = 75;
  // 구독 중인 서재 수
  const subscribedCount = subscribedLibraries.length;

  // 통계 데이터
  const statsData = {
    totalBooksRead: 37,
    totalPages: 15432,
    avgRating: 4.2,
    readingSpeed: 45, // 페이지/일
    readingDays: 143, // 올해 독서한 일수
    longestStreak: 21, // 연속 독서 일수
    favoriteGenre: '철학',
    favoriteAuthor: '니체',
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
        return (
          <div>
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
          </div>
        );
      case 'subscriptions':
        return (
          <div>
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
                          <p className="text-xs text-gray-500">
                            {library.owner.name}
                          </p>
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
                      <div className="text-xs text-gray-500">
                        {library.lastUpdated}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'read':
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
                      width={240}
                      height={360}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="line-clamp-1 text-[15px] font-medium text-gray-900 group-hover:text-blue-600">
                      {book.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {book.author}
                    </p>
                    <div className="mt-1 flex items-center">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.floor(book.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-500">
                        ({book.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="mt-8 space-y-4">
            {recentReviews.map(review => (
              <div
                key={review.id}
                className="group overflow-hidden rounded-lg bg-gray-50 p-5 transition-colors hover:bg-gray-100"
              >
                <div className="flex gap-5">
                  <div className="flex-shrink-0">
                    <Image
                      src={review.book.coverImage}
                      alt={review.book.title}
                      width={60}
                      height={90}
                      className="h-[90px] w-[60px] rounded-md object-cover"
                    />
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
                    <p className="mt-2 text-sm text-gray-700">
                      {review.content}
                    </p>
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
      case 'groups':
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
                    <p className="mt-1 text-sm text-gray-500">
                      {group.description}
                    </p>
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
                          <Avatar
                            key={i}
                            className="h-6 w-6 border-2 border-white"
                          >
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
      case 'stats':
        return (
          <div className="mt-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* 독서 트렌드 */}
              <div className="rounded-lg bg-gray-50 p-5">
                <h3 className="text-lg font-medium text-gray-900">
                  독서 트렌드
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">철학</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: '42%' }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">문학</span>
                      <span className="font-medium">27%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{ width: '27%' }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">역사</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-yellow-500"
                        style={{ width: '18%' }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">과학</span>
                      <span className="font-medium">13%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: '13%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 월별 독서량 */}
              <div className="rounded-lg bg-gray-50 p-5">
                <h3 className="text-lg font-medium text-gray-900">
                  월별 완독 권수
                </h3>
                <div className="mt-3 flex h-[180px] items-end justify-between px-1">
                  {['1월', '2월', '3월', '4월', '5월', '6월'].map(
                    (month, i) => {
                      const heights = [30, 45, 40, 70, 55, 65];
                      const colors = [
                        'bg-blue-400',
                        'bg-indigo-400',
                        'bg-purple-400',
                        'bg-pink-400',
                        'bg-red-400',
                        'bg-orange-400',
                      ];
                      return (
                        <div key={month} className="flex flex-col items-center">
                          <div
                            className={`w-8 rounded-t-lg ${colors[i]}`}
                            style={{ height: `${heights[i]}%` }}
                          ></div>
                          <span className="mt-2 text-xs text-gray-500">
                            {month}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* 독서 시간대 */}
              <div className="rounded-lg bg-gray-50 p-5">
                <h3 className="text-lg font-medium text-gray-900">
                  주로 읽는 시간대
                </h3>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {['아침', '오후', '저녁', '밤'].map((time, i) => {
                    const percentages = [15, 20, 30, 35];
                    const colors = [
                      'bg-yellow-100 text-yellow-800',
                      'bg-blue-100 text-blue-800',
                      'bg-purple-100 text-purple-800',
                      'bg-indigo-100 text-indigo-800',
                    ];
                    return (
                      <div
                        key={time}
                        className={`flex flex-col items-center rounded-lg p-3 ${colors[i]}`}
                      >
                        <span className="text-lg font-semibold">
                          {percentages[i]}%
                        </span>
                        <span className="mt-1 text-xs">{time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 연간 독서 목표 */}
              <div className="rounded-lg bg-gray-50 p-5">
                <h3 className="text-lg font-medium text-gray-900">
                  2024년 독서 목표
                </h3>
                <div className="mt-3 flex items-center justify-center">
                  <div className="relative h-36 w-36">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-100"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-blue-500"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        strokeDasharray="283"
                        strokeDashoffset="113"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">
                        42/100
                      </span>
                      <span className="text-xs text-gray-500">권</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-green-50 p-2">
                    <p className="text-sm font-medium text-green-700">
                      월 평균
                    </p>
                    <p className="text-xl font-bold text-green-800">7권</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-2">
                    <p className="text-sm font-medium text-blue-700">남은 책</p>
                    <p className="text-xl font-bold text-blue-800">58권</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white">
      {/* 프로필 헤더 */}
      <div className="bg-white">
        <div className="mx-auto w-full px-4 pt-8 pb-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-white">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gray-200 text-2xl font-medium text-gray-700">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <div className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    @{user.username}
                  </div>
                </div>
                <p className="mt-1 max-w-xl text-sm text-gray-600">
                  {user.bio ||
                    '고전 문학을 좋아하는 독서가입니다. 플라톤부터 도스토예프스키까지 다양한 작품을 읽고 있습니다.'}
                </p>
                <div className="mt-2 flex gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">
                      {following}
                    </span>
                    <span className="text-gray-500">팔로잉</span>
                  </div>
                  <div className="h-4 border-r border-gray-200" />
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">
                      {followers}
                    </span>
                    <span className="text-gray-500">팔로워</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="mt-4 flex items-center gap-1.5 rounded-full border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 sm:mt-0"
              variant="outline"
            >
              <UserCircle className="h-4 w-4" />
              프로필 편집
            </Button>
          </div>
        </div>
      </div>

      {/* 독서 정보 개요 */}
      <div className="mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-6 gap-3">
          {/* 내 서재 */}
          <button
            onClick={() => handleSectionChange('books')}
            className={cn(
              `flex cursor-pointer flex-col items-center rounded-lg bg-blue-50 p-4 transition-transform hover:scale-105`,
              selectedSection === 'books' &&
                'ring-2 ring-gray-900 ring-offset-2'
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div className="mt-2 text-center">
              <span className="block text-xl font-bold text-gray-900">
                {booksRated}
              </span>
              <span className="text-xs text-gray-600">내 서재</span>
            </div>
          </button>

          {/* 읽은 책 */}
          <button
            onClick={() => handleSectionChange('read')}
            className={cn(
              `flex cursor-pointer flex-col items-center rounded-lg bg-violet-50 p-4 transition-transform hover:scale-105`,
              selectedSection === 'read' && 'ring-2 ring-gray-900 ring-offset-2'
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
              <Book className="h-5 w-5 text-violet-600" />
            </div>
            <div className="mt-2 text-center">
              <span className="block text-xl font-bold text-gray-900">
                {booksRead}
              </span>
              <span className="text-xs text-gray-600">읽은 책</span>
            </div>
          </button>

          {/* 내 리뷰 */}
          <button
            onClick={() => handleSectionChange('reviews')}
            className={cn(
              `flex cursor-pointer flex-col items-center rounded-lg bg-purple-50 p-4 transition-transform hover:scale-105`,
              selectedSection === 'reviews' &&
                'ring-2 ring-gray-900 ring-offset-2'
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div className="mt-2 text-center">
              <span className="block text-xl font-bold text-gray-900">
                {reviewsWritten}
              </span>
              <span className="text-xs text-gray-600">내 리뷰</span>
            </div>
          </button>

          {/* 구독한 서재 */}
          <button
            onClick={() => handleSectionChange('subscriptions')}
            className={cn(
              `flex cursor-pointer flex-col items-center rounded-lg border border-green-200 bg-white p-4 transition-transform hover:scale-105`,
              selectedSection === 'subscriptions' &&
                'ring-2 ring-gray-900 ring-offset-2'
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Bell className="h-5 w-5 text-green-600" />
            </div>
            <div className="mt-2 text-center">
              <span className="block text-xl font-bold text-gray-900">
                &nbsp;
              </span>
              <span className="text-xs text-gray-600">구독한 서재</span>
            </div>
          </button>

          {/* 독서모임 */}
          <button
            onClick={() => handleSectionChange('groups')}
            className={cn(
              `flex cursor-pointer flex-col items-center rounded-lg border border-amber-200 bg-white p-4 transition-transform hover:scale-105`,
              selectedSection === 'groups' &&
                'ring-2 ring-gray-900 ring-offset-2'
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <div className="mt-2 text-center">
              <span className="block text-xl font-bold text-gray-900">
                &nbsp;
              </span>
              <span className="text-xs text-gray-600">독서모임</span>
            </div>
          </button>

          {/* 통계 */}
          <button
            onClick={() => handleSectionChange('stats')}
            className={cn(
              `flex cursor-pointer flex-col items-center rounded-lg border border-blue-200 bg-white p-4 transition-transform hover:scale-105`,
              selectedSection === 'stats' &&
                'ring-2 ring-gray-900 ring-offset-2'
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <AreaChart className="h-5 w-5 text-blue-600" />
            </div>
            <div className="mt-2 text-center">
              <span className="block text-xl font-bold text-gray-900">
                &nbsp;
              </span>
              <span className="text-xs text-gray-600">통계</span>
            </div>
          </button>
        </div>
      </div>

      {/* 섹션 컨텐츠 */}
      <div className="mx-auto w-full px-4 pt-6">
        {/* 현재 선택된 섹션 컨텐츠 렌더링 */}
        {renderSectionContent()}
      </div>
    </div>
  );
}
