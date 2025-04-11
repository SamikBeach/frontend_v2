import { Library } from '@/apis/library/types';
import { useLibraryDetail } from '@/app/libraries/hooks/useLibraryDetail';
import {
  notificationsEnabledAtom,
  subscriptionStatusAtom,
} from '@/atoms/library';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAtom } from 'jotai';
import { BookOpen, Calendar, Users } from 'lucide-react';
import { useParams } from 'next/navigation';

interface LibrarySidebarProps {
  library: Library;
  isSubscribed: boolean;
  notificationsEnabled: boolean;
  onSubscriptionToggle: () => Promise<void>;
  onNotificationToggle: () => void;
}

export function LibrarySidebar({
  library,
  isSubscribed,
  notificationsEnabled,
  onSubscriptionToggle,
  onNotificationToggle,
}: LibrarySidebarProps) {
  const params = useParams();
  const libraryId = parseInt(params.id as string, 10);
  const user = useCurrentUser();
  const { mutate: toggleSubscription } = useLibraryDetail(libraryId);
  const [isSubscribedState, setIsSubscribed] = useAtom(subscriptionStatusAtom);
  const [notificationsEnabledState, setNotificationsEnabled] = useAtom(
    notificationsEnabledAtom
  );

  // useLibraryDetail hook에서 상태 변경 함수만 가져오기
  const { handleSubscriptionToggle, handleNotificationToggle } =
    useLibraryDetail(libraryId, user?.id);

  // 상대적 시간 포맷팅 (예: "2일 전")
  const formatRelativeTime = (date: Date): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko });
  };

  // 구독자 정보 (최대 3명)
  const previewSubscribers = library.subscribers?.slice(0, 3) || [];

  return (
    <div className="space-y-5 px-6">
      {/* 서재 소유자 정보 & 팔로우 버튼 */}
      <div className="rounded-2xl bg-gray-50 p-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={`https://i.pravatar.cc/150?u=${library.owner.id}`}
              alt={library.owner.username}
            />
            <AvatarFallback className="bg-gray-100 text-gray-600">
              {library.owner.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900">
              {library.owner.username}
            </h3>
            <p className="text-sm text-gray-500">@{library.owner.username}</p>
          </div>
        </div>

        <div className="mt-4">
          <Button
            className="w-full rounded-full bg-gray-900 text-white hover:bg-gray-800"
            variant="default"
            onClick={handleSubscriptionToggle}
          >
            {isSubscribed ? '팔로잉' : '팔로우'}
          </Button>
        </div>
      </div>

      {/* 서재 정보 */}
      <div className="rounded-2xl bg-gray-50 p-5">
        <h3 className="mb-3 font-medium text-gray-900">서재 정보</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen className="h-4 w-4" />
              <span>책</span>
            </div>
            <span className="font-medium text-gray-900">
              {library.books?.length || 0}
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
        <div className="rounded-2xl bg-gray-50 p-5">
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
            {previewSubscribers.length > 0 ? (
              previewSubscribers.map(subscriber => (
                <div key={subscriber.id} className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        subscriber.profileImage ||
                        `https://i.pravatar.cc/150?u=${subscriber.id}`
                      }
                      alt={subscriber.username}
                    />
                    <AvatarFallback className="bg-gray-100">
                      {subscriber.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {subscriber.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      @{subscriber.username}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-full border-gray-200 px-3 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    팔로우
                  </Button>
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
        <div className="rounded-2xl bg-gray-50 p-5">
          <h3 className="mb-3 font-medium text-gray-900">최근 업데이트</h3>
          <div className="space-y-3 text-sm">
            {library.recentUpdates.map((update, index) => (
              <div key={index} className="rounded-lg bg-white p-3">
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(update.date)}
                </span>
                <p className="mt-1 text-gray-700">{update.message}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs text-gray-500">
            구독하고 알림을 켜면 이 서재의 모든 업데이트 소식을 받아볼 수
            있습니다.
          </div>
        </div>
      )}
    </div>
  );
}
