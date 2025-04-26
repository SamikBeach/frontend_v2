import { cn } from '@/lib/utils';
import {
  AreaChart,
  Bell,
  Book,
  BookOpen,
  MessageSquare,
  Users,
} from 'lucide-react';
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

  // 평균 별점 (실제로는 API에서 받아와야 함)
  const averageRating = 4.2;

  return (
    <div className="mx-auto w-full px-4 py-6">
      <div className="grid grid-cols-6 gap-3">
        {/* 읽은 책 - 첫번째 위치 */}
        <button
          onClick={() => onSectionChange('read')}
          className={cn(
            `flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors`,
            selectedSection === 'read'
              ? 'bg-violet-100'
              : 'bg-violet-50 hover:bg-violet-100'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full bg-violet-100',
              selectedSection === 'read' ? 'bg-violet-200' : ''
            )}
          >
            <Book
              className={cn(
                'h-5 w-5 text-violet-600',
                selectedSection === 'read' ? 'text-violet-700' : ''
              )}
            />
          </div>
          <div className="mt-2 text-center">
            <span
              className={cn(
                'block text-xl font-bold text-gray-900',
                selectedSection === 'read' ? 'text-gray-900' : ''
              )}
            >
              {readCount}
            </span>
            <span
              className={cn(
                'text-xs text-gray-600',
                selectedSection === 'read' ? 'text-gray-800' : ''
              )}
            >
              읽은 책
            </span>
          </div>
        </button>

        {/* 리뷰 - 두번째 위치로 이동 */}
        <button
          onClick={() => onSectionChange('reviews')}
          className={cn(
            `flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors`,
            selectedSection === 'reviews'
              ? 'bg-purple-100'
              : 'bg-purple-50 hover:bg-purple-100'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full bg-purple-100',
              selectedSection === 'reviews' ? 'bg-purple-200' : ''
            )}
          >
            <MessageSquare
              className={cn(
                'h-5 w-5 text-purple-600',
                selectedSection === 'reviews' ? 'text-purple-700' : ''
              )}
            />
          </div>
          <div className="mt-2 text-center">
            <div className="flex items-center justify-center">
              <span
                className={cn(
                  'block text-xl font-bold text-gray-900',
                  selectedSection === 'reviews' ? 'text-gray-900' : ''
                )}
              >
                {reviewCount}
              </span>
              <span
                className={cn(
                  'ml-1 text-sm text-amber-500',
                  selectedSection === 'reviews' ? 'text-amber-600' : ''
                )}
              >
                ★{averageRating.toFixed(1)}
              </span>
            </div>
            <span
              className={cn(
                'text-xs text-gray-600',
                selectedSection === 'reviews' ? 'text-gray-800' : ''
              )}
            >
              리뷰
            </span>
          </div>
        </button>

        {/* 내 서재 - 세번째 위치로 이동 */}
        <button
          onClick={() => onSectionChange('libraries')}
          className={cn(
            `flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors`,
            selectedSection === 'libraries'
              ? 'bg-blue-100'
              : 'bg-blue-50 hover:bg-blue-100'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full bg-blue-100',
              selectedSection === 'libraries' ? 'bg-blue-200' : ''
            )}
          >
            <BookOpen
              className={cn(
                'h-5 w-5 text-blue-600',
                selectedSection === 'libraries' ? 'text-blue-700' : ''
              )}
            />
          </div>
          <div className="mt-2 text-center">
            <span
              className={cn(
                'block text-xl font-bold text-gray-900',
                selectedSection === 'libraries' ? 'text-gray-900' : ''
              )}
            >
              {libraryCount}
            </span>
            <span
              className={cn(
                'text-xs text-gray-600',
                selectedSection === 'libraries' ? 'text-gray-800' : ''
              )}
            >
              서재
            </span>
          </div>
        </button>

        {/* 커뮤니티 활동 */}
        <button
          onClick={() => onSectionChange('community')}
          className={cn(
            `flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors`,
            selectedSection === 'community'
              ? 'bg-amber-100'
              : 'bg-amber-50 hover:bg-amber-100'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full bg-amber-100',
              selectedSection === 'community' ? 'bg-amber-200' : ''
            )}
          >
            <Users
              className={cn(
                'h-5 w-5 text-amber-600',
                selectedSection === 'community' ? 'text-amber-700' : ''
              )}
            />
          </div>
          <div className="mt-2 text-center">
            <span
              className={cn(
                'block text-xl font-bold text-gray-900',
                selectedSection === 'community' ? 'text-gray-900' : ''
              )}
            >
              {/* 커뮤니티 활동 수 (API에서 가져와야 함) */}0
            </span>
            <span
              className={cn(
                'text-xs text-gray-600',
                selectedSection === 'community' ? 'text-gray-800' : ''
              )}
            >
              커뮤니티
            </span>
          </div>
        </button>

        {/* 구독한 서재 */}
        <button
          onClick={() => onSectionChange('subscriptions')}
          className={cn(
            `flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors`,
            selectedSection === 'subscriptions'
              ? 'bg-green-100'
              : 'border border-green-200 bg-white hover:bg-green-50'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full bg-green-100',
              selectedSection === 'subscriptions' ? 'bg-green-200' : ''
            )}
          >
            <Bell
              className={cn(
                'h-5 w-5 text-green-600',
                selectedSection === 'subscriptions' ? 'text-green-700' : ''
              )}
            />
          </div>
          <div className="mt-2 text-center">
            <span
              className={cn(
                'block text-xl font-bold text-gray-900',
                selectedSection === 'subscriptions' ? 'text-gray-900' : ''
              )}
            >
              {subscribedLibraryCount}
            </span>
            <span
              className={cn(
                'text-xs text-gray-600',
                selectedSection === 'subscriptions' ? 'text-gray-800' : ''
              )}
            >
              구독한 서재
            </span>
          </div>
        </button>

        {/* 통계 */}
        <button
          onClick={() => onSectionChange('stats')}
          className={cn(
            `flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors`,
            selectedSection === 'stats'
              ? 'bg-blue-100'
              : 'border border-blue-200 bg-white hover:bg-blue-50'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full bg-blue-100',
              selectedSection === 'stats' ? 'bg-blue-200' : ''
            )}
          >
            <AreaChart
              className={cn(
                'h-5 w-5 text-blue-600',
                selectedSection === 'stats' ? 'text-blue-700' : ''
              )}
            />
          </div>
          <div className="mt-2 text-center">
            <span
              className={cn(
                'block text-xl font-bold text-gray-900',
                selectedSection === 'stats' ? 'text-gray-900' : ''
              )}
            >
              &nbsp;
            </span>
            <span
              className={cn(
                'text-xs text-gray-600',
                selectedSection === 'stats' ? 'text-gray-800' : ''
              )}
            >
              통계
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
