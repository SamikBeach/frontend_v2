import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BookOpen, Calendar, Users } from 'lucide-react';
import { FC } from 'react';

interface LibrarySidebarInfoProps {
  booksCount: number;
  subscriberCount: number;
  createdAt: Date | string;
}

export const LibrarySidebarInfo: FC<LibrarySidebarInfoProps> = ({
  booksCount,
  subscriberCount,
  createdAt,
}) => {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <h3 className="mb-3 font-medium text-gray-900">서재 정보</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen className="h-4 w-4" />
            <span>책</span>
          </div>
          <span className="font-medium text-gray-900">{booksCount}권</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span>구독자</span>
          </div>
          <span className="font-medium text-gray-900">{subscriberCount}명</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>생성일</span>
          </div>
          <span className="font-medium text-gray-900">
            {format(new Date(createdAt), 'yyyy년 MM월 dd일', {
              locale: ko,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
