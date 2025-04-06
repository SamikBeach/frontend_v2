import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { SubscriptionCard } from './SubscriptionCard';

export interface SubscriptionsListProps {
  title?: string;
  showViewAll?: boolean;
  limit?: number;
}

// 예시 데이터
const mockSubscriptions = [
  {
    id: 1,
    title: '철학의 시작',
    owner: {
      name: '김철수',
      avatar: 'https://i.pravatar.cc/150?u=user1',
    },
    category: 'philosophy',
    hasNewUpdates: true,
    notificationsEnabled: true,
    lastUpdated: '2시간 전',
  },
  {
    id: 2,
    title: '고전 문학 작품들',
    owner: {
      name: '이영희',
      avatar: 'https://i.pravatar.cc/150?u=user2',
    },
    category: 'literature',
    hasNewUpdates: false,
    notificationsEnabled: true,
    lastUpdated: '1일 전',
  },
  {
    id: 3,
    title: '역사 속의 지혜',
    owner: {
      name: '박지민',
      avatar: 'https://i.pravatar.cc/150?u=user3',
    },
    category: 'history',
    hasNewUpdates: true,
    notificationsEnabled: false,
    lastUpdated: '3일 전',
  },
  {
    id: 4,
    title: '과학의 세계',
    owner: {
      name: '최동현',
      avatar: 'https://i.pravatar.cc/150?u=user4',
    },
    category: 'science',
    hasNewUpdates: false,
    notificationsEnabled: false,
    lastUpdated: '1주일 전',
  },
];

export function SubscriptionsList({
  title = '구독 중인 서재',
  showViewAll = true,
  limit = 3,
}: SubscriptionsListProps) {
  const router = useRouter();

  const subscriptions = mockSubscriptions.slice(0, limit);

  const handleSubscriptionClick = (id: number) => {
    router.push(`/libraries/${id}`);
  };

  const handleViewAllClick = () => {
    router.push('/profile/subscriptions');
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {showViewAll && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-gray-500 hover:text-gray-900"
            onClick={handleViewAllClick}
          >
            모두 보기
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {subscriptions.length > 0 ? (
          subscriptions.map(subscription => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onClick={handleSubscriptionClick}
            />
          ))
        ) : (
          <p className="py-3 text-center text-sm text-gray-500">
            구독 중인 서재가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
