'use client';

import {
  BookOpen,
  Compass,
  Lightbulb,
  MoreHorizontal,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
// import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { BookDialog } from '@/components/BookDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// 더미 데이터
const popularBooks = [
  {
    id: 1,
    title: '소크라테스의 변명',
    author: '플라톤',
    coverImage: `https://picsum.photos/seed/book1/240/360`,
    category: '철학',
    rating: 4.8,
    reviews: 128,
  },
  {
    id: 2,
    title: '죄와 벌',
    author: '표도르 도스토예프스키',
    coverImage: `https://picsum.photos/seed/book2/240/360`,
    category: '문학',
    rating: 4.9,
    reviews: 245,
  },
  {
    id: 3,
    title: '로마제국 쇠망사',
    author: '에드워드 기번',
    coverImage: `https://picsum.photos/seed/book3/240/360`,
    category: '역사',
    rating: 4.7,
    reviews: 96,
  },
];

const todayDiscoveries = [
  {
    id: 1,
    title: '오늘의 추천: 철학 입문자를 위한 필수 고전',
    description: '철학의 기초를 다지고 싶은 분들을 위한 오늘의 추천 도서',
    books: [
      {
        id: 1,
        title: '소크라테스의 변명',
        coverImage: `https://picsum.photos/seed/book1/240/360`,
        reason: '플라톤의 대화편으로, 진정한 지혜의 의미를 탐구하는 고전',
      },
      {
        id: 2,
        title: '니코마코스 윤리학',
        coverImage: `https://picsum.photos/seed/book4/240/360`,
        reason: '행복과 덕에 대한 아리스토텔레스의 통찰이 담긴 필수 고전',
      },
    ],
    curator: {
      name: '김철수',
      role: '철학 전문가',
      avatar: `https://i.pravatar.cc/150?u=curator1`,
    },
    date: '2024-04-01',
  },
  {
    id: 2,
    title: '오늘의 테마: 시대를 초월한 문학의 걸작',
    description: '시대를 초월한 문학의 걸작들을 오늘의 테마로 엄선했습니다',
    books: [
      {
        id: 3,
        title: '죄와 벌',
        coverImage: `https://picsum.photos/seed/book2/240/360`,
        reason: '인간의 심리를 깊이 있게 다룬 도스토예프스키의 대표작',
      },
      {
        id: 4,
        title: '1984',
        coverImage: `https://picsum.photos/seed/book5/240/360`,
        reason: '현대 사회의 통제와 자유에 대한 경고를 담은 디스토피아 소설',
      },
    ],
    curator: {
      name: '이영희',
      role: '문학 평론가',
      avatar: `https://i.pravatar.cc/150?u=curator2`,
    },
    date: '2024-04-01',
  },
];

const communityPosts = [
  {
    id: 1,
    title: '소크라테스의 변명을 읽고...',
    content:
      '플라톤의 대화편을 읽으면서 진정한 지혜란 무엇인지 고민하게 되었습니다...',
    author: {
      name: '김철수',
      avatar: `https://i.pravatar.cc/150?u=user1`,
    },
    likes: 24,
    comments: 8,
    createdAt: '2시간 전',
  },
  {
    id: 2,
    title: '죄와 벌의 라스콜리니코프 분석',
    content:
      '도스토예프스키가 그려낸 라스콜리니코프의 심리 묘사가 인상적이었습니다...',
    author: {
      name: '이영희',
      avatar: `https://i.pravatar.cc/150?u=user2`,
    },
    likes: 18,
    comments: 12,
    createdAt: '4시간 전',
  },
];

const popularLibraries = [
  {
    id: 1,
    title: '철학의 시작',
    description: '서양 철학의 기초를 다지는 필수 고전들',
    owner: {
      name: '김철수',
      avatar: `https://i.pravatar.cc/150?u=user1`,
    },
    followers: 128,
    books: [
      {
        id: 1,
        title: '소크라테스의 변명',
        coverImage: `https://picsum.photos/seed/book1/240/360`,
      },
      {
        id: 2,
        title: '니코마코스 윤리학',
        coverImage: `https://picsum.photos/seed/book4/240/360`,
      },
    ],
  },
  {
    id: 2,
    title: '문학의 향기',
    description: '세계 문학의 걸작들을 모아둔 서재입니다',
    owner: {
      name: '이영희',
      avatar: `https://i.pravatar.cc/150?u=user2`,
    },
    followers: 256,
    books: [
      {
        id: 3,
        title: '죄와 벌',
        coverImage: `https://picsum.photos/seed/book2/240/360`,
      },
      {
        id: 4,
        title: '1984',
        coverImage: `https://picsum.photos/seed/book5/240/360`,
      },
    ],
  },
];

export default function HomePage() {
  const [selectedBook, setSelectedBook] = useState<
    (typeof popularBooks)[0] | null
  >(null);

  return (
    <div className="min-h-screen bg-white">
      {/* 인사말 */}
      <div className="border-b border-[#F2F4F6]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-[26px] font-bold text-gray-900">
            안녕하세요, 독서인님
          </h1>
          <p className="mt-1 text-[15px] text-gray-600">
            오늘도 좋은 책과 함께 의미 있는 시간을 보내세요
          </p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 왼쪽 컬럼 */}
          <div className="space-y-6">
            {/* 분야별 인기 */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-[21px] w-[21px] text-[#3182F6]" />
                  <h2 className="text-[17px] font-semibold text-gray-900">
                    분야별 인기
                  </h2>
                </div>
                <Link href="/popular">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[13px] font-medium text-gray-500 hover:text-gray-900"
                  >
                    더보기
                  </Button>
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {popularBooks.map(book => (
                  <div
                    key={book.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="group h-full rounded-xl bg-[#F9FAFB] transition-all hover:bg-[#F2F4F6]">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="text-[15px] font-medium text-gray-900 group-hover:text-[#3182F6]">
                          {book.title}
                        </h3>
                        <p className="mt-0.5 text-[13px] text-gray-500">
                          {book.author}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[13px] text-gray-600">
                            {book.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-[13px] text-gray-600">
                              <Star className="h-3.5 w-3.5" />
                              <span>{book.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[13px] text-gray-600">
                              <Users className="h-3.5 w-3.5" />
                              <span>{book.reviews}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 오늘의 발견 */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="h-[21px] w-[21px] text-[#00C471]" />
                  <div>
                    <h2 className="text-[17px] font-semibold text-gray-900">
                      오늘의 발견
                    </h2>
                    <p className="mt-0.5 text-[13px] text-gray-500">
                      매일 새로운 책과의 만남을 제안합니다
                    </p>
                  </div>
                </div>
                <Link href="/discover">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[13px] font-medium text-gray-500 hover:text-gray-900"
                  >
                    더보기
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {todayDiscoveries.map(discovery => (
                  <Link key={discovery.id} href={`/discover/${discovery.id}`}>
                    <div className="group rounded-xl bg-[#F9FAFB] p-4 transition-all hover:bg-[#F2F4F6]">
                      <div className="flex gap-4">
                        <div className="grid grid-cols-2 gap-2">
                          {discovery.books.map(book => (
                            <div
                              key={book.id}
                              className="relative aspect-[2/3] overflow-hidden rounded-xl"
                            >
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-1 flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <h3 className="text-[15px] font-medium text-gray-900 group-hover:text-[#3182F6]">
                              {discovery.title}
                            </h3>
                            <span className="rounded-full bg-[#F2F4F6] px-2 py-0.5 text-[11px] font-medium text-gray-600">
                              오늘의 추천
                            </span>
                          </div>
                          <p className="mt-1 text-[13px] text-gray-600">
                            {discovery.description}
                          </p>
                          <div className="mt-3 space-y-2">
                            {discovery.books.map(book => (
                              <div key={book.id} className="text-[13px]">
                                <p className="font-medium text-gray-900">
                                  {book.title}
                                </p>
                                <p className="text-gray-500">{book.reason}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex items-center gap-2 text-[13px] text-gray-500">
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={discovery.curator.avatar}
                                alt={discovery.curator.name}
                              />
                              <AvatarFallback>
                                {discovery.curator.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {discovery.curator.name}
                              </p>
                              <p className="text-[11px] text-gray-500">
                                {discovery.curator.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="space-y-6">
            {/* 커뮤니티 */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-[21px] w-[21px] text-[#9935FF]" />
                  <h2 className="text-[17px] font-semibold text-gray-900">
                    커뮤니티
                  </h2>
                </div>
                <Link href="/community">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[13px] font-medium text-gray-500 hover:text-gray-900"
                  >
                    더보기
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {communityPosts.map(post => (
                  <div
                    key={post.id}
                    className="rounded-xl bg-[#F9FAFB] p-4 transition-all hover:bg-[#F2F4F6]"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={post.author.avatar}
                          alt={post.author.name}
                        />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-[15px] font-medium text-gray-900">
                              {post.title}
                            </h3>
                            <p className="mt-1 text-[13px] text-gray-600">
                              {post.content}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                        <div className="mt-3 flex items-center gap-3 text-[13px] text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </div>
                          <span>{post.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 서재 둘러보기 */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-[21px] w-[21px] text-[#FF6B6B]" />
                  <h2 className="text-[17px] font-semibold text-gray-900">
                    서재 둘러보기
                  </h2>
                </div>
                <Link href="/libraries">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[13px] font-medium text-gray-500 hover:text-gray-900"
                  >
                    더보기
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {popularLibraries.map(library => (
                  <Link key={library.id} href={`/libraries/${library.id}`}>
                    <div className="group rounded-xl bg-[#F9FAFB] p-4 transition-all hover:bg-[#F2F4F6]">
                      <div className="flex gap-4">
                        <div className="grid grid-cols-2 gap-2">
                          {library.books.map(book => (
                            <div
                              key={book.id}
                              className="relative aspect-[2/3] w-20 overflow-hidden rounded-xl"
                            >
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-1 flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <h3 className="text-[15px] font-medium text-gray-900 group-hover:text-[#3182F6]">
                              {library.title}
                            </h3>
                            <TrendingUp className="h-3.5 w-3.5 text-[#FF6B6B]" />
                          </div>
                          <p className="mt-1 text-[13px] text-gray-600">
                            {library.description}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-[13px] text-gray-500">
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={library.owner.avatar}
                                alt={library.owner.name}
                              />
                              <AvatarFallback>
                                {library.owner.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span>{library.owner.name}</span>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{library.followers}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* 책 상세 정보 Dialog */}
      {selectedBook && (
        <BookDialog
          book={{
            ...selectedBook,
            coverImage: `https://picsum.photos/seed/book${selectedBook.id}/400/600`,
            publisher: '고전출판사',
            publishDate: '2024-01-01',
            description:
              '이 책은 고전 문학의 정수를 담고 있습니다. 시대를 초월한 깊이 있는 통찰과 함께, 현대를 살아가는 우리에게도 여전히 유효한 메시지를 전달합니다.',
            toc: `1장. 서론\n2장. 본론\n  2.1 첫 번째 주제\n  2.2 두 번째 주제\n3장. 결론`,
            authorInfo:
              '저자는 해당 분야에서 30년 이상의 경력을 가진 전문가입니다. 다수의 저서를 통해 깊이 있는 통찰을 전달해 왔습니다.',
            tags: ['고전', '철학', '인문학'],
            reviews: [
              {
                id: 1,
                user: {
                  name: '김독서',
                  avatar: `https://i.pravatar.cc/150?u=reader1`,
                },
                rating: 5,
                content:
                  '정말 좋은 책이었습니다. 깊이 있는 통찰과 함께 현대적 해석이 인상적이었습니다.',
                date: '2024-03-15',
                likes: 24,
                comments: 8,
              },
            ],
            similarBooks: popularBooks.map(book => ({
              ...book,
              coverImage: `https://picsum.photos/seed/similar${book.id}/240/360`,
            })),
          }}
          open={!!selectedBook}
          onOpenChange={open => !open && setSelectedBook(null)}
        />
      )}
    </div>
  );
}
