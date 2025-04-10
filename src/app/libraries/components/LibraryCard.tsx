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
  return (
    <Link href={`/libraries/${library.id}`}>
      <Card className="group h-full rounded-xl border-none bg-[#F9FAFB] shadow-none transition-all duration-200 hover:bg-[#F2F4F6]">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-0">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${library.owner.id}`}
                alt={library.owner.username}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-100 text-gray-800">
                {library.owner.username[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-medium text-gray-900 transition-colors duration-150 group-hover:text-[#3182F6]">
                  {library.name}
                </h3>
                {library.tags && library.tags.length > 0 && (
                  <span
                    className="ml-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-gray-700"
                    style={{
                      backgroundColor: '#F9FAFB',
                    }}
                  >
                    {library.tags[0].name}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{library.owner.username}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pt-0 pb-3">
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {library.description || '설명이 없습니다.'}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {/* 더미 이미지 */}
            <div className="aspect-[2/3] rounded-lg bg-gray-200"></div>
            <div className="aspect-[2/3] rounded-lg bg-gray-200"></div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-5 py-3 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-gray-400" />
              <span>{library.subscriberCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-gray-400" />
              <span>{library.bookCount}권</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
