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
              ? 'bg-violet-200'
              : 'bg-violet-50 hover:bg-violet-200/70'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              selectedSection === 'read' ? 'bg-violet-300' : 'bg-violet-200'
            )}
          >
            <Book
              className={cn(
                'h-5 w-5',
                selectedSection === 'read'
                  ? 'text-violet-800'
                  : 'text-violet-700'
              )}
            />
          </div>
          <div className="mt-2 text-center">
            <span
              className={cn(
                'block text-xl font-bold',
                selectedSection === 'read' ? 'text-gray-900' : 'text-gray-800'
              )}
            >
              {readCount}
            </span>
            <span
              className={cn(
                'text-xs',
                selectedSection === 'read' ? 'text-gray-900' : 'text-gray-700'
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
              ? 'bg-purple-200'
              : 'bg-purple-50 hover:bg-purple-200/70'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              selectedSection === 'reviews' ? 'bg-purple-300' : 'bg-purple-200'
            )}
          >
            <MessageSquare
              className={cn(
                'h-5 w-5',
                selectedSection === 'reviews'
                  ? 'text-purple-800'
                  : 'text-purple-700'
              )}
            />
          </div>
          <div className="mt-2 text-center">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'text-sm font-medium',
                  selectedSection === 'reviews'
                    ? 'text-amber-600'
                    : 'text-amber-500'
                )}
              >
                ★{averageRating.toFixed(1)}
              </span>
              <span
                className={cn(
                  'text-xl font-bold',
                  selectedSection === 'reviews'
                    ? 'text-gray-900'
                    : 'text-gray-800'
                )}
              >
                {profileData.reviewCount.review}
              </span>
            </div>
            <span
              className={cn(
                'text-xs',
                selectedSection === 'reviews'
                  ? 'text-gray-900'
                  : 'text-gray-700'
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
              ? 'bg-blue-200'
              : 'bg-blue-50 hover:bg-blue-200/70'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              selectedSection === 'libraries' ? 'bg-blue-300' : 'bg-blue-200'
            )}
          >
            <BookOpen
              className={cn(
                'h-5 w-5',
                selectedSection === 'libraries'
                  ? 'text-blue-800'
                  : 'text-blue-700'
              )}
            />
          </div>
          <div className="mt-2 text-center">
            <span
              className={cn(
                'block text-xl font-bold',
                selectedSection === 'libraries'
                  ? 'text-gray-900'
                  : 'text-gray-800'
              )}
            >
              {libraryCount}
            </span>
            <span
              className={cn(
                'text-xs',
                selectedSection === 'libraries'
                  ? 'text-gray-900'
                  : 'text-gray-700'
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
              ? 'bg-amber-200'
              : 'bg-amber-50 hover:bg-amber-200/70'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              selectedSection === 'community' ? 'bg-amber-300' : 'bg-amber-200'
            )}
          >
            <Users
              className={cn(
                'h-5 w-5',
                selectedSection === 'community'
                  ? 'text-amber-800'
                  : 'text-amber-700'
              )}
            />
          </div>
          <div className="mt-2 text-center">
            <span
              className={cn(
                'block text-xl font-bold',
                selectedSection === 'community'
                  ? 'text-gray-900'
                  : 'text-gray-800'
              )}
            >
              {/* 커뮤니티 활동 수 - 일반, 토론, 질문, 모임 리뷰의 합계 */}
              {profileData.reviewCount.general +
                profileData.reviewCount.discussion +
                profileData.reviewCount.question +
                profileData.reviewCount.meetup}
            </span>
            <span
              className={cn(
                'text-xs',
                selectedSection === 'community'
                  ? 'text-gray-900'
                  : 'text-gray-700'
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
              ? 'bg-green-200'
              : 'border border-green-200 bg-white hover:bg-green-100'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              selectedSection === 'subscriptions'
                ? 'bg-green-300'
                : 'bg-green-200'
            )}
          >
            <Bell
              className={cn(
                'h-5 w-5',
                selectedSection === 'subscriptions'
                  ? 'text-green-800'
                  : 'text-green-700'
              )}
            />
          </div>
          <div className="mt-2 text-center">
            <span
              className={cn(
                'block text-xl font-bold',
                selectedSection === 'subscriptions'
                  ? 'text-gray-900'
                  : 'text-gray-800'
              )}
            >
              {subscribedLibraryCount}
            </span>
            <span
              className={cn(
                'text-xs',
                selectedSection === 'subscriptions'
                  ? 'text-gray-900'
                  : 'text-gray-700'
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
              ? 'bg-blue-200'
              : 'border border-blue-200 bg-white hover:bg-blue-100'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              selectedSection === 'stats' ? 'bg-blue-300' : 'bg-blue-200'
            )}
          >
            <AreaChart
              className={cn(
                'h-5 w-5',
                selectedSection === 'stats' ? 'text-blue-800' : 'text-blue-700'
              )}
            />
          </div>
          <div className="mt-2 text-center">
            <span
              className={cn(
                'block text-xl font-bold',
                selectedSection === 'stats' ? 'text-gray-900' : 'text-gray-800'
              )}
            >
              &nbsp;
            </span>
            <span
              className={cn(
                'text-xs',
                selectedSection === 'stats' ? 'text-gray-900' : 'text-gray-700'
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
