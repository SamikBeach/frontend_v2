'use client';

import {
  Bookmark,
  Filter,
  Grid,
  List,
  Plus,
  Search,
  Settings,
  Star,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 더미 서재 데이터
const libraries = [
  {
    id: 1,
    title: '철학의 시작',
    description: '서양 철학의 기초를 다지는 필수 고전들',
    owner: {
      name: '김철수',
      username: 'cheolsu',
      avatar: 'https://placehold.co/128x128/e2e8f0/1e293b?text=김철수',
    },
    books: [
      {
        id: 1,
        title: '소크라테스의 변명',
        author: '플라톤',
        coverImage:
          'https://placehold.co/240x360/e2e8f0/1e293b?text=소크라테스의+변명',
      },
      {
        id: 2,
        title: '니코마코스 윤리학',
        author: '아리스토텔레스',
        coverImage:
          'https://placehold.co/240x360/e2e8f0/1e293b?text=니코마코스+윤리학',
      },
    ],
    followers: 128,
    isPublic: true,
    tags: ['철학', '고전', '그리스'],
  },
  {
    id: 2,
    title: '문학의 향기',
    description: '세계 문학의 걸작들을 모아둔 서재입니다',
    owner: {
      name: '이영희',
      username: 'younghee',
      avatar: 'https://placehold.co/128x128/e2e8f0/1e293b?text=이영희',
    },
    books: [
      {
        id: 3,
        title: '죄와 벌',
        author: '표도르 도스토예프스키',
        coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=죄와+벌',
      },
      {
        id: 4,
        title: '1984',
        author: '조지 오웰',
        coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=1984',
      },
    ],
    followers: 256,
    isPublic: true,
    tags: ['문학', '소설', '세계문학'],
  },
  {
    id: 3,
    title: '역사 속의 지혜',
    description: '역사 속에서 배우는 삶의 교훈',
    owner: {
      name: '박지민',
      username: 'jimin',
      avatar: 'https://placehold.co/128x128/e2e8f0/1e293b?text=박지민',
    },
    books: [
      {
        id: 5,
        title: '로마제국 쇠망사',
        author: '에드워드 기번',
        coverImage:
          'https://placehold.co/240x360/e2e8f0/1e293b?text=로마제국+쇠망사',
      },
      {
        id: 6,
        title: '사기',
        author: '사마천',
        coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=사기',
      },
    ],
    followers: 89,
    isPublic: true,
    tags: ['역사', '고전', '교양'],
  },
];

// 컴포넌트: 서재 카드 (그리드 뷰)
function LibraryCard({ library }: { library: (typeof libraries)[0] }) {
  return (
    <Link href={`/libraries/${library.id}`}>
      <Card className="group h-full transition-colors hover:bg-gray-50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={library.owner.avatar}
                  alt={library.owner.name}
                />
                <AvatarFallback>{library.owner.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                    {library.title}
                  </h3>
                  {library.isPublic ? (
                    <Users className="h-3.5 w-3.5 text-gray-400" />
                  ) : (
                    <Bookmark className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </div>
                <p className="text-xs text-gray-500">by {library.owner.name}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>서재 관리</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>서재 수정</DropdownMenuItem>
                <DropdownMenuItem>공개 설정</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  서재 삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-gray-600">{library.description}</p>
          <div className="flex flex-wrap gap-1">
            {library.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {library.books.map(book => (
              <div
                key={book.id}
                className="relative aspect-[2/3] overflow-hidden rounded-lg"
              >
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{library.followers}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            <Star className="mr-1 h-3.5 w-3.5" />
            구독하기
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

// 컴포넌트: 서재 카드 (리스트 뷰)
function LibraryListItem({ library }: { library: (typeof libraries)[0] }) {
  return (
    <Link href={`/libraries/${library.id}`}>
      <div className="group flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50">
        <div className="grid grid-cols-2 gap-2">
          {library.books.slice(0, 2).map(book => (
            <div
              key={book.id}
              className="relative aspect-[2/3] w-20 overflow-hidden rounded-lg"
            >
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                {library.title}
              </h3>
              {library.isPublic ? (
                <Users className="h-3.5 w-3.5 text-gray-400" />
              ) : (
                <Bookmark className="h-3.5 w-3.5 text-gray-400" />
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>서재 관리</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>서재 수정</DropdownMenuItem>
                <DropdownMenuItem>공개 설정</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  서재 삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-gray-600">{library.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{library.followers}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {library.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          <Star className="mr-1 h-3.5 w-3.5" />
          구독하기
        </Button>
      </div>
    </Link>
  );
}

export default function LibrariesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 헤더 */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                서재 둘러보기
              </h1>
              <p className="mt-2 text-gray-600">
                다른 독자들의 서재를 구경하고 영감을 얻어보세요
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />새 서재 만들기
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* 필터 및 검색 */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="서재 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 서재 목록 */}
        <div className="space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="following">구독 중</TabsTrigger>
              <TabsTrigger value="popular">인기</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {libraries.map(library => (
                    <LibraryCard key={library.id} library={library} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {libraries.map(library => (
                    <LibraryListItem key={library.id} library={library} />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="following" className="mt-4">
              구독 중인 서재가 여기에 표시됩니다
            </TabsContent>
            <TabsContent value="popular" className="mt-4">
              인기 있는 서재가 여기에 표시됩니다
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
