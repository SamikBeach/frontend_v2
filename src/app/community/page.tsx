'use client';

import {
  BookOpen,
  Heart,
  MessageCircle,
  MoreHorizontal,
  PenLine,
  Share2,
  ThumbsUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 더미 사용자 데이터
const users = [
  {
    id: 1,
    name: '김철수',
    username: 'cheolsu',
    avatar: 'https://placehold.co/128x128/e2e8f0/1e293b?text=김철수',
  },
  {
    id: 2,
    name: '이영희',
    username: 'younghee',
    avatar: 'https://placehold.co/128x128/e2e8f0/1e293b?text=이영희',
  },
  {
    id: 3,
    name: '박지민',
    username: 'jimin',
    avatar: 'https://placehold.co/128x128/e2e8f0/1e293b?text=박지민',
  },
  {
    id: 4,
    name: '최동욱',
    username: 'dongwook',
    avatar: 'https://placehold.co/128x128/e2e8f0/1e293b?text=최동욱',
  },
  {
    id: 5,
    name: '정수아',
    username: 'sua',
    avatar: 'https://placehold.co/128x128/e2e8f0/1e293b?text=정수아',
  },
];

// 더미 독서그룹 데이터
const readingGroups = [
  {
    id: 1,
    name: '철학 고전 스터디',
    members: 42,
    image: 'https://placehold.co/200x120/e2e8f0/1e293b?text=철학+고전+스터디',
    description: '소크라테스부터 니체까지, 함께 읽고 토론해요',
  },
  {
    id: 2,
    name: '문학의 밤',
    members: 37,
    image: 'https://placehold.co/200x120/e2e8f0/1e293b?text=문학의+밤',
    description: '매주 한 편의 소설을 함께 읽고 이야기 나눕니다',
  },
  {
    id: 3,
    name: '역사 탐험대',
    members: 25,
    image: 'https://placehold.co/200x120/e2e8f0/1e293b?text=역사+탐험대',
    description: '역사 고전을 통해 과거와 현재를 연결합니다',
  },
];

// 더미 이벤트 데이터
const events = [
  {
    id: 1,
    title: '플라톤 대화록 전문가 특강',
    date: '2024-04-15T18:00:00',
    location: '온라인 ZOOM',
    image: 'https://placehold.co/200x120/e2e8f0/1e293b?text=플라톤+대화록+특강',
  },
  {
    id: 2,
    title: '셰익스피어 4대 비극 독서 모임',
    date: '2024-04-20T14:00:00',
    location: '서울 강남구 책숲 카페',
    image:
      'https://placehold.co/200x120/e2e8f0/1e293b?text=셰익스피어+4대+비극',
  },
];

// 더미 피드 포스트 데이터
const posts = [
  {
    id: 1,
    author: users[0],
    timestamp: '2024-04-01T14:32:00',
    content:
      '칸트의 "순수이성비판"을 드디어 완독했습니다! 이성의 한계와 가능성에 대한 깊은 탐구가 정말 인상적이었어요. 특히 선험적 종합판단이라는 개념이 현대 철학에 미친 영향을 생각해보면 그 중요성이 더욱 와닿습니다. 여러분은 칸트의 어떤 관점이 가장 인상깊으셨나요?',
    book: {
      title: '순수이성비판',
      author: '임마누엘 칸트',
      coverImage:
        'https://placehold.co/240x360/e2e8f0/1e293b?text=순수이성비판',
    },
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: 2,
    author: users[1],
    timestamp: '2024-03-31T11:15:00',
    content:
      '도스토예프스키의 "죄와 벌"을 읽고 있는데, 라스콜니코프의 내적 갈등이 너무 생생하게 그려져 있어요. 인간 심리의 복잡함을 이렇게 깊이 들여다본 작품이 또 있을까요? 특히 죄책감과 속죄의 테마가 현대 사회에도 여전히 큰 울림을 주는 것 같습니다.',
    book: {
      title: '죄와 벌',
      author: '표도르 도스토예프스키',
      coverImage: 'https://placehold.co/240x360/e2e8f0/1e293b?text=죄와+벌',
    },
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=독서+중인+모습',
    likes: 32,
    comments: 12,
    shares: 5,
  },
  {
    id: 3,
    author: users[2],
    timestamp: '2024-03-30T16:45:00',
    content:
      '요즘 철학 고전 스터디에서 니체의 "차라투스트라는 이렇게 말했다"를 함께 읽고 있어요. 초인(Übermensch)의 개념에 대해 열띤 토론을 했는데, 다양한 관점을 들을 수 있어 정말 좋았습니다. 함께 고전을 읽는 즐거움을 다시 한번 느끼는 중입니다. 다음에는 어떤 책을 함께 읽을지 고민이네요.',
    book: {
      title: '차라투스트라는 이렇게 말했다',
      author: '프리드리히 니체',
      coverImage:
        'https://placehold.co/240x360/e2e8f0/1e293b?text=차라투스트라는+이렇게+말했다',
    },
    likes: 45,
    comments: 18,
    shares: 7,
  },
  {
    id: 4,
    author: users[3],
    timestamp: '2024-03-29T09:20:00',
    content:
      '아리스토텔레스의 "니코마코스 윤리학"에서 행복(eudaimonia)의 개념이 현대 심리학의 웰빙 개념과 어떻게 연결되는지 연구 중입니다. 덕의 실천을 통한 행복 추구라는 관점이 오늘날에도 여전히 유효하다고 생각하는데, 여러분의 생각은 어떠신가요?',
    book: {
      title: '니코마코스 윤리학',
      author: '아리스토텔레스',
      coverImage:
        'https://placehold.co/240x360/e2e8f0/1e293b?text=니코마코스+윤리학',
    },
    likes: 29,
    comments: 15,
    shares: 6,
  },
];

// 컴포넌트: 포스트 카드
function PostCard({ post }: { post: (typeof posts)[0] }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [comment, setComment] = useState('');

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${post.author.username}`}
                  className="font-medium text-gray-900 hover:underline"
                >
                  {post.author.name}
                </Link>
                <span className="text-xs text-gray-500">
                  @{post.author.username}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {formatDate(post.timestamp)}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>북마크</DropdownMenuItem>
              <DropdownMenuItem>신고하기</DropdownMenuItem>
              <DropdownMenuItem>이 사용자의 게시물 숨기기</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="whitespace-pre-line text-gray-700">{post.content}</p>
        {post.image && (
          <div className="mt-3 overflow-hidden rounded-lg">
            <Image
              src={post.image}
              alt="Post image"
              width={600}
              height={400}
              className="h-auto w-full object-cover"
            />
          </div>
        )}
        {post.book && (
          <div className="mt-4 flex gap-3 rounded-lg border border-gray-100 p-3">
            <div className="flex-shrink-0">
              <Image
                src={post.book.coverImage}
                alt={post.book.title}
                width={60}
                height={90}
                className="rounded"
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{post.book.title}</h4>
              <p className="text-sm text-gray-500">{post.book.author}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-7 px-2 text-xs text-blue-600"
              >
                <BookOpen className="mr-1 h-3.5 w-3.5" />책 정보 보기
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="pt-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex gap-1 ${liked ? 'text-blue-600' : 'text-gray-600'}`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex gap-1 text-gray-600"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex gap-1 text-gray-600"
            >
              <Share2 className="h-4 w-4" />
              <span>{post.shares}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600">
            <Heart className="h-4 w-4" />
            <span className="ml-1">북마크</span>
          </Button>
        </div>
      </CardFooter>
      <div className="border-t border-gray-100 px-6 py-3">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={users[4].avatar} alt="Your profile" />
            <AvatarFallback>{users[4].name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="댓글을 남겨보세요..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="h-9"
            />
            <Button size="sm" className="h-9" disabled={!comment.trim()}>
              게시
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// 컴포넌트: 독서 그룹 카드
function ReadingGroupCard({ group }: { group: (typeof readingGroups)[0] }) {
  return (
    <Link href={`/community/groups/${group.id}`}>
      <div className="flex gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50">
        <Image
          src={group.image}
          alt={group.name}
          width={80}
          height={80}
          className="h-[80px] w-[80px] rounded-lg object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-medium text-gray-900">{group.name}</h3>
          <p className="text-xs text-gray-500">{group.description}</p>
          <div className="mt-auto flex items-center gap-1 text-xs text-gray-500">
            <Users className="h-3.5 w-3.5" />
            <span>{group.members}명의 회원</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// 컴포넌트: 이벤트 카드
function EventCard({ event }: { event: (typeof events)[0] }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Link href={`/community/events/${event.id}`}>
      <div className="flex gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:bg-gray-50">
        <Image
          src={event.image}
          alt={event.title}
          width={80}
          height={80}
          className="h-[80px] w-[80px] rounded-lg object-cover"
        />
        <div>
          <h3 className="font-medium text-gray-900">{event.title}</h3>
          <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
          <p className="text-xs text-gray-500">{event.location}</p>
        </div>
      </div>
    </Link>
  );
}

// 컴포넌트: 추천 친구 카드
function SuggestedFriendCard({ user }: { user: (typeof users)[0] }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <Link
            href={`/profile/${user.username}`}
            className="font-medium text-gray-900 hover:underline"
          >
            {user.name}
          </Link>
          <p className="text-xs text-gray-500">@{user.username}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="h-8 text-xs">
        팔로우
      </Button>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 헤더 */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">커뮤니티</h1>
          <p className="mt-2 text-gray-600">
            다른 독자들과 생각을 나누고 함께 성장하세요
          </p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 프로필 카드 */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={users[4].avatar} alt="Your profile" />
                      <AvatarFallback>{users[4].name[0]}</AvatarFallback>
                    </Avatar>
                    <h2 className="mt-4 text-xl font-semibold text-gray-900">
                      {users[4].name}
                    </h2>
                    <p className="text-gray-500">@{users[4].username}</p>
                    <div className="mt-4 flex gap-4">
                      <div className="text-center">
                        <p className="font-medium text-gray-900">42</p>
                        <p className="text-xs text-gray-500">팔로워</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">38</p>
                        <p className="text-xs text-gray-500">팔로잉</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">24</p>
                        <p className="text-xs text-gray-500">포스트</p>
                      </div>
                    </div>
                    <Button className="mt-4 w-full">
                      <PenLine className="mr-2 h-4 w-4" />
                      게시물 작성하기
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 독서 그룹 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      나의 독서 그룹
                    </h3>
                    <Button variant="ghost" size="sm">
                      모두 보기
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {readingGroups.slice(0, 2).map(group => (
                      <ReadingGroupCard key={group.id} group={group} />
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />새 독서 그룹 탐색하기
                  </Button>
                </CardFooter>
              </Card>

              {/* 이벤트 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      다가오는 이벤트
                    </h3>
                    <Button variant="ghost" size="sm">
                      모두 보기
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {events.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="lg:col-span-2">
            {/* 피드 필터 */}
            <Tabs defaultValue="recent" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recent">최신순</TabsTrigger>
                <TabsTrigger value="trending">인기순</TabsTrigger>
                <TabsTrigger value="following">팔로잉</TabsTrigger>
              </TabsList>
              <TabsContent value="recent" className="mt-4">
                {/* 포스트 작성 */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={users[4].avatar} alt="Your profile" />
                        <AvatarFallback>{users[4].name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input
                          placeholder="어떤 책에 대해 이야기하고 싶으신가요?"
                          className="h-10"
                        />
                        <div className="mt-3 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <BookOpen className="mr-1 h-3.5 w-3.5" />책 추가
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            사진 추가
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 포스트 목록 */}
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>
              <TabsContent value="trending">
                인기 포스트가 여기에 표시됩니다
              </TabsContent>
              <TabsContent value="following">
                팔로잉 중인 사용자의 포스트가 여기에 표시됩니다
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
