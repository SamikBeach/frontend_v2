import { Library, LibraryTag } from '@/apis/library/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BellIcon, BellOffIcon } from 'lucide-react';

interface LibraryHeaderProps {
  library: Library;
  isSubscribed?: boolean;
  notificationsEnabled?: boolean;
  onSubscriptionToggle?: () => void;
  onNotificationToggle?: () => void;
}

// 실제 API에서 오는 태그 타입 (LibraryTag 인터페이스와 일치하지 않는 경우를 위한 추가 타입)
interface ApiTag extends LibraryTag {
  tagName?: string;
}

// 파스텔톤 색상 배열
const pastelColors = [
  '#FFD6E0', // 연한 분홍
  '#FFEFB5', // 연한 노랑
  '#D1F0C2', // 연한 초록
  '#C7CEEA', // 연한 파랑
  '#F0E6EF', // 연한 보라
  '#E2F0CB', // 연한 민트
];

export function LibraryHeader({
  library,
  isSubscribed = false,
  notificationsEnabled = false,
  onSubscriptionToggle,
  onNotificationToggle,
}: LibraryHeaderProps) {
  // 태그가 있는지 확인
  const hasTags = library.tags && library.tags.length > 0;

  // API 응답 데이터를 콘솔에 출력하여 디버깅
  console.log('Library tags:', library.tags);

  return (
    <div className="flex items-center justify-between bg-white py-6 pr-8 pl-8">
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">{library.name}</h1>
          {hasTags && library.tags && (
            <div className="flex gap-1.5">
              {library.tags.map((tag, index) => (
                <Badge
                  key={tag.id}
                  className="rounded-full border-0 px-3 py-0.5 text-xs font-medium text-gray-700"
                  style={{
                    backgroundColor: pastelColors[index % pastelColors.length],
                  }}
                >
                  {(tag as ApiTag).tagName || tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">
            {library.owner.username}
          </span>
          님의 서재
        </p>
      </div>

      {/* 구독 버튼 영역 */}
      {onSubscriptionToggle && (
        <div className="flex gap-2">
          {isSubscribed && onNotificationToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNotificationToggle}
              className="text-gray-600 hover:bg-gray-100"
            >
              {notificationsEnabled ? (
                <BellIcon className="mr-2 h-4 w-4" />
              ) : (
                <BellOffIcon className="mr-2 h-4 w-4" />
              )}
              {notificationsEnabled ? '알림 켜짐' : '알림 꺼짐'}
            </Button>
          )}
          <Button
            variant={isSubscribed ? 'outline' : 'default'}
            size="sm"
            onClick={onSubscriptionToggle}
          >
            {isSubscribed ? '구독 중' : '구독하기'}
          </Button>
        </div>
      )}
    </div>
  );
}
