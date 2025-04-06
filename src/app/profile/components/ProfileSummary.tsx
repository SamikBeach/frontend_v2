import { cn } from '@/lib/utils';
import {
  AreaChart,
  Bell,
  Book,
  BookOpen,
  MessageSquare,
  Users,
} from 'lucide-react';

// 메뉴 아이템 정의
interface MenuItem {
  id: string;
  name: string;
  icon: React.ElementType;
  bgColor: string;
  iconBgColor: string;
  iconColor: string;
}

// 메뉴 아이템 정의
const menuItems: MenuItem[] = [
  {
    id: 'books',
    name: '내 서재',
    icon: BookOpen,
    bgColor: 'bg-blue-50',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'subscriptions',
    name: '구독한 서재',
    icon: Bell,
    bgColor: 'bg-green-50',
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 'read',
    name: '읽은 책',
    icon: Book,
    bgColor: 'bg-violet-50',
    iconBgColor: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    id: 'reviews',
    name: '내 리뷰',
    icon: MessageSquare,
    bgColor: 'bg-purple-50',
    iconBgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 'groups',
    name: '내 독서모임',
    icon: Users,
    bgColor: 'bg-amber-50',
    iconBgColor: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    id: 'stats',
    name: '내 통계',
    icon: AreaChart,
    bgColor: 'bg-green-50',
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
];

interface ProfileSummaryProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
}

export default function ProfileSummary({
  selectedSection,
  onSectionChange,
}: ProfileSummaryProps) {
  // 평가한 책 수
  const booksRated = 42;
  // 읽은 책 수
  const booksRead = 37;
  // 작성한 리뷰 수
  const reviewsWritten = 18;

  return (
    <div className="mx-auto w-full px-4 py-6">
      <div className="grid grid-cols-6 gap-3">
        {/* 내 서재 */}
        <button
          onClick={() => onSectionChange('books')}
          className={cn(
            `flex cursor-pointer flex-col items-center rounded-lg bg-blue-50 p-4 transition-transform hover:scale-105`,
            selectedSection === 'books' && 'ring-2 ring-gray-900 ring-offset-2'
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div className="mt-2 text-center">
            <span className="block text-xl font-bold text-gray-900">
              {booksRated}
            </span>
            <span className="text-xs text-gray-600">내 서재</span>
          </div>
        </button>

        {/* 읽은 책 */}
        <button
          onClick={() => onSectionChange('read')}
          className={cn(
            `flex cursor-pointer flex-col items-center rounded-lg bg-violet-50 p-4 transition-transform hover:scale-105`,
            selectedSection === 'read' && 'ring-2 ring-gray-900 ring-offset-2'
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
            <Book className="h-5 w-5 text-violet-600" />
          </div>
          <div className="mt-2 text-center">
            <span className="block text-xl font-bold text-gray-900">
              {booksRead}
            </span>
            <span className="text-xs text-gray-600">읽은 책</span>
          </div>
        </button>

        {/* 내 리뷰 */}
        <button
          onClick={() => onSectionChange('reviews')}
          className={cn(
            `flex cursor-pointer flex-col items-center rounded-lg bg-purple-50 p-4 transition-transform hover:scale-105`,
            selectedSection === 'reviews' &&
              'ring-2 ring-gray-900 ring-offset-2'
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
            <MessageSquare className="h-5 w-5 text-purple-600" />
          </div>
          <div className="mt-2 text-center">
            <span className="block text-xl font-bold text-gray-900">
              {reviewsWritten}
            </span>
            <span className="text-xs text-gray-600">내 리뷰</span>
          </div>
        </button>

        {/* 구독한 서재 */}
        <button
          onClick={() => onSectionChange('subscriptions')}
          className={cn(
            `flex cursor-pointer flex-col items-center rounded-lg border border-green-200 bg-white p-4 transition-transform hover:scale-105`,
            selectedSection === 'subscriptions' &&
              'ring-2 ring-gray-900 ring-offset-2'
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <Bell className="h-5 w-5 text-green-600" />
          </div>
          <div className="mt-2 text-center">
            <span className="block text-xl font-bold text-gray-900">
              &nbsp;
            </span>
            <span className="text-xs text-gray-600">구독한 서재</span>
          </div>
        </button>

        {/* 독서모임 */}
        <button
          onClick={() => onSectionChange('groups')}
          className={cn(
            `flex cursor-pointer flex-col items-center rounded-lg border border-amber-200 bg-white p-4 transition-transform hover:scale-105`,
            selectedSection === 'groups' && 'ring-2 ring-gray-900 ring-offset-2'
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <Users className="h-5 w-5 text-amber-600" />
          </div>
          <div className="mt-2 text-center">
            <span className="block text-xl font-bold text-gray-900">
              &nbsp;
            </span>
            <span className="text-xs text-gray-600">독서모임</span>
          </div>
        </button>

        {/* 통계 */}
        <button
          onClick={() => onSectionChange('stats')}
          className={cn(
            `flex cursor-pointer flex-col items-center rounded-lg border border-blue-200 bg-white p-4 transition-transform hover:scale-105`,
            selectedSection === 'stats' && 'ring-2 ring-gray-900 ring-offset-2'
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <AreaChart className="h-5 w-5 text-blue-600" />
          </div>
          <div className="mt-2 text-center">
            <span className="block text-xl font-bold text-gray-900">
              &nbsp;
            </span>
            <span className="text-xs text-gray-600">통계</span>
          </div>
        </button>
      </div>
    </div>
  );
}
