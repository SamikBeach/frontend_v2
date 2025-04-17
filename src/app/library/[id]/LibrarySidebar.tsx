import { useLibraryDetail } from '@/app/libraries/hooks/useLibraryDetail';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BookOpen, Calendar, Clock, Users } from 'lucide-react';
import { useParams } from 'next/navigation';

export function LibrarySidebar() {
  const params = useParams();
  const libraryId = parseInt(params.id as string, 10);
  const currentUser = useCurrentUser();

  // useLibraryDetail 훅으로 상태와 핸들러 함수 가져오기
  const { library } = useLibraryDetail(libraryId);

  if (!library) {
    return null;
  }

  // 상대적 시간 포맷팅 (예: "2일 전")
  const formatRelativeTime = (date: Date): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko });
  };

  // 구독자 정보 (최대 3명)
  const previewSubscribers = library.subscribers?.slice(0, 3) || [];

  // 업데이트 메시지에서 책 제목을 강조 처리하는 함수
  const formatUpdateMessage = (message: string) => {
    // 책 제목 추출 및 강조 처리
    if (!message) return '';

    // 예: "라이브러리에 새로운 책이 추가되었습니다: 네 인생 우습지 않다 - 인생 일타강사 전한길의 50가지 행복론"
    // 책 제목은 ":" 이후의 텍스트로 간주
    if (message.includes('추가되었습니다:')) {
      const parts = message.split('추가되었습니다:');
      if (parts.length > 1) {
        const bookTitle = parts[1].trim();
        return `📚 <span class="font-medium text-gray-800">${bookTitle}</span>이 서재에 추가되었습니다.`;
      }
    }

    // 서재 생성 메시지 포맷팅
    if (message.includes('서재 "') && message.includes('"가 생성되었습니다')) {
      const regex = /서재 "(.+)"가 생성되었습니다/;
      const match = message.match(regex);
      if (match && match[1]) {
        const libraryName = match[1];
        return `🏛️ <span class="font-medium text-gray-800">${libraryName}</span>이 생성되었습니다.`;
      }
    }

    return message;
  };

  // 메시지 내용으로 업데이트 유형 추정
  const isAddBookUpdate = (message: string): boolean => {
    if (!message) return false;
    return (
      (message.includes('추가') || message.includes('📚')) &&
      (message.includes('책') || message.includes('도서'))
    );
  };

  // 현재 사용자가 구독자인지 확인하는 함수
  const isCurrentUserSubscriber = (subscriberId: number) => {
    return currentUser?.id === subscriberId;
  };

  return (
    <div className="space-y-6">
      {/* 서재 소유자 정보 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-gray-200">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${library.owner.id}`}
                alt={library.owner.username}
              />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {library.owner.username[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900">
                {library.owner.username}
              </h3>
              <p className="text-sm text-gray-500">@{library.owner.username}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 rounded-full bg-gray-200 text-xs hover:bg-gray-300"
            // TODO: 유저 팔로우 기능 - 추후 구현 예정
          >
            팔로우
          </Button>
        </div>
      </div>

      {/* 서재 정보 */}
      <div className="rounded-xl bg-gray-50 p-4">
        <h3 className="mb-3 font-medium text-gray-900">서재 정보</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen className="h-4 w-4" />
              <span>책</span>
            </div>
            <span className="font-medium text-gray-900">
              {library.books?.length || 0}권
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span>구독자</span>
            </div>
            <span className="font-medium text-gray-900">
              {library.subscriberCount}명
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>생성일</span>
            </div>
            <span className="font-medium text-gray-900">
              {format(new Date(library.createdAt), 'yyyy년 MM월 dd일', {
                locale: ko,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* 구독자 미리보기 */}
      {library.subscribers && library.subscribers.length > 0 && (
        <div className="rounded-xl bg-gray-50 p-4">
          <h3 className="font-medium text-gray-900">구독자</h3>

          <div className="mt-3 space-y-3">
            {previewSubscribers.length > 0 ? (
              previewSubscribers.map(subscriber => (
                <div key={subscriber.id} className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarImage
                      src={
                        subscriber.profileImage ||
                        `https://i.pravatar.cc/150?u=${subscriber.id}`
                      }
                      alt={subscriber.username}
                    />
                    <AvatarFallback className="bg-gray-200">
                      {subscriber.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {subscriber.username}
                    </p>
                  </div>
                  {!isCurrentUserSubscriber(subscriber.id) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 rounded-full text-xs"
                      // TODO: 유저 팔로우 기능 - 추후 구현 예정
                    >
                      팔로우
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500">
                아직 구독자가 없습니다.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 업데이트 알림 섹션 */}
      {library.recentUpdates && library.recentUpdates.length > 0 && (
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="mb-3 flex items-center">
            <Clock className="mr-2 h-4 w-4 text-gray-500" />
            <h3 className="font-medium text-gray-900">최근 활동</h3>
          </div>
          <div className="space-y-3">
            {library.recentUpdates.map((update, index) => (
              <div
                key={index}
                className="relative rounded-lg bg-white p-3 text-sm"
              >
                <div className="flex flex-col">
                  <p
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: formatUpdateMessage(update.message),
                    }}
                  />
                  <span className="mt-1 text-xs text-gray-500">
                    {formatRelativeTime(update.date)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center rounded-lg bg-gray-100 p-2.5 text-xs text-gray-600">
            구독하면 이 서재의 모든 활동 소식을 볼 수 있습니다
          </div>
        </div>
      )}
    </div>
  );
}
