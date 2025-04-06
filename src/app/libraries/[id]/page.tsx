'use client';

import { Book, BookCard } from '@/components/BookCard/BookCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Calendar, Grid, List, Users } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { libraries } from '../data';

export default function LibraryDetailPage() {
  // 라우트 파라미터에서 서재 ID 가져오기
  const params = useParams();
  const router = useRouter();
  const libraryId = parseInt(params.id as string);
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 서재 데이터 찾기
  const library = useMemo(() => {
    return libraries.find(lib => lib.id === libraryId);
  }, [libraryId]);

  // 서재가 없으면 404 또는 오류 메시지 표시
  if (!library) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900">
          서재를 찾을 수 없습니다
        </h1>
        <p className="mt-2 text-gray-500">
          요청하신 서재가 존재하지 않거나 삭제되었습니다.
        </p>
        <Button className="mt-4" onClick={() => router.push('/libraries')}>
          서재 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  // 팔로우 상태 토글
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  // 서재 소유자 찾기
  const findLibraryCategory = (libraryCategory: string) => {
    const category = libraryCategory;
    switch (category) {
      case 'philosophy':
        return { name: '철학', color: '#FFF8E2' };
      case 'literature':
        return { name: '문학', color: '#F2E2FF' };
      case 'history':
        return { name: '역사', color: '#FFE2EC' };
      case 'science':
        return { name: '과학', color: '#E2FFFC' };
      default:
        return { name: '기타', color: '#E2E8F0' };
    }
  };

  const libraryCategory = findLibraryCategory(library.category);

  // BookCard에 필요한 onClick 핸들러
  const handleBookClick = (book: Book) => {
    // 책 상세 정보 페이지로 이동하거나 모달 열기 등의 기능 구현
    console.log('Book clicked:', book);
  };

  // 라이브러리 책을 BookCard 형식으로 변환
  const booksWithDetails = library.books.map(book => ({
    ...book,
    category: library.category,
    subcategory: library.tags[0] || '',
    rating: 4.5, // 예시 데이터
    reviews: 120, // 예시 데이터
    description: `${book.title}에 대한 설명입니다.`,
    publishDate: '2023-01-01',
    publisher: '출판사',
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 헤더 */}
      <div className="bg-white py-6">
        <div className="w-full">
          <div className="flex items-center gap-3 pl-8">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {library.title}
                </h1>
                <Badge
                  className="rounded-full px-2 py-0.5 text-xs"
                  style={{ backgroundColor: libraryCategory.color }}
                >
                  {libraryCategory.name}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">
                  {library.owner.name}
                </span>
                님의 서재
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="w-full pb-12">
        <div className="grid gap-8 md:grid-cols-[1fr_320px]">
          {/* 왼쪽: 서재 정보 및 책 목록 */}
          <div className="space-y-8 pl-8">
            {/* 서재 설명 */}
            <div>
              <p className="text-gray-700">{library.description}</p>

              {/* 태그 목록 */}
              <div className="mt-4 flex flex-wrap gap-2">
                {library.tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-full bg-gray-100 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="border-none" />

            {/* 책 목록 */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  포함된 책 ({library.books.length})
                </h2>

                <div className="mr-8 flex rounded-md p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 rounded-sm ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                    <span className="sr-only">그리드 보기</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 rounded-sm ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">리스트 보기</span>
                  </Button>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="mr-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {booksWithDetails.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onClick={handleBookClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="mr-8 space-y-2">
                  {library.books.map(book => (
                    <div
                      key={book.id}
                      className="flex cursor-pointer gap-4 rounded-xl p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="h-32 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600">
                          {book.title}
                        </h3>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {book.author}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 사이드바 */}
          <div className="space-y-6 pr-8">
            {/* 서재 소유자 정보 */}
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={library.owner.avatar}
                    alt={library.owner.name}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {library.owner.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {library.owner.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    @{library.owner.username}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  className="w-full rounded-full"
                  variant={isFollowing ? 'outline' : 'default'}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? '팔로잉' : '팔로우'}
                </Button>
              </div>
            </div>

            {/* 서재 정보 */}
            <div className="rounded-xl bg-gray-50 p-4">
              <h3 className="mb-3 font-medium text-gray-900">서재 정보</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span>책</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {library.books.length}권
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>팔로워</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {library.followers}명
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>생성일</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {new Date(library.timestamp).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* 팔로워 미리보기 */}
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">팔로워</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-gray-500 hover:text-gray-900"
                  onClick={() => {}}
                >
                  모두 보기
                </Button>
              </div>

              <div className="mt-3 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?u=follower${library.id * 3 + i}`}
                        alt="팔로워"
                      />
                      <AvatarFallback className="bg-gray-200">U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        사용자 {i + 1}
                      </p>
                      <p className="text-xs text-gray-500">@user{i + 1}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 rounded-full text-xs"
                    >
                      팔로우
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
