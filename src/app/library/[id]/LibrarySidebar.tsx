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

  // Update 메시지를 형식화하는 함수
  const formatUpdateMessage = (message: string): React.ReactNode => {
    // 라이브러리 생성 메시지인 경우
    if (isLibraryCreateUpdate(message)) {
      // "서재 {서재명}(이)가 생성되었습니다" 또는 "🏛️ {서재명}이 생성되었습니다" 패턴 매칭
      const match = message.match(
        /(?:서재 (.+?)(?:\(이\)|\(가\))?가|🏛️ (.+?)이) 생성되었습니다/
      );
      if (match && (match[1] || match[2])) {
        const libraryName = match[1] || match[2];
        return (
          <>
            🏛️ <span className="font-medium text-gray-800">{libraryName}</span>
            이 생성되었습니다.
          </>
        );
      }
      return message;
    }

    // 책 추가 메시지인 경우
    if (isAddBookUpdate(message)) {
      // "책 {책제목}(이)가 {서재명}에 추가되었습니다" 패턴 매칭
      const match = message.match(
        /책 (.+?)(?:\(이\)|\(가\))?가 (.+?)에 추가되었습니다/
      );
      if (match && match[1] && match[2]) {
        const bookTitle = match[1];
        const libraryName = match[2];
        return (
          <>
            📚 <span className="font-medium text-gray-800">{bookTitle}</span>이{' '}
            <span className="font-medium text-gray-800">{libraryName}</span>에
            추가되었습니다.
          </>
        );
      }
      return message.includes('📚') ? message : `📚 ${message}`;
    }

    return message;
  };

  // 메시지 내용으로 업데이트 유형 추정
  const isAddBookUpdate = (message: string): boolean => {
    if (!message) return false;
    // Check for both the book emoji and the Korean text for book addition
    return (
      message.includes('📚') ||
      (message.includes('책') && message.includes('추가'))
    );
  };

  // 메시지에 라이브러리 생성 내용이 있는지 확인하는 함수
  const isLibraryCreateUpdate = (message: string): boolean => {
    if (!message) return false;
    // Use a more reliable check for library creation messages
    return (
      message.includes('🏛️') ||
      (message.includes('서재') &&
        (message.includes('생성') || message.includes('만들')))
    );
  };

  // 현재 사용자가 구독자인지 확인하는 함수
  const isCurrentUserSubscriber = (subscriberId: number) => {
    return currentUser?.id === subscriberId;
  };

  // 가장 최근 업데이트
  const renderRecentUpdates = () => {
    if (!library.recentUpdates?.length) {
      return (
        <div className="text-gray-500 italic">아직 업데이트가 없습니다.</div>
      );
    }

    return library.recentUpdates.slice(0, 3).map((update, index) => {
      const formattedMessage = formatUpdateMessage(update.message);
      const isReactNode = typeof formattedMessage !== 'string';

      return (
        <div key={index} className="mb-2 rounded-md bg-white p-3 last:mb-0">
          <div className="flex flex-col">
            <div className="text-gray-700">
              {isReactNode ? (
                formattedMessage
              ) : (
                <div dangerouslySetInnerHTML={{ __html: formattedMessage }} />
              )}
            </div>
            <span className="mt-1 text-xs text-gray-500">
              {formatRelativeTime(update.date)}
            </span>
          </div>
        </div>
      );
    });
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
          <div className="space-y-3">{renderRecentUpdates()}</div>

          <div className="mt-4 flex items-center justify-center rounded-lg bg-gray-100 p-2.5 text-xs text-gray-600">
            구독하면 이 서재의 모든 활동 소식을 볼 수 있습니다
          </div>
        </div>
      )}
    </div>
  );
}
