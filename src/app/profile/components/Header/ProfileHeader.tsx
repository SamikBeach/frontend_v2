import { AuthDialog } from '@/components/Auth/AuthDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Check, UserCircle, UserPlus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FollowListType,
  useIsMyProfile,
  useUserFollow,
  useUserProfile,
} from '../../hooks';
import { ProfileEditDialog } from '../ProfileEditDialog';
import { FollowListDialog } from './FollowListDialog';

export default function ProfileHeader() {
  const params = useParams();
  const userId = Number(params.id as string);
  const { profileData } = useUserProfile(userId);

  const isMyProfile = useIsMyProfile();
  const currentUser = useCurrentUser();
  const {
    user,
    followers,
    following,
    isFollowing: initialIsFollowing,
  } = profileData;

  const { isFollowing, setIsFollowing, toggleFollow, isLoading } =
    useUserFollow(initialIsFollowing || false);

  // 초기 팔로우 상태 설정
  useEffect(() => {
    if (initialIsFollowing !== undefined) {
      setIsFollowing(initialIsFollowing);
    }
  }, [initialIsFollowing, setIsFollowing]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [followDialogType, setFollowDialogType] =
    useState<FollowListType | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // 사용자 표시 정보 설정
  const displayName = user.username || user.email?.split('@')[0] || '';
  const initial = displayName.charAt(0);

  // 팔로우 버튼 클릭 핸들러
  const handleFollowClick = async () => {
    if (!currentUser) {
      // 로그인 다이얼로그 표시
      setAuthDialogOpen(true);
      return;
    }

    await toggleFollow(user.id, user.username);
  };

  // 프로필 편집 다이얼로그 열기
  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  // 프로필 편집 다이얼로그 닫기
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  // 팔로워/팔로잉 다이얼로그 열기
  const handleOpenFollowDialog = (type: FollowListType) => {
    setFollowDialogType(type);
  };

  // 팔로워/팔로잉 다이얼로그 닫기
  const handleCloseFollowDialog = () => {
    setFollowDialogType(null);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto w-full md:pb-6">
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-24 w-24 border-4 border-white sm:h-32 sm:w-32">
              <AvatarImage
                src={user.profileImage || undefined}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-200 text-2xl font-medium text-gray-700">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {displayName}
                </h1>
              </div>
              <p className="mt-1 max-w-xl text-sm text-gray-600">
                {user.bio || '자기소개가 없습니다.'}
              </p>
              <div className="mt-2 flex gap-3 text-sm">
                <button
                  onClick={() => handleOpenFollowDialog('following')}
                  className="flex cursor-pointer items-center gap-1"
                >
                  <span className="font-semibold text-gray-900">
                    {following}
                  </span>
                  <span className="text-gray-500">팔로잉</span>
                </button>
                <div className="h-4 border-r border-gray-200" />
                <button
                  onClick={() => handleOpenFollowDialog('followers')}
                  className="flex cursor-pointer items-center gap-1"
                >
                  <span className="font-semibold text-gray-900">
                    {followers}
                  </span>
                  <span className="text-gray-500">팔로워</span>
                </button>
              </div>
            </div>
          </div>

          {isMyProfile ? (
            <Button
              onClick={handleOpenEditDialog}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              variant="outline"
            >
              <UserCircle className="h-4 w-4" />
              프로필 편집
            </Button>
          ) : (
            <Button
              onClick={handleFollowClick}
              className={`mt-4 flex w-full items-center justify-center gap-1.5 rounded-full sm:w-auto ${
                isFollowing
                  ? 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              } text-sm font-medium sm:mt-0`}
              variant={isFollowing ? 'outline' : 'default'}
              disabled={isLoading}
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

      {/* 프로필 편집 다이얼로그 */}
      <ProfileEditDialog
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        profileData={profileData}
      />

      {/* 팔로워/팔로잉 다이얼로그 - 조건부 렌더링 */}
      {followDialogType !== null && (
        <FollowListDialog
          userId={userId}
          type={followDialogType}
          isOpen={true}
          onClose={handleCloseFollowDialog}
        />
      )}

      {/* 로그인 다이얼로그 */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
}
