import { Library } from '@/apis/library/types';
import { useLibraryDetail } from '@/app/libraries/hooks/useLibraryDetail';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BookOpen, Calendar, Users } from 'lucide-react';
import { useParams } from 'next/navigation';

interface LibrarySidebarProps {
  library: Library;
  isSubscribed: boolean;
  notificationsEnabled: boolean;
  onSubscriptionToggle: () => Promise<void>;
  onNotificationToggle: () => void;
}

export function LibrarySidebar({ library, isSubscribed }: LibrarySidebarProps) {
  const params = useParams();
  const libraryId = parseInt(params.id as string, 10);

  const { handleSubscriptionToggle } = useLibraryDetail(libraryId);

  return (
    <div className="w-full space-y-6 bg-white p-6">
      {/* 소유자 정보 */}
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={`https://i.pravatar.cc/150?u=${library.owner.id}`}
          />
          <AvatarFallback className="bg-gray-100">
            {library.owner.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-gray-900">
            {library.owner.username}
          </h3>
          <p className="text-sm text-gray-500">{library.owner.email}</p>
        </div>
      </div>

      {/* 구독 버튼 */}
      <Button
        variant={isSubscribed ? 'outline' : 'default'}
        className="w-full rounded-full bg-gray-900 font-medium text-white hover:bg-gray-800"
        onClick={handleSubscriptionToggle}
      >
        {isSubscribed ? '구독 중' : '서재 구독하기'}
      </Button>

      {/* 서재 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-600">
          <BookOpen className="h-4 w-4" />
          <span>{library.books?.length || 0}권의 책</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="h-4 w-4" />
          <span>{library.subscriberCount}명의 구독자</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(library.createdAt), 'yyyy년 MM월 dd일', {
              locale: ko,
            })}
            에 생성됨
          </span>
        </div>
      </div>

      {/* 구독자 미리보기 */}
      {library.subscribers && library.subscribers.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">최근 구독자</h4>
          <div className="space-y-2">
            {library.subscribers.slice(0, 3).map(subscriber => (
              <div
                key={subscriber.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?u=${subscriber.id}`}
                    />
                    <AvatarFallback className="bg-gray-100">
                      {subscriber.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {subscriber.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      @{subscriber.username}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:bg-gray-100"
                >
                  팔로우
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
