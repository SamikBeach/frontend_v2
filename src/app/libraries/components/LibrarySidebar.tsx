import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, BookOpen, Calendar, Users } from 'lucide-react';
import { Library } from '../types';

export interface LibrarySidebarProps {
  library: Library;
  isSubscribed: boolean;
  notificationsEnabled: boolean;
  onSubscriptionToggle: () => void;
  onNotificationToggle: () => void;
}

export function LibrarySidebar({
  library,
  isSubscribed,
  notificationsEnabled,
  onSubscriptionToggle,
  onNotificationToggle,
}: LibrarySidebarProps) {
  return (
    <div className="space-y-6">
      {/* 서재 소유자 정보 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={library.owner.avatar} alt={library.owner.name} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {library.owner.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900">{library.owner.name}</h3>
            <p className="text-sm text-gray-500">@{library.owner.username}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Button
            className="w-full rounded-full"
            variant={isSubscribed ? 'outline' : 'default'}
            onClick={onSubscriptionToggle}
          >
            {isSubscribed ? '구독 중' : '구독하기'}
          </Button>

          {isSubscribed && (
            <Button
              className="w-full rounded-full"
              variant="outline"
              onClick={onNotificationToggle}
            >
              <Bell
                className={`mr-2 h-4 w-4 ${
                  notificationsEnabled ? 'text-blue-500' : 'text-gray-500'
                }`}
              />
              {notificationsEnabled ? '알림 켜짐' : '알림 꺼짐'}
            </Button>
          )}
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
              <span>구독자</span>
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

      {/* 구독자 미리보기 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">구독자</h3>
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
                  src={`https://i.pravatar.cc/150?u=follower${
                    library.id * 3 + i
                  }`}
                  alt="구독자"
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

      {/* 업데이트 알림 섹션 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <h3 className="mb-3 font-medium text-gray-900">최근 업데이트</h3>
        <div className="space-y-3 text-sm">
          <div className="rounded-lg bg-white p-3">
            <span className="text-xs text-gray-500">2일 전</span>
            <p className="mt-1 text-gray-700">
              새 책 &ldquo;{library.books[0].title}&rdquo; 추가됨
            </p>
          </div>
          <div className="rounded-lg bg-white p-3">
            <span className="text-xs text-gray-500">1주일 전</span>
            <p className="mt-1 text-gray-700">서재 설명이 업데이트됨</p>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          구독하고 알림을 켜면 이 서재의 모든 업데이트 소식을 받아볼 수
          있습니다.
        </div>
      </div>
    </div>
  );
}
