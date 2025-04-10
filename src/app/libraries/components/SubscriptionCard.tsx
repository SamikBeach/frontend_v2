import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

export interface SubscriptionCardProps {
  subscription: {
    id: number;
    title: string;
    owner: {
      name: string;
      avatar: string;
    };
    category: string;
    hasNewUpdates: boolean;
    notificationsEnabled: boolean;
    lastUpdated: string;
  };
  onClick: (id: number) => void;
}

export function SubscriptionCard({
  subscription,
  onClick,
}: SubscriptionCardProps) {
  const getCategoryColorForSubscription = (category: string) => {
    switch (category) {
      case 'philosophy':
        return '#FFF8E2';
      case 'literature':
        return '#F2E2FF';
      case 'history':
        return '#FFE2EC';
      case 'science':
        return '#E2FFFC';
      default:
        return '#E2E8F0';
    }
  };

  return (
    <div
      className="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50"
      onClick={() => onClick(subscription.id)}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={subscription.owner.avatar}
          alt={subscription.owner.name}
        />
        <AvatarFallback className="bg-blue-100 text-blue-600">
          {subscription.owner.name[0]}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate font-medium text-gray-900">
            {subscription.title}
          </h4>
          {subscription.hasNewUpdates && (
            <Badge className="bg-blue-500 text-white">새 소식</Badge>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {subscription.owner.name}님의 서재
        </p>
      </div>

      {subscription.notificationsEnabled ? (
        <Bell className="h-4 w-4 text-blue-500" />
      ) : (
        <Bell className="h-4 w-4 text-gray-300" />
      )}
    </div>
  );
}
