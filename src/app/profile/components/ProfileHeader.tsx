import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks';
import { Check, UserCircle, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useIsMyProfile } from '../hooks';

export default function ProfileHeader() {
  const currentUser = useCurrentUser();
  const params = useParams();
  const profileId = params?.id as string;
  const isMyProfile = useIsMyProfile();
  const [isFollowing, setIsFollowing] = useState(false);

  /**
   * 임시 데이터: 팔로워/팔로잉 수
   * TODO: API 연동 시 실제 데이터로 대체
   */
  const followers = 128;
  const following = 75;

  // 사용자 정보가 없는 경우 로딩 표시
  if (!currentUser) return null;

  // 현재는 currentUser 정보를 사용하지만, 실제로는 profileId를 기반으로 해당 사용자 정보를 조회해야 함
  // TODO: profileId를 이용하여 프로필 사용자 정보 조회 API 연동 필요
  const user = currentUser;

  // 사용자 표시 정보 설정
  const displayName = user.name || user.username || user.email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();

  // 팔로우 버튼 클릭 핸들러
  const handleFollowClick = () => {
    // TODO: 실제 팔로우 API 연동
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto w-full px-4 pt-8 pb-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-white">
              <AvatarImage src={user.avatar} alt={displayName} />
              <AvatarFallback className="bg-gray-200 text-2xl font-medium text-gray-700">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {displayName}
                </h1>
                {user.username && (
                  <div className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    @{user.username}
                  </div>
                )}
              </div>
              <p className="mt-1 max-w-xl text-sm text-gray-600">
                {user.bio ||
                  '고전 문학을 좋아하는 독서가입니다. 플라톤부터 도스토예프스키까지 다양한 작품을 읽고 있습니다.'}
              </p>
              <div className="mt-2 flex gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">
                    {following}
                  </span>
                  <span className="text-gray-500">팔로잉</span>
                </div>
                <div className="h-4 border-r border-gray-200" />
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">
                    {followers}
                  </span>
                  <span className="text-gray-500">팔로워</span>
                </div>
              </div>
            </div>
          </div>

          {isMyProfile ? (
            <Link href="/profile/settings">
              <Button
                className="mt-4 flex items-center gap-1.5 rounded-full border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 sm:mt-0"
                variant="outline"
              >
                <UserCircle className="h-4 w-4" />
                프로필 편집
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleFollowClick}
              className={`mt-4 flex items-center gap-1.5 rounded-full ${
                isFollowing
                  ? 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              } text-sm font-medium sm:mt-0`}
              variant={isFollowing ? 'outline' : 'default'}
            >
              {isFollowing ? (
                <>
                  <Check className="h-4 w-4" />
                  팔로잉
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  팔로우
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
