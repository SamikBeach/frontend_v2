'use client';

import {
  BookOpen,
  Compass,
  Lightbulb,
  MessageCircle,
  ThumbsUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { LibraryCard } from '@/app/libraries/components/LibraryCard';
import { Book, BookCard } from '@/components/BookCard';
import { BookDialog } from '@/components/BookDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// 더미 데이터
const popularBooks: Book[] = [
  {
    id: 1,
    title: '소크라테스의 변명',
    author: '플라톤',
    coverImage: `https://picsum.photos/seed/book1/240/360`,
    category: '철학',
    subcategory: 'ancient-philosophy',
    rating: 4.8,
    reviews: 128,
    description: '플라톤의 대화편으로, 진정한 지혜의 의미를 탐구하는 고전',
    publishDate: '2024-01-15',
    publisher: '고전출판사',
  },
  {
    id: 2,
    title: '죄와 벌',
    author: '표도르 도스토예프스키',
    coverImage: `https://picsum.photos/seed/book2/240/360`,
    category: '문학',
    subcategory: 'russian-literature',
    rating: 4.9,
    reviews: 245,
    description: '인간의 죄의식과 구원을 탐구하는 도스토예프스키의 대표작',
    publishDate: '2023-11-20',
    publisher: '세계문학사',
  },
  {
    id: 3,
    title: '로마제국 쇠망사',
    author: '에드워드 기번',
    coverImage: `https://picsum.photos/seed/book3/240/360`,
    category: '역사',
    subcategory: 'ancient-history',
    rating: 4.7,
    reviews: 96,
    description: '로마 제국의 번영과 쇠락을 다룬 역사서',
    publishDate: '2023-09-05',
    publisher: '역사연구소',
  },
  {
    id: 4,
    title: '국부론',
    author: '애덤 스미스',
    coverImage: `https://picsum.photos/seed/book7/240/360`,
    category: '경제',
    subcategory: 'economics',
    rating: 4.6,
    reviews: 156,
    description: '근대 경제학의 기초를 세운 애덤 스미스의 대표작',
    publishDate: '2023-08-12',
    publisher: '경제연구소',
  },
  {
    id: 5,
    title: '프로테스탄트 윤리와 자본주의 정신',
    author: '막스 베버',
    coverImage: `https://picsum.photos/seed/book8/240/360`,
    category: '사회학',
    subcategory: 'sociology',
    rating: 4.5,
    reviews: 110,
    description: '자본주의 발전에 종교가 미친 영향을 분석한 사회학 고전',
    publishDate: '2023-10-08',
    publisher: '사회과학출판',
  },
  {
    id: 6,
    title: '군주론',
    author: '니콜로 마키아벨리',
    coverImage: `https://picsum.photos/seed/book9/240/360`,
    category: '정치학',
    subcategory: 'political-philosophy',
    rating: 4.7,
    reviews: 178,
    description: '권력과 통치에 관한 냉철한 현실주의적 분석을 담은 정치학 고전',
    publishDate: '2023-07-20',
    publisher: '정치학연구소',
  },
];

// 오늘의 발견 데이터
const discoveryBooks: Book[] = [
  {
    id: 101,
    title: '니코마코스 윤리학',
    author: '아리스토텔레스',
    coverImage: `https://picsum.photos/seed/book10/240/360`,
    category: '철학',
    subcategory: 'ethics',
    rating: 4.8,
    reviews: 112,
    description: '행복과 덕에 대한 아리스토텔레스의 탐구',
    publishDate: '2023-12-05',
    publisher: '고전철학사',
  },
  {
    id: 102,
    title: '순수이성비판',
    author: '임마누엘 칸트',
    coverImage: `https://picsum.photos/seed/book11/240/360`,
    category: '철학',
    subcategory: 'metaphysics',
    rating: 4.7,
    reviews: 98,
    description: '인간 인식의 한계와 가능성에 대한 칸트의 대표작',
    publishDate: '2023-11-15',
    publisher: '이성출판',
  },
  {
    id: 103,
    title: '안나 카레니나',
    author: '레프 톨스토이',
    coverImage: `https://picsum.photos/seed/book13/240/360`,
    category: '문학',
    subcategory: 'russian-literature',
    rating: 4.9,
    reviews: 215,
    description: '사랑과 결혼, 배신을 다룬 톨스토이의 대표작',
    publishDate: '2023-10-12',
    publisher: '세계문학사',
  },
  {
    id: 104,
    title: '오디세이아',
    author: '호메로스',
    coverImage: `https://picsum.photos/seed/book14/240/360`,
    category: '문학',
    subcategory: 'epic-poetry',
    rating: 4.7,
    reviews: 156,
    description: '트로이 전쟁 영웅 오디세우스의 모험을 그린 서사시',
    publishDate: '2023-09-18',
    publisher: '고전문학사',
  },
];

// 커뮤니티 카테고리
const mainCategories = [
  {
    id: 'all',
    name: '전체',
    color: '#E2E8F0',
  },
  {
    id: 'discussion',
    name: '토론',
    color: '#FFF8E2',
  },
  {
    id: 'bookreport',
    name: '독서 감상',
    color: '#F2E2FF',
  },
  {
    id: 'question',
    name: '질문',
    color: '#FFE2EC',
  },
  {
    id: 'meetup',
    name: '모임',
    color: '#E2FFFC',
  },
];

const popularLibraries = [
  {
    id: 1,
    title: '철학의 시작',
    description: '서양 철학의 기초를 다지는 필수 고전들',
    category: 'philosophy',
    owner: {
      name: '김철수',
      username: 'cheolsu',
      avatar: `https://i.pravatar.cc/150?u=user1`,
    },
    followers: 128,
    isPublic: true,
    tags: ['철학', '고전', '그리스'],
    timestamp: '2024-04-01T14:32:00',
    books: [
      {
        id: 1,
        title: '소크라테스의 변명',
        author: '플라톤',
        coverImage: `https://picsum.photos/seed/book1/240/360`,
      },
      {
        id: 2,
        title: '니코마코스 윤리학',
        author: '아리스토텔레스',
        coverImage: `https://picsum.photos/seed/book4/240/360`,
      },
    ],
  },
  {
    id: 2,
    title: '문학의 향기',
    description: '세계 문학의 걸작들을 모아둔 서재입니다',
    category: 'literature',
    owner: {
      name: '이영희',
      username: 'younghee',
      avatar: `https://i.pravatar.cc/150?u=user2`,
    },
    followers: 256,
    isPublic: true,
    tags: ['문학', '소설', '세계문학'],
    timestamp: '2024-03-28T11:15:00',
    books: [
      {
        id: 3,
        title: '죄와 벌',
        author: '표도르 도스토예프스키',
        coverImage: `https://picsum.photos/seed/book2/240/360`,
      },
      {
        id: 4,
        title: '1984',
        author: '조지 오웰',
        coverImage: `https://picsum.photos/seed/book5/240/360`,
      },
    ],
  },
  {
    id: 3,
    title: '역사 속의 지혜',
    description: '역사 속에서 배우는 삶의 교훈',
    category: 'history',
    owner: {
      name: '박지민',
      username: 'jimin',
      avatar: `https://i.pravatar.cc/150?u=user3`,
    },
    followers: 189,
    isPublic: true,
    tags: ['역사', '고전', '교양'],
    timestamp: '2024-03-25T09:45:00',
    books: [
      {
        id: 5,
        title: '로마제국 쇠망사',
        author: '에드워드 기번',
        coverImage: `https://picsum.photos/seed/book3/240/360`,
      },
      {
        id: 6,
        title: '사기',
        author: '사마천',
        coverImage: `https://picsum.photos/seed/book6/240/360`,
      },
    ],
  },
  {
    id: 4,
    title: '경제학의 기초',
    description: '경제 사상의 흐름을 이해하는 핵심 도서',
    category: 'economics',
    owner: {
      name: '최경제',
      username: 'economist',
      avatar: `https://i.pravatar.cc/150?u=user4`,
    },
    followers: 144,
    isPublic: true,
    tags: ['경제', '학문', '금융'],
    timestamp: '2024-03-22T08:30:00',
    books: [
      {
        id: 7,
        title: '국부론',
        author: '애덤 스미스',
        coverImage: `https://picsum.photos/seed/book7/240/360`,
      },
      {
        id: 8,
        title: '자본론',
        author: '칼 마르크스',
        coverImage: `https://picsum.photos/seed/book8/240/360`,
      },
    ],
  },
];

const communityPosts = [
  {
    id: 1,
    title: '소크라테스의 변명을 읽고 깨달은 지혜의 의미',
    content:
      '플라톤의 대화편을 읽으면서 "나는 내가 아무것도 모른다는 것을 안다"라는 소크라테스의 말이 정말 깊은 의미를 가진다고 느꼈습니다. 지식에 대한 겸손함과 끊임없는 질문의 중요성을 일상에서도 실천해보려 합니다. 여러분은 이 구절에 대해 어떻게 생각하시나요?',
    author: {
      name: '김철수',
      avatar: `https://i.pravatar.cc/150?u=user1`,
    },
    likes: 24,
    comments: 8,
    shares: 3,
    createdAt: '2시간 전',
    timestamp: '2024-04-05T14:32:00',
    category: 'discussion',
    image: null,
    book: {
      title: '소크라테스의 변명',
      author: '플라톤',
      coverImage: `https://picsum.photos/seed/book1/240/360`,
    },
  },
  {
    id: 2,
    title: '죄와 벌의 라스콜리니코프 분석: 진정한 죄책감이란 무엇인가',
    content:
      '도스토예프스키가 그려낸 라스콜리니코프의 심리 묘사가 인상적이었습니다. 특히 그의 범죄 이후 느끼는 죄책감과 도덕적 갈등이 단순한 법률적 처벌보다 더 큰 형벌이 될 수 있음을 보여줍니다. 이 작품은 우리에게 양심과 도덕적 책임에 대해 깊이 생각해보게 합니다.',
    author: {
      name: '이영희',
      avatar: `https://i.pravatar.cc/150?u=user2`,
    },
    likes: 18,
    comments: 12,
    shares: 5,
    createdAt: '4시간 전',
    timestamp: '2024-04-05T12:15:00',
    category: 'bookreport',
    image: `https://picsum.photos/seed/post2/600/400`,
    book: {
      title: '죄와 벌',
      author: '표도르 도스토예프스키',
      coverImage: `https://picsum.photos/seed/book2/240/360`,
    },
  },
];

export default function HomePage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // 카테고리 찾기 함수
  const getCategoryInfo = (categoryId: string) => {
    return mainCategories.find(cat => cat.id === categoryId);
  };

  return (
    <div className="bg-white">
      {/* 메인 컨텐츠 - 2x2 그리드 구조로 변경 */}
      <div className="grid auto-rows-auto grid-cols-2 gap-2">
        {/* 인기 있는 책 섹션 */}
        <section className="h-auto p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[#3182F6]" />
              <h2 className="text-xl font-semibold text-gray-900">
                지금 인기 있는 책
              </h2>
            </div>
            <Link href="/popular">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                더보기
              </Button>
            </Link>
          </div>
          <div className="flex gap-4">
            {popularBooks.slice(0, 3).map(book => (
              <div key={book.id} className="w-1/3">
                <BookCard book={book} onClick={setSelectedBook} />
              </div>
            ))}
          </div>
        </section>

        {/* 오늘의 발견 섹션 */}
        <section className="h-auto p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-[#00C471]" />
              <h2 className="text-xl font-semibold text-gray-900">
                오늘의 발견
              </h2>
            </div>
            <Link href="/discover">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                더보기
              </Button>
            </Link>
          </div>
          <div className="flex gap-4">
            {discoveryBooks.slice(0, 3).map(book => (
              <div key={book.id} className="w-1/3">
                <BookCard book={book} onClick={setSelectedBook} />
              </div>
            ))}
          </div>
        </section>

        {/* 인기 서재 */}
        <section className="h-auto p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#3B82F6]" />
              <h2 className="text-xl font-semibold text-gray-900">인기 서재</h2>
            </div>
            <Link href="/libraries">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                더보기
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {popularLibraries.slice(0, 2).map(library => (
              <div key={library.id}>
                <LibraryCard library={library} />
              </div>
            ))}
          </div>
        </section>

        {/* 커뮤니티 */}
        <section className="h-auto p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#9935FF]" />
              <h2 className="text-xl font-semibold text-gray-900">
                커뮤니티 인기글
              </h2>
            </div>
            <Link href="/community">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                더보기
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {communityPosts.map(post => {
              const category = getCategoryInfo(post.category);

              return (
                <Card
                  key={post.id}
                  className="group rounded-xl border border-gray-200"
                >
                  <CardHeader className="p-4 pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-0">
                        <AvatarImage
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gray-100 text-gray-800">
                          {post.author.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          {category && (
                            <span
                              className="rounded-full px-2 py-0.5 text-[11px] font-medium text-gray-700"
                              style={{
                                backgroundColor: category.color,
                              }}
                            >
                              {category.name}
                            </span>
                          )}
                          <p className="text-xs text-gray-500">
                            {post.author.name} · {post.createdAt}
                          </p>
                        </div>
                        <p className="mt-1 text-[15px] font-medium text-gray-900 transition-colors duration-150 group-hover:text-[#3182F6]">
                          {post.title}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pt-0 pb-3">
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {post.content}
                    </p>
                    {post.book && (
                      <div className="mt-3 flex gap-3 rounded-xl border border-gray-100 bg-[#F9FAFB] p-3">
                        <div className="flex-shrink-0">
                          <img
                            src={post.book.coverImage}
                            alt={post.book.title}
                            className="h-[70px] w-[45px] rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between py-1">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {post.book.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {post.book.author}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <Separator className="bg-gray-100" />
                  <CardFooter className="flex items-center px-4 py-3 text-xs text-gray-500">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5">
                        <ThumbsUp className="h-3.5 w-3.5 text-gray-400" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="h-3.5 w-3.5 text-gray-400" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
      </div>

      {/* 책 상세 정보 Dialog */}
      {selectedBook && (
        <BookDialog
          book={{
            ...selectedBook,
            coverImage: `https://picsum.photos/seed/book${selectedBook.id}/400/600`,
            publisher: selectedBook.publisher,
            publishDate: selectedBook.publishDate,
            description: selectedBook.description,
            toc: `1장. 서론\n2장. 본론\n  2.1 첫 번째 주제\n  2.2 두 번째 주제\n3장. 결론`,
            authorInfo:
              '저자는 해당 분야에서 30년 이상의 경력을 가진 전문가입니다. 다수의 저서를 통해 깊이 있는 통찰을 전달해 왔습니다.',
            tags: ['고전', selectedBook.category, selectedBook.subcategory],
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
