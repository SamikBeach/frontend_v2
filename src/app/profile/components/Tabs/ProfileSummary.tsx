import { cn } from '@/lib/utils';
import { AreaChart, Bell, Book, BookOpen, MessageSquare } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useUserProfile } from '../../hooks';

interface ProfileSummaryProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
}

export default function ProfileSummary({
  selectedSection,
  onSectionChange,
}: ProfileSummaryProps) {
  const params = useParams();
  const userId = Number(params.id as string);
  const { profileData } = useUserProfile(userId);

  // API에서 가져온 데이터 사용
  const { libraryCount, readCount, subscribedLibraryCount, reviewCount } =
    profileData;

  return (
    <div className="mx-auto w-full px-4 py-6">
      <div className="grid grid-cols-5 gap-3">
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
              {libraryCount}
            </span>
            <span className="text-xs text-gray-600">서재</span>
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
              {readCount}
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
              {reviewCount}
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
              {subscribedLibraryCount}
            </span>
            <span className="text-xs text-gray-600">구독한 서재</span>
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
