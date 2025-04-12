import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { LibraryCardProps } from '../types';

export function LibraryCard({ library }: LibraryCardProps) {
  // 태그가 있는지 확인
  const hasTags = library.tags && library.tags.length > 0;

  return (
    <Link href={`/library/${library.id}`}>
      <Card className="group h-full rounded-xl border-none bg-[#F9FAFB] shadow-none transition-all duration-200 hover:bg-[#F2F4F6]">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-0">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${library.owner.id}`}
                alt={library.owner.username}
              />
              <AvatarFallback>
                {library.owner.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-semibold text-gray-900">
                  {library.name}
                </h3>
                {/* 태그 목록 */}
                {hasTags && library.tags && (
                  <div className="flex flex-wrap gap-1">
                    {library.tags.map((tag, index) => (
                      <span
                        key={tag.id}
                        className="rounded-full px-2 py-0.5 text-[11px] font-medium text-gray-700"
                        style={{
                          backgroundColor: getTagColor(index),
                        }}
                      >
                        {tag.tagName}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">{library.owner.username}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {library.description || '설명이 없습니다.'}
          </p>
          <div className="flex w-full gap-2">
            {library.previewBooks?.slice(0, 3).map(book => (
              <div
                key={book.id}
                className="flex-1 overflow-hidden rounded-lg"
                style={{ aspectRatio: '2/3' }}
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-5 pt-0">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{library.subscriberCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{library.bookCount}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

// 태그 색상 배열
const tagColors = [
  '#FEE2E2', // 빨간색
  '#FEF3C7', // 노란색
  '#D1FAE5', // 초록색
  '#DBEAFE', // 파란색
  '#EDE9FE', // 보라색
  '#FCE7F3', // 분홍색
  '#F3F4F6', // 회색
];

// 태그 색상 반환 함수
function getTagColor(index: number): string {
  return tagColors[index % tagColors.length];
}
