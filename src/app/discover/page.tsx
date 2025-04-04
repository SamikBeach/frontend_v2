'use client';

import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronRight,
  Library,
  Sparkles,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 큐레이션 데이터
const curationSections = [
  {
    id: 'classics',
    title: '고전산책 큐레이션',
    description: '독서의 깊이를 더하는 체계적인 고전 읽기',
    collections: [
      {
        id: 'western-philosophy',
        title: '서양 철학의 흐름',
        description: '고대 그리스부터 현대까지 서양 철학의 핵심 텍스트',
        coverImage:
          'https://placehold.co/480x320/e2e8f0/1e293b?text=서양+철학의+흐름',
        bookCount: 12,
      },
      {
        id: 'democracy',
        title: '민주주의를 말하다',
        description: '민주주의의 역사와 철학적 토대를 이해하는 필독서',
        coverImage:
          'https://placehold.co/480x320/e2e8f0/1e293b?text=민주주의를+말하다',
        bookCount: 8,
      },
      {
        id: 'human-condition',
        title: '인간 조건에 대하여',
        description: '인간의 존재와 실존에 대한 통찰력있는 텍스트 모음',
        coverImage:
          'https://placehold.co/480x320/e2e8f0/1e293b?text=인간+조건에+대하여',
        bookCount: 10,
      },
    ],
  },
  {
    id: 'snu-recommend',
    title: '서울대 권장도서',
    description: '서울대학교에서 추천하는 인문학 필독서',
    collections: [
      {
        id: 'humanities',
        title: '인문학 기초',
        description: '인문학적 소양을 위한 서울대 권장 기초 도서',
        coverImage:
          'https://placehold.co/480x320/e2e8f0/1e293b?text=인문학+기초',
        bookCount: 15,
      },
      {
        id: 'critical-thinking',
        title: '비판적 사고를 위한 독서',
        description: '심층적 사고력 함양을 위한 서울대 권장 도서',
        coverImage:
          'https://placehold.co/480x320/e2e8f0/1e293b?text=비판적+사고를+위한+독서',
        bookCount: 9,
      },
    ],
  },
  {
    id: 'awards',
    title: 'Awards 수상작',
    description: '국내외 권위 있는 상을 수상한 작품들',
    collections: [
      {
        id: 'nobel-literature',
        title: '노벨 문학상',
        description: '문학적 성취를 인정받은 노벨 문학상 수상작',
        coverImage:
          'https://placehold.co/480x320/e2e8f0/1e293b?text=노벨+문학상',
        bookCount: 20,
      },
      {
        id: 'pulitzer',
        title: '퓰리처상',
        description: '탁월한 저널리즘과 문학적 성취를 인정받은 작품들',
        coverImage: 'https://placehold.co/480x320/e2e8f0/1e293b?text=퓰리처상',
        bookCount: 12,
      },
      {
        id: 'daesan',
        title: '대산문학상',
        description: '한국 문학의 우수성을 대표하는 작품들',
        coverImage:
          'https://placehold.co/480x320/e2e8f0/1e293b?text=대산문학상',
        bookCount: 8,
      },
    ],
  },
];

// 명사 추천 데이터
const celebrityRecommendations = [
  {
    id: 'yoo-simin',
    name: '유시민',
    title: '작가, 정치인',
    avatar: 'https://placehold.co/128x128/e2e8f0/1e293b?text=유시민',
    books: [
      {
        id: 101,
        title: '국가',
        author: '플라톤',
        coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=국가',
        comment: '정의와 통치에 대한 근본적인 질문을 던지는 서양 철학의 고전',
      },
      {
        id: 102,
        title: '리바이어던',
        author: '토마스 홉스',
        coverImage:
          'https://placehold.co/240x360/e2e8f0/1e293b?text=리바이어던',
        comment: '국가의 본질과 사회계약에 대한 통찰력있는 분석',
      },
      {
        id: 103,
        title: '에티카',
        author: '스피노자',
        coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=에티카',
        comment: '인간의 본성과 자유에 대한 깊은 철학적 탐구',
      },
    ],
  },
  {
    id: 'jbp',
    name: '조던 피터슨',
    title: '심리학자, 작가',
    avatar: 'https://placehold.co/128x128/e2e8f0/1e293b?text=조던+피터슨',
    books: [
      {
        id: 104,
        title: '죄와 벌',
        author: '도스토예프스키',
        coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=죄와+벌',
        comment: '인간 심리의 어두운 면과 도덕적 딜레마에 대한 깊은 탐구',
      },
      {
        id: 105,
        title: '존재와 시간',
        author: '하이데거',
        coverImage:
          'https://placehold.co/240x360/e2e8f0/1e293b?text=존재와+시간',
        comment: '존재의 의미와 시간성에 대한 현대 철학의 기념비적 작품',
      },
    ],
  },
  {
    id: 'kim-youngha',
    name: '김영하',
    title: '소설가',
    avatar: 'https://placehold.co/128x128/e2e8f0/1e293b?text=김영하',
    books: [
      {
        id: 106,
        title: '변신',
        author: '프란츠 카프카',
        coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=변신',
        comment: '현대인의 소외와 불안을 상징적으로 담아낸 걸작',
      },
      {
        id: 107,
        title: '백년 동안의 고독',
        author: '가브리엘 가르시아 마르케스',
        coverImage:
          'https://placehold.co/240x360/e2e8f0/1e293b?text=백년+동안의+고독',
        comment: '신화와 현실이 교차하는 마술적 리얼리즘의 대표작',
      },
    ],
  },
];

// 시대별 고전 데이터
const historicalPeriods = [
  {
    id: 'ancient',
    title: '고대',
    years: '기원전 800년 - 500년',
    coverImage: 'https://placehold.co/320x180/e2e8f0/1e293b?text=고대',
    representative: [
      {
        id: 201,
        title: '일리아스',
        author: '호메로스',
        coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=일리아스',
      },
      {
        id: 202,
        title: '논어',
        author: '공자',
        coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=논어',
      },
    ],
  },
  {
    id: 'medieval',
    title: '중세',
    years: '500년 - 1500년',
    coverImage: 'https://placehold.co/320x180/e2e8f0/1e293b?text=중세',
    representative: [
      {
        id: 203,
        title: '신곡',
        author: '단테 알리기에리',
        coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=신곡',
      },
      {
        id: 204,
        title: '캔터베리 이야기',
        author: '제프리 초서',
        coverImage:
          'https://placehold.co/240x360/e2e8f0/1e293b?text=캔터베리+이야기',
      },
    ],
  },
  {
    id: 'renaissance',
    title: '르네상스/계몽주의',
    years: '1500년 - 1800년',
    coverImage: 'https://placehold.co/320x180/e2e8f0/1e293b?text=르네상스',
    representative: [
      {
        id: 205,
        title: '햄릿',
        author: '윌리엄 셰익스피어',
        coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=햄릿',
      },
      {
        id: 206,
        title: '에밀',
        author: '장-자크 루소',
        coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=에밀',
      },
    ],
  },
  {
    id: 'modern',
    title: '근현대',
    years: '1800년 - 현재',
    coverImage: 'https://placehold.co/320x180/e2e8f0/1e293b?text=근현대',
    representative: [
      {
        id: 207,
        title: '자본론',
        author: '카를 마르크스',
        coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=자본론',
      },
      {
        id: 208,
        title: '토지',
        author: '박경리',
        coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=토지',
      },
    ],
  },
];

// 컴포넌트: 큐레이션 카드
function CurationCard({ collection }: { collection: any }) {
  return (
    <Link href={`/discover/collections/${collection.id}`}>
      <div className="group relative overflow-hidden rounded-xl border border-gray-100">
        <div className="relative h-[180px] w-full overflow-hidden">
          <Image
            src={collection.coverImage}
            alt={collection.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
        </div>
        <div className="relative p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {collection.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{collection.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <BookOpen className="h-3.5 w-3.5" /> {collection.bookCount}권
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full p-0"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// 컴포넌트: 명사 추천 도서 카드
function CelebrityRecommendationCard({ celebrity }: { celebrity: any }) {
  return (
    <div className="rounded-xl border border-gray-100 p-5">
      <div className="mb-4 flex items-center gap-3">
        <Image
          src={celebrity.avatar}
          width={48}
          height={48}
          alt={celebrity.name}
          className="rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {celebrity.name}
          </h3>
          <p className="text-sm text-gray-500">{celebrity.title}</p>
        </div>
      </div>
      <ScrollArea className="pb-4">
        <div className="flex gap-4">
          {celebrity.books.map((book: any) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="flex-shrink-0 overflow-hidden"
              style={{ width: '160px' }}
            >
              <div className="relative mb-3 h-[240px] w-full overflow-hidden rounded-md">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h4 className="line-clamp-2 text-sm font-medium">{book.title}</h4>
              <p className="text-xs text-gray-500">{book.author}</p>
              <p className="mt-2 line-clamp-3 text-xs text-gray-600 italic">
                {book.comment}
              </p>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

// 컴포넌트: 시대별 고전 카드
function HistoricalPeriodCard({ period }: { period: any }) {
  return (
    <Link href={`/discover/periods/${period.id}`}>
      <div className="group relative overflow-hidden rounded-xl border border-gray-100">
        <div className="relative h-[120px] w-full overflow-hidden">
          <Image
            src={period.coverImage}
            alt={period.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
          <div className="absolute bottom-0 p-3 text-white">
            <h3 className="text-lg font-semibold">{period.title}</h3>
            <p className="text-sm opacity-90">{period.years}</p>
          </div>
        </div>
        <div className="p-3">
          <div className="flex gap-2">
            {period.representative.map((book: any) => (
              <div key={book.id} className="w-1/2">
                <div className="relative mb-2 h-[120px] w-full overflow-hidden rounded-md">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="line-clamp-1 text-xs font-medium">
                  {book.title}
                </h4>
                <p className="text-xs text-gray-500">{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen pb-12">
      {/* 헤더 */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-screen-2xl px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">발견하기</h1>
          <p className="mt-2 text-gray-600">
            다양한 방식으로 새로운 고전을 발견하고 당신의 지적 여정을 확장하세요
          </p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-screen-2xl px-6 py-8">
        {/* 탑 배너 캐러셀 */}
        <div className="mb-12">
          <Carousel className="rounded-xl border border-gray-100">
            <CarouselContent>
              <CarouselItem>
                <div className="relative h-[360px] w-full overflow-hidden">
                  <Image
                    src="https://placehold.co/1200x360/e2e8f0/1e293b?text=고전산책+큐레이션"
                    alt="고전산책 큐레이션"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                      신규 큐레이션
                    </span>
                    <h2 className="mb-2 text-3xl font-bold text-white">
                      2024 고전산책 특별 선정
                    </h2>
                    <p className="mb-4 max-w-md text-lg text-white/90">
                      인간과 사회에 대한 깊은 통찰이 담긴 작품들을 선별했습니다
                    </p>
                    <Button className="gap-2">
                      자세히 보기 <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="relative h-[360px] w-full overflow-hidden">
                  <Image
                    src="https://placehold.co/1200x360/e2e8f0/1e293b?text=노벨문학상+특집"
                    alt="노벨문학상 특집"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <span className="mb-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                      수상작 모음
                    </span>
                    <h2 className="mb-2 text-3xl font-bold text-white">
                      노벨문학상 수상작 특집
                    </h2>
                    <p className="mb-4 max-w-md text-lg text-white/90">
                      인류의 문학적 유산을 빛낸 노벨문학상 수상작을 살펴보세요
                    </p>
                    <Button className="gap-2">
                      자세히 보기 <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        {/* 큐레이션 섹션 */}
        <div className="mb-12">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                <Sparkles className="mr-2 inline-block h-6 w-6 text-blue-500" />
                큐레이션 & 컬렉션
              </h2>
              <TabsList>
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="classics">고전산책 큐레이션</TabsTrigger>
                <TabsTrigger value="snu-recommend">서울대 권장도서</TabsTrigger>
                <TabsTrigger value="awards">Awards 수상작</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              {curationSections.map(section => (
                <div key={section.id} className="mb-10">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      더 보기 <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {section.collections.map(collection => (
                      <CurationCard
                        key={collection.id}
                        collection={collection}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            {curationSections.map(section => (
              <TabsContent key={section.id} value={section.id} className="mt-0">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {section.collections.map(collection => (
                    <CurationCard key={collection.id} collection={collection} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <Separator className="my-12" />

        {/* 명사 추천 섹션 */}
        <div className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              <User className="mr-2 inline-block h-6 w-6 text-indigo-500" />
              명사 추천 도서
            </h2>
            <Button variant="outline" size="sm">
              더 많은 명사 보기
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {celebrityRecommendations.map(celebrity => (
              <CelebrityRecommendationCard
                key={celebrity.id}
                celebrity={celebrity}
              />
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        {/* 시대별 고전 섹션 */}
        <div className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              <Library className="mr-2 inline-block h-6 w-6 text-amber-500" />
              시대별 고전
            </h2>
            <Button variant="outline" size="sm">
              전체 보기
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {historicalPeriods.map(period => (
              <HistoricalPeriodCard key={period.id} period={period} />
            ))}
          </div>
        </div>

        {/* 특별 컬렉션 */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              <Award className="mr-2 inline-block h-6 w-6 text-purple-500" />
              특별 컬렉션
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="group relative overflow-hidden rounded-xl border border-gray-100">
              <div className="relative h-[240px] w-full overflow-hidden">
                <Image
                  src="https://placehold.co/600x240/e2e8f0/1e293b?text=현대+고전"
                  alt="현대 고전"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="mb-2 text-2xl font-bold">
                    현대에 다시 읽는 고전
                  </h3>
                  <p className="mb-4 text-white/90">
                    현대 사회에 더욱 중요해진 고전 텍스트를 새롭게 해석합니다
                  </p>
                  <Button className="gap-2">
                    살펴보기 <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl border border-gray-100">
              <div className="relative h-[240px] w-full overflow-hidden">
                <Image
                  src="https://placehold.co/600x240/e2e8f0/1e293b?text=초보자+가이드"
                  alt="초보자 가이드"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="mb-2 text-2xl font-bold">
                    고전 독서 초보자 가이드
                  </h3>
                  <p className="mb-4 text-white/90">
                    고전 독서를 처음 시작하는 분들을 위한 큐레이션
                  </p>
                  <Button className="gap-2">
                    살펴보기 <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
